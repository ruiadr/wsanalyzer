
'use strict';

var util       = require ('util');
var wsanalyzer = require ('wsanalyzer');

// Analyse le "robots.txt".
// Pour + d'infos sur le contenu de "object": ./libs/analyzers/robots.js#scan
wsanalyzer.robots.scan ('adrien-ruiz.fr', {
    success: function (object) {
        console.log (util.inspect (object, {depth: 5}));
    },
    error: function (e) {
        console.log (e);
    },
    complete: function () {
    }
});

// Analyse le "sitemap.xml".
// Pour + d'infos sur le contenu de "object": ./libs/analyzers/sitemap.js#scan
wsanalyzer.sitemap.scan ('adrien-ruiz.fr', '/sitemap.xml', {
    success: function (object) {
        console.log (util.inspect (object, {depth: 4}));
    },
    error: function (e) {
        console.log (e);
    },
    complete: function () {
    }
});

// Analyse les informations d'une page.
// Pour + d'infos sur le contenu de "object": ./libs/analyzers/content.js#scan
wsanalyzer.content.scan ('adrien-ruiz.fr', '/', {
    success: function (object) {
        console.log (util.inspect (object, {depth: 4}));
    },
    error: function (e) {
        console.log (e);
    },
    complete: function () {
    }
});
