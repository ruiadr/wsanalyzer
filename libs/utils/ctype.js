
'use strict';

var util = require ('util');

var CType = function () {};

/**
 * @param   {String}         contentType
 * @param   {(String|Array)} search
 * @returns {Boolean}
 */
CType.prototype.contentTypeContains = function (contentType, search) {
    if (!util.isArray (search)) {
        search = [search];
    }
    
    var counter = 0;
    
    search.forEach (function (item) {
        if (new RegExp ('\s*(?:' + item.trim () + ')(?:\s*;?.*)$').test (contentType)) {
            ++counter;
        }
    });
    
    return counter > 0;
}; // contentTypeContains ();

/**
 * @param   {String}  contentType
 * @returns {Boolean}
 */
CType.prototype.isTextPlain = function (contentType) {
    return this.contentTypeContains (contentType, 'text/plain');
}; // isTextPlain ();

/**
 * @param   {String}  contentType
 * @returns {Boolean}
 */
CType.prototype.isXML = function (contentType) {
    return this.contentTypeContains (contentType, ['text/xml', 'application/xml']);
}; // isXML ();

/**
 * @param   {String}  contentType
 * @returns {Boolean}
 */
CType.prototype.isHTML = function (contentType) {
    return this.contentTypeContains (contentType, ['text/html']);
}; // isHTML ();

module.exports = new CType ();
