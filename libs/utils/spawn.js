
'use strict';

var child_process = require ('child_process');

/**
 * @param {String}   cmd
 * @param {Function} callback
 * @param {String}   [dir=process.cwd ()]
 */
module.exports.run = function (cmd, callback, dir) {
    var arr = cmd.trim ().replace (/\s\s+/g, ' ').split (' ');
    
    if (arr.length === 0) {
        callback (true, 'aucune commande à lancer');
    } else {
        var result = [];
        var child = child_process.spawn (arr[0], arr.slice (1, arr.length), {
            cwd: dir || process.cwd ()
        });
        
        var cleanBuffer = function (buffer) {
            var res = [];
            var currentString = '';
            buffer.toString ().split ("\n").forEach (function (item) {
                if ((currentString = item.trim ()) !== '') {
                    res.push (currentString);
                }
            });
            return res;
        }; // cleanBuffer ();
        
        child.stdout.on ('data', function (buffer) {
            result.push (buffer);
        });
        
        child.stderr.on ('data', function (buffer) {
            result = result.concat (cleanBuffer (buffer));
        });
        
        child.on ('error', function (err) {callback (true, err);});
        
        child.on ('exit', function (code) {
            callback (code !== 0, code === 0 ? result.join ('') : result);
        });
    }
}; // run ();
