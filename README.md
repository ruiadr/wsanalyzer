# wsanalyzer (WebSite Analyzer)
Analyseur en temps réel de sites internet.

----------

Installation
------------

Installation pour une utilisation en ligne de commande uniquement:

    sudo npm install -g wsanalyzer

Installation locale pour utiliser les fonctionnalités de la bibliothèque et élaborer des analyses personnalisées:

    npm install wsanalyzer --save-dev

En cas d'erreur avec **npm install wsanalyzer --save-dev**, il suffit de relancer la commande avec **sudo**:

    sudo npm install wsanalyzer --save-dev

----------

Utilisation en ligne de commande
-----------

**Commande**

    wsanalyzer <site>

**Exemple**

    wsanalyzer adrien-ruiz.fr

----------

Comportement par défaut du robot
--------------------------------

 1. **Analyse la page d'accueil**
     1. Balises essentielles (ou pas) pour le SEO (**title, meta description, meta keywords, meta canonical**)
     2. **h1** de la page (le premier trouvé si plusieurs...)
     3. Présence du **code GoogleAnalytics**
     4. Présence du **code WebmasterTools** (Validation par balise ou champ TXT déclaré sur le domaine)
         1. La vérification de la validation par domaine utilise la commande **dig** qui doit être installée. Si la commande **dig** ne peut être lancée, l'analyse retournera une erreur de validation de WebmasterTools
 2. **Analyse le robots.txt du site**
 3. **Analyse le(s) sitemap(s) du site (url(s) trouvée(s) dans le "robots.txt")**
     1. Fallback sur **/sitemap.xml** le cas échéant
     2. x URLs prises au hasard sont analysées en suivant le même schéma que pour la page d'accueil (listé au point 1.)

----------

Utilisation du robot dans un script personnalisé
------------------------------------------------

Entièrement détaillé dans l'exemple: **examples/bot.js**

----------

Utilisation des différents "parsers"
----------------------------------

Entièrement détaillé dans l'exemple: **examples/parsers.js**

----------

Utilisation des différents "analyzers"
----------------------------------

Entièrement détaillé dans l'exemple: **examples/analyzers.js**

----------

Tests (non exhaustifs)
----

Installer [Mocha](http://mochajs.org/):

    npm install -g mocha

En cas d'erreur avec **npm install -g mocha**, il suffit de relancer la commande avec **sudo**.

    sudo npm install -g mocha

Lancer les tests unitaires:

    npm test

----------

Feuille de route
----------------

 - [**Août 2015**] Mise en place d'une IHM
     - Framework WEB pressenti: [ExpressJS](http://expressjs.com/)
     - Framework CSS pressenti: [Materialize](http://materializecss.com/)
 - [**Septembre 2015**] Création de projets d'analyses (en ligne de commande et IHM)
     - Un projet par site (par domaine)
     - Historique des analyses réalisées
     - Paramétrage comportemental du robot
 - [**Octobre 2015**] Connexion aux APIs de Google (en ligne de commande et IHM)
     - Connexion à GoogleAnalytics pour affiner les conclusions d'analyses
     - Connexion à WebMasterTools pour affiner les conclusions d'analyses
 - [**Novembre 2015**] Mise en place de rapports automatisés par email (en ligne de commande et IHM)
     - Pressenti: les rapports seront envoyés par [Mandrill](https://www.mandrill.com/)

----------

Licence
-------
The MIT License (MIT)

Copyright (c) 2015 Adrien RUIZ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
