
'use strict';

var parser = require ('../parser');
var extend = require ('extend');

var Content = function () {
    this.data = null;
}; // Content ();

/**
 * @returns {Object}
 */
Content.prototype.getData = function () {
    return this.data;
}; // getData ();

/**
 * @returns {Object}
 */
module.exports.getCheck = function () {
    return [
        {key: 'title'       , values: {notfound: parser.ERROR   , empty: parser.ERROR}},
        {key: 'canonical'   , values: {notfound: parser.WARNING , empty: parser.ERROR}},
        {key: 'description' , values: {notfound: parser.ERROR   , empty: parser.WARNING}},
        {key: 'keywords'    , values: {notfound: parser.NOTICE  , empty: parser.NOTICE}},
        {key: 'h1'          , values: {notfound: parser.ERROR   , empty: parser.ERROR}},
        {key: 'ga'          , values: {notfound: parser.WARNING , empty: parser.ERROR}},
        {key: 'wt'          , values: {notfound: parser.WARNING , empty: parser.ERROR}},
        {
            key: 'robots',
            values: {notfound: parser.NOTICE, empty: parser.WARNING},
            contains: [
                {key: 'noindex'  , value: parser.ERROR},
                {key: 'nofollow' , value: parser.ERROR}
            ]
        }
    ];
}; // getCheck ();

/**
 * La fonction de retour "success" passe en paramètre un objet qui
 * contient les propriétés suivantes:
 *     href    : URL de la page analysée.
 *     notice  : tableau contenant les erreurs de type "Information".
 *     warning : tableau contenant les erreurs de type "Avertissement".
 *     error   : tableau contenant les erreurs de type "Fatale".
 *     result  : objet content le résultat de l'analyse de la page (parser.getContent pour + d'infos).
 *     time    : temps de réponse.
 * 
 * @param {String}   host
 * @param {String}   path
 * @param {Function} callback
 */
module.exports.scan = function (host, path, callback) {
    callback = extend ({
        success  : function (object) {},
        error    : function (e)      {},
        complete : function ()       {}
    }, callback);
    
    var content = new Content ();
    
    parser.getContent (host, path, {
        success: function (data) {
            if (data.result !== null) {
                var value, notice = [], warning = [], error = [];
                
                // Permet d'injecter les bonnes valeurs dans les
                // bons tableaux en fonction du type de retour.
                var infosMap = [];
                infosMap[parser.NOTICE]  = notice;
                infosMap[parser.WARNING] = warning;
                infosMap[parser.ERROR]   = error;
                
                module.exports.getCheck ().forEach (function (item1) {
                    if (data.result[item1.key] !== undefined) {
                        // Inexistant.
                        if (data.result[item1.key] === null) {
                            infosMap[item1.values.notfound].push (item1.key);
                        }
                        // Existant mais vide.
                        else if ((value = data.result[item1.key].trim ()) === '') {
                            infosMap[item1.values.empty].push (item1.key);
                        }
                        // Existant et rempli, vérification du contenu.
                        else if (item1.contains !== undefined) {
                            item1.contains.forEach (function (item2) {
                                if (value.indexOf (item2.key) > -1 && infosMap[item2.value] !== undefined) {
                                    infosMap[item2.value].push (item1.key + ':' + item2.key);
                                }
                            });
                        }
                    }
                });

                content.data = {
                    href    : host.concat (path),
                    notice  : notice,
                    warning : warning,
                    error   : error,
                    result  : data.result,
                    time    : data.time
                };

                callback.success (content);
            } else {
                callback.error (new Error ('impossible d\'analyser la page'));
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
