
'use strict';

var parser = require ('../parser');
var util   = require ('util');
var extend = require ('extend');

var Sitemap = function () {
    this.data = null;
}; // Sitemaps ();

/**
 * @returns {Object}
 */
Sitemap.prototype.getData = function () {
    return this.data;
}; // getData ();

/**
 * @param   {Number}        index
 * @returns {(Object|null)}
 */
Sitemap.prototype.getByIndex = function (index) {
    if (this.data !== null && util.isArray (this.data.result) && index < this.data.result.length) {
        return this.data.result[index];
    }
    return null;
}; // getByIndex ();

/**
 * La fonction de retour "success" passe en paramètre un objet qui
 * contient les propriétés suivante:
 *     notice  : tableau contenant les erreurs de type "Information".
 *     warning : tableau contenant les erreurs de type "Avertissement".
 *     error   : tableau contenant les erreurs de type "Fatale".
 *     result  : tableau content le résultat de l'analyse du sitemap (parser.getSitemap pour + d'infos).
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
    
    var sitemap = new Sitemap ();
    
    parser.getSitemap (host, path, {
        success: function (data) {
            if (data.result !== null) {
                var notice = [], warning = [], error = [];
                
                sitemap.data = {
                    notice  : notice,
                    warning : warning,
                    error   : error,
                    result  : data.result,
                    time    : data.time
                };

                callback.success (sitemap);
            } else {
                callback.error (new Error ('impossible d\'analyser le sitemap'));
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
