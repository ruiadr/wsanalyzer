#!/usr/bin/env node

'use strict';

require ('./libs/utils/array');

var color = require ('bash-color');

String.prototype.repeat = function (num) {
    return new Array (num + 1).join (this);
}; // String.repeat ();

var write = {
    message: function (message, colors, styles, newline) {
        if (newline !== undefined && newline === true) {
            console.log ();
        }
        console.log (color.wrap (message, colors, styles));
    }, // message ();
    
    separator: function (str, colors, styles) {
        console.log (color.wrap (str.repeat (30), colors, styles));
    }, // separator ();
    
    notice: function (message, newline) {
        this.message (message, color.colors.WHITE, null, newline);
    }, // notice ();
    
    warning: function (message, newline) {
        this.message (message, color.colors.YELLOW, color.styles.hi_text, newline);
    }, // warning ();
    
    error: function (message, newline) {
        this.message (message, color.colors.RED, color.styles.hi_text, newline);
    }, // error ();
    
    success: function (message, newline) {
        this.message (message, color.colors.GREEN, color.styles.hi_text, newline);
    }, // success ();
    
    title: function (message, newline) {
        console.log ();
        this.separator ('* ', color.colors.BLACK, color.styles.hi_text);
        this.message (message, color.colors.BLUE, color.styles.hi_text, newline);
        console.log ();
    } // title ();
}; // write;

/**
 * @param   {Object} result
 * @returns {Object}
 */
var prepareContentResult = function (result) {
    var res      = {notice: null, warning: null, error: null},
        current  = null,
        value    = null,
        toConcat = null;
    ['notice', 'warning', 'error'].forEach (function (item1, index1) {
        current = [];
        result[item1].forEach (function (item, index) {
            if (item.indexOf (':') < 0) {
                value = result.result[result[item1][index]];
                toConcat = value === null ? ' (introuvable)' : ' (vide)';
                current.push (result[item1][index] + toConcat);
            } else {
                current.push (result[item1][index]);
            }
        });
        res[item1] = current;
    });
    return res;
}; // prepareContentResult ();

/**
 * @param   {Object} result
 * @returns {Object}
 */
var prepareRobotsResult = function (result) {
    var res     = {notice: null, warning: null, error: null},
        current = null;
    ['notice', 'warning', 'error'].forEach (function (item1) {
        current = [];
        result[item1].forEach (function (item) {
            for (var prop in item) {
                current.push (prop + ': ' + item[prop]);
            }
        });
        res[item1] = current;
    });
    return res;
}; // prepareRobotsResult ();

/**
 * @param {Object} logs
 * @param {String} prop
 * @param {String} propStr
 * @param {String} valueStr
 */
var writeContentResult = function (logs, prop, propStr, valueStr) {
    var str = '* ' + propStr + ': ' + valueStr;
    if (logs.error.indexOf (prop) > -1) {
        write.error (str);
    } else if (logs.warning.indexOf (prop) > -1) {
        write.warning (str);
    } else {
        write.notice (str);
    }
}; // writeContentResult ();

var Bot = require ('./libs/bot');
var bot = new Bot ();

var date = null;

bot.on ('start', function () {
    date = new Date ();
    write.success ("Début de l'analyse...");
});

bot.on ('end', function () {
    var time = (new Date () - date) / 1000;
    write.success ('Analyse terminée en ' + time + 's!', true);
    process.exit (0);
});

bot.on ('before', function (res) {
    switch (res.action) {
        case 'robots':
            write.title ('Analyse du "robots.txt" en cours...');
        break;
        
        case 'page':
            var page = res.value.path !== undefined ? res.value.path : '?';
            write.title ('Analyse de la page "' + page + '" en cours...');
        break;
        
        case 'sitemap':
            write.title ('Analyse du sitemap "http://' + res.value.host + res.value.path + '" en cours...');
        break;
    }
});

bot.on ('success', function (res) {
    switch (res.action) {
        case 'sitemapFull':
            write.notice ('Temps de réponse: ' + res.result.time + ' ms');
            var len = res.result.result.length;
            
            if (len === 0) {
                write.error ('Sitemap vide ou inaccessible!');
            } else {
                write.success ('Le sitemap contient "' + len + '" URL(s).');
            }
        break;
        
        case 'robots':
        case 'page':
            write.notice ('Temps de réponse: ' + res.result.time + ' ms');
            var count = 0;
            
            var result = res.action === 'page'
                ? prepareContentResult (res.result)
                : prepareRobotsResult (res.result);
                
            // Affichage des différents messages.
            ['error', 'warning', 'notice'].forEach (function (item) {
                if (result[item].length > 0) {
                    write[item] (item.toUpperCase () + ': ' + result[item].join (', ') + '.');
                    ++count;
                }
            });
            
            if (count === 0) {
                write.success ('Rien à signaler!');
            }
            
            // Affichage du rapport détaillé de la page courante.
            if (res.action === 'page') {
                console.log ();
                
                var resObject = res.result.result,
                    str       = null;
                
                for (var prop in resObject) {
                    str = resObject[prop] === null ? '?' : resObject[prop].trim ();
                    if (prop !== 'robots') {
                        writeContentResult (res.result, prop, prop, str);
                    }
                    // Traitement spécial pour la propriété "robots".
                    else {
                        str.split (',').trim ().forEach (function (item) { // Peut contenir plusieurs valeurs.
                            writeContentResult (res.result, prop + ':' + item, prop, item);
                        });
                    }
                }
            }
        break;
    }
});

bot.on ('error', function (res) {
    write.error ('Il y a eu une erreur!');
});

if (process.argv.length < 3) {
    write.error ('Veuillez saisir une adresse à analyser!');
    process.exit (1);
} else {
    bot.run (process.argv[2]);
}
