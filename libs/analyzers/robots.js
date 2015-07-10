
'use strict';

var parser = require ('../parser');
var util   = require ('util');
var extend = require ('extend');

var Robots = function () {
    this.data = null;
}; // Robots ();

/**
 * @returns {Object}
 */
Robots.prototype.getData = function () {
    return this.data;
}; // getData ();

/**
 * @param   {String}
 * @returns {(Object|null)}
 */
Robots.prototype.getByUserAgent = function (ua) {
    if (this.data !== null && util.isArray (this.data.result) && util.isArray (this.data.agent)) {
        var index = this.data.agent.indexOf (ua);
        if (index > -1) {
            return this.data.result[index];
        }
    }
    return null;
}; // getByUserAgent ();

/**
 * @returns {Object}
 */
module.exports.getCheck = function () {
    return [
        {
            uagent: '*',
            values: [
                {
                    key: 'disallow',
                    contains: [
                        {key: '*' , value: parser.ERROR},
                        {key: '/' , value: parser.ERROR}
                    ]
                }
            ]
        }
     ];
}; // getCheck ();

/**
 * La fonction de retour "success" passe en paramètre un objet qui
 * contient les propriétés suivante:
 *     notice  : tableau contenant les erreurs de type "Information".
 *     warning : tableau contenant les erreurs de type "Avertissement".
 *     error   : tableau contenant les erreurs de type "Fatale".
 *     result  : tableau content le résultat de l'analyse du "robots.txt" (parser.getRobots pour + d'infos)
 *               rangé par "UserAgent".
 *     agent   : tableau contenant les "UserAgent" du "robots.txt" indexés sur le tableau result.
 *               exemple: agent[3] correspond à result[3].
 *     time    : temps de réponse.
 * 
 * @param {String}   host
 * @param {Function} callback
 */
module.exports.scan = function (host, callback) {
    callback = extend ({
        success  : function (object) {},
        error    : function (e)      {},
        complete : function ()       {}
    }, callback);
    
    var robots = new Robots ();

    parser.getRobots (host, {
        success: function (data) {
            if (data.result.length > 0) {
                var indexAgent, notice = [], warning = [], error = [];

                // Permet d'injecter les bonnes valeurs dans les
                // bons tableaux en fonction du type de retour.
                var infosMap = [];
                infosMap[parser.NOTICE]  = notice;
                infosMap[parser.WARNING] = warning;
                infosMap[parser.ERROR]   = error;

                module.exports.getCheck ().forEach (function (item1) {
                    if (item1.uagent !== undefined
                            && (indexAgent = data.agent.indexOf (item1.uagent)) > -1
                            && util.isArray (item1.values)) {
                        item1.values.forEach (function (item2) {
                            if (item2.key !== undefined && util.isArray (item2.contains)) {
                                item2.contains.forEach (function (item3) {
                                    if (item3.key !== undefined
                                            && data.result[indexAgent][item2.key].indexOf (item3.key) > -1
                                            && infosMap[item3.value] !== undefined) {
                                        infosMap[item3.value].push ({uagent: item1.uagent, disallow: item3.key});
                                    }
                                });
                            }
                        });
                    }
                });
                
                robots.data = {
                    notice  : notice,
                    warning : warning,
                    error   : error,
                    result  : data.result,
                    agent   : data.agent,
                    time    : data.time
                };
                
                callback.success (robots);
            } else {
                callback.error (new Error ('fichier "robots.txt" introuvable ou mal formaté'));
            }
        },
        error: function (e) {
            callback.error (e);
        },
        complete: function () {
            callback.complete ();
        }
    });
}; // scan ();
