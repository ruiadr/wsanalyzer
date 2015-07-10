
'use strict';

var request = require ('request');
var xml2js  = require ('xml2js').parseString;
var cst     = require ('node-constants');
var extend  = require ('extend');
var util    = require ('util');

var ctype = require ('./utils/ctype');
var spawn = require ('./utils/spawn');
var url   = require ('./utils/url');

// Contantes "publiques" du module.
cst.define (module.exports, {
    'NOTICE'  : 'TYPE_NOTICE',
    'WARNING' : 'TYPE_WARNING',
    'ERROR'   : 'TYPE_ERROR'
});

/**
 * @param {Object} options
 */
var getContents = function (options) {
    options = extend ({
        host    : 'www.adrien-ruiz.fr', // ;)
        path    : '/',
        success : function (data, code, headers, time) {},
        error   : function (e) {}
    }, options);
    
    var start = new Date ();
    
    request ('http://' + options.host + options.path, function (error, response, body) {
        if (!error) {
            options.success (body, response.statusCode, response.headers, new Date () - start);
        } else {
            options.error (error);
        }
    });
}; // getContents ();

/**
 * La fonction de retour "success" passe en paramètre un objet qui
 * contient les propriétés suivante:
 *     result : tableau contenant des objets de la forme
 *              {
 *                  uagent   : <String>,
 *                  allow    : [<String>],
 *                  disallow : [<String>],
 *                  sitemap  : [<String>]
 *              }
 *     time   : temps de réponse.
 * 
 * @param {String}   host
 * @param {Function} callback
 */
module.exports.getRobots = function (host, callback) {
    callback = extend ({
        success  : function (object) {},
        error    : function (e)      {},
        complete : function ()       {}
    }, callback);
    
    getContents ({
        host: host,
        path: '/robots.txt',
        success: function (data, statusCode, headers, time) {
            callback.complete ();
            
            var result = [], agent = [];
            
            if (parseInt (statusCode) !== 404 && ctype.isTextPlain (headers['content-type'])) {
                var line, matches, json, variable, extract;
                
                data.split ("\n").forEach (function (item) {
                    if ((line = item.trim ()) !== '') {
                        if ((matches = /([^:]*)\s?:\s?(.*)/.exec (line)) !== null) {
                            if ((variable = matches[1].trim ().toLowerCase ()) === 'user-agent') {
                                if (json) { // Précèdent "User-Agent".
                                    result.push (json);
                                }
                                
                                json = {
                                    uagent   : matches[2].trim ().toLowerCase (),
                                    allow    : [],
                                    disallow : [],
                                    sitemap  : []
                                };
                                agent.push (json.uagent);
                            }
                            
                            else if (variable === 'allow') {
                                json.allow.push (matches[2].trim ().toLowerCase ());
                            }
                            
                            else if (variable === 'disallow') {
                                json.disallow.push (matches[2].trim ().toLowerCase ());
                            }
                            
                            else if (variable === 'sitemap') {
                                extract = url.extractURLInfos (matches[2]);
                                json.sitemap.push ({host: extract.host, path: extract.path});
                            }
                        }
                    }
                });
                
                if (json !== null) {
                    result.push (json);
                }
            }
            
            callback.success ({result: result, agent: agent, time: time});
        },
        error: function (e) {
            callback.complete ();
            callback.error (e);
        }
    });
}; // getRobots ();

/**
 * La fonction de retour "success" passe en paramètre un objet qui
 * contient les propriétés suivante:
 *     result : tableau contenant les URLS du sitemap, les valeurs du tableau
 *              sont des objets de la forme
 *              {
 *                  loc: [<String>]
 *              }
 *     time   : temps de réponse.
 * 
 * @param {String}   host
 * @param {String}   path
 * @param {Function} callback
 */
module.exports.getSitemap = function (host, path, callback) {
    callback = extend ({
        success  : function (object) {},
        error    : function (e)      {},
        complete : function ()       {}
    }, callback);
    
    getContents ({
        host: host,
        path: path,
        success: function (data, statusCode, headers, time) {
            callback.complete ();
            
            var result = [];
            
            if (parseInt (statusCode) !== 404 && ctype.isXML (headers['content-type'])) {
                xml2js (data, {trim: true}, function (err, res) {
                    if (!err && res.urlset !== undefined && util.isArray (res.urlset.url)) {
                         result = res.urlset.url;
                    }
                    callback.success ({result: result, time: time});
                });
            } else {
                callback.success ({result: result, time: time});
            }
        },
        error: function (e) {
            callback.complete ();
            callback.error (e);
        }
    });
}; // getSitemap ();

/**
 * @returns {Object}
 */
module.exports.getContentCheck = function () {
    return [
        {key: 'title'       , exp: /<title[^>]*>([\s\S]*)<\/title>/gmi},
        {key: 'canonical'   , exp: /<link\s*rel="canonical"\s*href="([^"]*)/gi},
        {key: 'description' , exp: /<meta\s*name="description"\s*content="([^"]*)/gi},
        {key: 'keywords'    , exp: /<meta\s*name="keywords"\s*content="([^"]*)/gi},
        {key: 'robots'      , exp: /<meta\s*name="robots"\s*content="([^"]*)/gi},
        {key: 'h1'          , exp: /<h1\b[^>]*>([\s\S]*?)<\/h1>/gmi},
        {key: 'ga'          , exp: /(ua-\d{4,9}-\d{1,4})/gi},
        {key: 'wt'          , exp: /<meta\s*name="google-site-verification"\s*content="([^"]*)/gi}
    ];
}; // getContentCheck ();

/**
 * La fonction de retour "success" passe en paramètre un objet qui
 * contient les propriétés suivante:
 *     result : objet de la forme
 *              {
 *                  title       : <String|null>,
 *                  canonical   : <String|null>,
 *                  description : <String|null>,
 *                  keywords    : <String|null>,
 *                  robots      : <String|null>,
 *                  h1          : <String|null>,
 *                  ga          : <String|null>,
 *                  wt          : <String|null>
 *              }
 *     time   : temps de réponse.
 * 
 * @param {String}   host
 * @param {Function} callback
 */
module.exports.getContent = function (host, path, callback) {
    callback = extend ({
        success  : function (object) {},
        error    : function (e)      {},
        complete : function ()       {}
    }, callback);
    
    getContents ({
        host: host,
        path: path,
        success: function (data, statusCode, headers, time) {
            callback.complete ();
            
            var result = null;
            
            if (parseInt (statusCode) !== 404 && ctype.isHTML (headers['content-type'])) {
                result = {};
                
                var res;
                module.exports.getContentCheck ().forEach (function (item) {
                    if ((res = item.exp.exec (data)) !== null) {
                        result[item.key] = res[1];
                    } else {
                        result[item.key] = null;
                    }
                });
                
                if (result.wt === null) {
                    // On consulte les champs TXT du domaine.
                    var cmd = 'dig TXT ' + url.extractURLInfos (host).domain + ' +short';
                    spawn.run (cmd, function (error, res) {
                        var gsv = '';
                        if (!error && (gsv = /google-site-verification=([^"]*)/.exec (res)) !== null) {
                            result.wt = gsv[1];
                        }
                        callback.success ({result: result, time: time});
                    });
                } else {
                    callback.success ({result: result, time: time});
                }
            } else {
                callback.success ({result: result, time: time});
            }
        },
        error: function (e) {
            callback.complete ();
            callback.error (e);
        }
    });
}; // getContent ();
