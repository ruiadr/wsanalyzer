
'use strict';

var extend       = require ('extend');
var random_js    = require ('random-js');
var url          = require ('url');
var async        = require ('async');
var shuffle      = require ('shuffle-array');
var util         = require ('util');
var EventEmitter = require ('events').EventEmitter;

var robots  = require ('./analyzers/robots');
var content = require ('./analyzers/content');
var sitemap = require ('./analyzers/sitemap');

var utils_url = require ('./utils/url')

var Bot = function () {};

util.inherits (Bot, EventEmitter);

module.exports = Bot;

/**
 * @param {String} host
 * @param {Object} options
 */
Bot.prototype.run = function (host, options) {
    options = extend ({
        sitemap: {
            limit: 5
        }
    }, options);
    
    // Pour être certain de ne récupèrer que le host.
    host = utils_url.extractURLInfos (host).host;
    
    if (options.sitemap.limit > 10) {
        options.sitemap.limit = 10;
    }
    
    var self = this;
    
    var robotsObject = null;
    
    self.emit ('start');
    
    require ('async').series ([
        // 1. Analyse de la page d'accueil.
        function (callback) {
           var res = {step: 1, action: 'page', value: {host: host, path: '/'}};
           self.emit ('before', res);
           
           content.scan (host, '/', {
               success: function (object) {
                   res.result = object.getData ();
                   self.emit ('success', res);
                   callback (false, res);
               },
               error: function (e) {
                   self.emit ('error', res);
                   callback (false, res);
               }
           });
        },
        
        // 2. Analyse du robots.txt.
        function (callback) {
            var res = {step: 2, action: 'robots', value: {host: host, path: '/robots.txt'}};
            self.emit ('before', res);
            
            robots.scan (host, {
                success: function (object) {
                    robotsObject = object;
                    
                    res.result = object.getData ();
                    self.emit ('success', res);
                    callback (false, res);
                },
                error: function (e) {
                    self.emit ('error', res);
                    callback (false, res);
                }
            });
        },
        
        // 3. Analyse du sitemap et de "options.sitemap.limit" page(s).
        function (callback) {
            var list = [];
            
            if (robotsObject !== null) {
                list = robotsObject.getByUserAgent ('*').sitemap;
            }
            
            if (list.length === 0) {
                list.push ({host: host, path: '/sitemap.xml'}); // Tentative par défaut.
            }
            
            var resultSitemapList = {step: 3, action: 'sitemapList', value: list};
            self.emit ('before', resultSitemapList);
            
            async.eachSeries (list, function (entrySitemap, callbackSitemap) {
                var resultSitemap = {step: 3, action: 'sitemap', value: entrySitemap};
                self.emit ('before', resultSitemap);
                
                sitemap.scan (entrySitemap.host, entrySitemap.path, {
                    success: function (objectSitemap) {
                        var dataSitemap = objectSitemap.getData (),
                            checkURL    = [];
                        
                        var currentResult = {step: 3, action: 'sitemapFull', value: entrySitemap, result: dataSitemap};
                        self.emit ('success', currentResult);
                        
                        // Pas assez d'URL.
                        if (dataSitemap.result.length < options.sitemap.limit) {
                            checkURL = dataSitemap.result;
                        }
                        // Evite une éventuelle boucle infinie du bloc conditionnel suivant.
                        else if ((dataSitemap.result.length >> 2) < options.sitemap.limit) {
                            checkURL = shuffle (dataSitemap.result).splice (0, options.sitemap.limit);
                        }
                        // On récupère aléatoirement "options.sitemap.limit" page(s).
                        else {
                            var randomValue, length = dataSitemap.result.length - 1, indexes = [];
                            
                            while (true) {
                                var random = new random_js (random_js.engines.mt19937 ().autoSeed ());
                                randomValue = random.integer (1, length);
                                
                                if (indexes.indexOf (randomValue) < 0) {
                                    indexes.push (randomValue);
                                    checkURL.push (dataSitemap.result[randomValue]);
                                }
                                
                                if (indexes.length >= options.sitemap.limit) {
                                    break;
                                }
                            }
                        }
                        
                        resultSitemapList.result = [];
                        
                        if (checkURL.length > 0) {
                            resultSitemap.result = [];
                            
                            async.eachSeries (checkURL, function (entryURL, callbackURL) {
                                var loc = url.parse (entryURL.loc[0]);
                                var resultPage = {step: 3, action: 'page', value: {host: loc.host, path: loc.path}};
                                self.emit ('before', resultPage);
                                
                                content.scan (loc.host, loc.path, {
                                    success: function (dataObject) {
                                        resultPage.result = dataObject.getData ();
                                        resultSitemap.result.push (resultPage);
                                        self.emit ('success', resultPage);
                                        callbackURL (false);
                                    },
                                    error: function (e) {
                                        resultSitemap.result.push (resultPage);
                                        self.emit ('error', resultPage);
                                        callbackURL (false);
                                    }
                                });
                            },
                            function (e) {
                                resultSitemapList.result.push (resultSitemap);
                                self.emit ('success', resultSitemap);
                                callbackSitemap (false);
                            });
                        } else {
                            resultSitemapList.result.push (resultSitemap);
                            self.emit ('success', resultSitemap);
                            callbackSitemap (false);
                        }
                    },
                    error: function (e) {
                        self.emit ('error', resultSitemap);
                        callbackSitemap (false);
                    }
                });
            },
            function (e) {
                self.emit ('success', resultSitemapList);
                callback (false, resultSitemapList);
            });
        }
    ],
    function (e, result) {
        self.emit ('end', result);
    });
}; // Bot ();
