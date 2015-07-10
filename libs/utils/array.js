
'use strict';

/**
 * @returns {Array}
 */
Array.prototype.trim = function () {
    return this.map (Function.prototype.call, String.prototype.trim);
}; // trim ();
