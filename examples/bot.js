
'use strict';

var util       = require ('util');
var wsanalyzer = require ('wsanalyzer');

//
// Le workflow suivi par le robot est détaillé ici https://github.com/ruiadr/wsanalyzer,
// il est composé de 3 grandes étapes:
//     1/ Analyse de la page d'accueil
//     2/ Analyse du "robots.txt"
//     3/ Analyse du/des sitemap(s) déclaré(s) dans le "robots.txt" ("/sitemap.xml" le cas échéant)
// 
// Pour tous les événements (utilisés ci-après), "res" est un objet de la forme
// {step: <Number>, action: <String>, value: <Object>[, result: <Array>]}
//
// - - - - - -
// step   : numéro de l'étape d'analyse par le robot (1, 2 ou 3)
// - - - - - -
// action : type d'analyse (page, robots, sitemapList, sitemap, sitemapFull)
//              page        > Analyse d'une page du site
//              robots      > Analyse du "robots.txt"
//              sitemapList > Liste d'analyse du/de(s) sitemap(s)
//              sitemap     > Analyse de x pages du sitemap, le robot lèvera une action d'analyse
//                            de type "page" pour chacune d'entre-elles
//              sitemapFull > Sitemap complet (tableau d'URLs), uniquement au "success"
// - - - - - -
// value  : objet contenant les propriétés "host" et "path" de la ressource à analyser
// - - - - - -
// result : uniquement au "success"
//              page        > ./lib/analyzers/content.js#scan
//              robots      > ./lib/analyzers/robots.js#scan
//              sitemapList > [<sitemap>]
//              sitemap     > ./lib/analyzers/sitemap.js#scan
//              sitemapFull > ./lib/parser.js#getSitemap
// - - - - - -
//

var bot = new wsanalyzer.bot ();

bot.on ('start', function () {
    console.log ("## bot.start");
});

bot.on ('end', function (res) {
    console.log ("## bot.end");
    console.log (util.inspect (res, {depth: 6}));
});

bot.on ('before', function (res) {
    console.log ("## bot.before");
    console.log (res.action);
});

bot.on ('success', function (res) {
    console.log ("## bot.success");
    console.log (res.action);
});

bot.on ('error', function (res) {
    console.log ("## bot.error");
    console.log (res.action);
});

bot.run ('adrien-ruiz.fr', {sitemap: {limit: 2}});
