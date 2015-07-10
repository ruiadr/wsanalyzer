
'use strict';

var URL = function () {};

/**
 * @param   {String} str
 * @returns {Object}
 */
URL.prototype.extractURLInfos = function (str) {
    var result = {host: null, path: null},
        value  = str.trim ().replace (/https?:\/\//, '').replace ('//', '').split ('/');
    
    if (value[0] === '') { // Vide ?
        value.splice (0, 1);
    }
    
    if (value[0].indexOf ('.') > -1) { // Présence du "host" ?
        result.host = value.splice (0, 1)[0];
        
        var domain = result.host.split ('.');
        if (domain.length > 2) {
            domain = domain.splice (1, domain.length - 1);
        }
        result.domain = domain.join ('.');
    }
    
    result.path = '/'.concat (value.join ('/')); // "path".
    
    return result;
}; // extractURLInfos ();

module.exports = new URL ();
