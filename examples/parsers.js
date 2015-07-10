
'use strict';

var util       = require ('util');
var wsanalyzer = require ('wsanalyzer');

// Récupère le "robots.txt".
// Pour + d'infos sur le contenu de "object": ./libs/parser.js#getRobots
wsanalyzer.parser.getRobots ('adrien-ruiz.fr', {
    success: function (object) {
        console.log (util.inspect (object, {depth: 5}));
    },
    error: function (e) {
        console.log (e);
    },
    complete: function () {
    }
});

// Récupère le sitemap.
// Pour + d'infos sur le contenu de "object": ./libs/parser.js#getSitemap
wsanalyzer.parser.getSitemap ('adrien-ruiz.fr', '/sitemap.xml', {
    success: function (object) {
        console.log (util.inspect (object, {depth: 4}));
    },
    error: function (e) {
        console.log (e);
    },
    complete: function () {
    }
});

// Récupère certaines informations d'une page.
// Pour + d'infos sur le contenu de "object": ./libs/parser.js#getContent
wsanalyzer.parser.getContent ('adrien-ruiz.fr', '/', {
    success: function (object) {
        console.log (util.inspect (object, {depth: 4}));
    },
    error: function (e) {
        console.log (e);
    },
    complete: function () {
    }
});
