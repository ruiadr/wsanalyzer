
var assert = require ('assert');

require ('../libs/utils/array');
var spawn = require ('../libs/utils/spawn');
var ctype = require ('../libs/utils/ctype');
var url_utils = require ('../libs/utils/url');

describe ('Array', function () {
    describe ("#[' test0 ', 'test1 ', ' test2', ' test 3 ', 'test  4 ', ' test   5'].trim()", function () {
        it ('devrait "trimer" toutes les entrées du tableau', function () {
            var testArray = [' test0 ', 'test1 ', ' test2', ' test 3 ', 'test  4 ', ' test   5'].trim ();
            
            assert.equal ('test0'    , testArray[0]);
            assert.equal ('test1'    , testArray[1]);
            assert.equal ('test2'    , testArray[2]);
            assert.equal ('test 3'   , testArray[3]);
            assert.equal ('test  4'  , testArray[4]);
            assert.equal ('test   5' , testArray[5]);
        });
    });
});

describe ('Spawn', function () {
    describe ('#run("echo test")', function () {
        it ('ne devrait pas générer une erreur', function (done) {
            spawn.run ('echo test', function (error, res) {
                if (error) throw new Error (res);
                done ();
            });
        });
    });
    
    describe ('#run("loremipsumdolorsitamet")', function () {
        it ('devrait générer une erreur', function (done) {
            spawn.run ('loremipsumdolorsitamet', function (error, res) {
                if (error) done ();
                throw new Error ('Ne génère pas d\'erreur !?');
            });
        });
    });
});

describe ('CType', function () {
    describe ('#isXML("text/xml")', function () {
        it ('devrait retourner true', function () {
            assert.equal (true, ctype.isXML ('text/xml'));
        });
    });
    
    describe ('#isXML("application/xml")', function () {
        it ('devrait retourner true', function () {
            assert.equal (true, ctype.isXML ('application/xml'));
        });
    });
    
    describe ('#isXML("  text/xml  ")', function () {
        it ('devrait retourner true', function () {
            assert.equal (true, ctype.isXML ('  text/xml  '));
        });
    });
    
    describe ('#isXML("text/xml; charset=utf-8")', function () {
        it ('devrait retourner true', function () {
            assert.equal (true, ctype.isXML ('text/xml; charset=utf-8'));
        });
    });
    
    describe ('#isXML("  text/xml  ;  charset=utf-8  ")', function () {
        it ('devrait retourner true', function () {
            assert.equal (true, ctype.isXML ('  text/xml  ;  charset=utf-8  '));
        });
    });
    
    describe ('#isXML("text")', function () {
        it ('devrait retourner false', function () {
            assert.equal (false, ctype.isXML ('text'));
        });
    });
    
    // Inutile de tester les autres fonctions car elles se basent toutes
    // sur le même pattern de validation de "contentTypeContains".
});

describe ('URL', function () {
    describe ('#extractURLInfos("adrien-ruiz.fr")', function () {
        it ('devrait retourner true', function () {
            var result = url_utils.extractURLInfos ('adrien-ruiz.fr');
            
            assert.equal ('adrien-ruiz.fr' , result.host);
            assert.equal ('adrien-ruiz.fr' , result.domain);
            assert.equal ('/'              , result.path);
        });
    });
    
    describe ('#extractURLInfos("//adrien-ruiz.fr")', function () {
        it ('devrait retourner true', function () {
            var result = url_utils.extractURLInfos ('//adrien-ruiz.fr');
            
            assert.equal ('adrien-ruiz.fr' , result.host);
            assert.equal ('adrien-ruiz.fr' , result.domain);
            assert.equal ('/'              , result.path);
        });
    });
    
    describe ('#extractURLInfos("http://adrien-ruiz.fr")', function () {
        it ('devrait retourner true', function () {
            var result = url_utils.extractURLInfos ('http://adrien-ruiz.fr');
            
            assert.equal ('adrien-ruiz.fr' , result.host);
            assert.equal ('adrien-ruiz.fr' , result.domain);
            assert.equal ('/'              , result.path);
        });
    });
    
    describe ('#extractURLInfos("http://adrien-ruiz.fr/test.html")', function () {
        it ('devrait retourner true', function () {
            var result = url_utils.extractURLInfos ('http://adrien-ruiz.fr/test.html');
            
            assert.equal ('adrien-ruiz.fr' , result.host);
            assert.equal ('adrien-ruiz.fr' , result.domain);
            assert.equal ('/test.html'     , result.path);
        });
    });
    
    describe ('#extractURLInfos("www.adrien-ruiz.fr")', function () {
        it ('devrait retourner true', function () {
            var result = url_utils.extractURLInfos ('www.adrien-ruiz.fr');
            
            assert.equal ('www.adrien-ruiz.fr' , result.host);
            assert.equal ('adrien-ruiz.fr'     , result.domain);
            assert.equal ('/'                  , result.path);
        });
    });
    
    describe ('#extractURLInfos("//www.adrien-ruiz.fr")', function () {
        it ('devrait retourner true', function () {
            var result = url_utils.extractURLInfos ('//www.adrien-ruiz.fr');
            
            assert.equal ('www.adrien-ruiz.fr' , result.host);
            assert.equal ('adrien-ruiz.fr'     , result.domain);
            assert.equal ('/'                  , result.path);
        });
    });
    
    describe ('#extractURLInfos("http://www.adrien-ruiz.fr")', function () {
        it ('devrait retourner true', function () {
            var result = url_utils.extractURLInfos ('http://www.adrien-ruiz.fr');
            
            assert.equal ('www.adrien-ruiz.fr' , result.host);
            assert.equal ('adrien-ruiz.fr'     , result.domain);
            assert.equal ('/'                  , result.path);
        });
    });
    
    describe ('#extractURLInfos("http://www.adrien-ruiz.fr/test.html")', function () {
        it ('devrait retourner true', function () {
            var result = url_utils.extractURLInfos ('http://www.adrien-ruiz.fr/test.html');
            
            assert.equal ('www.adrien-ruiz.fr' , result.host);
            assert.equal ('adrien-ruiz.fr'     , result.domain);
            assert.equal ('/test.html'         , result.path);
        });
    });
});
