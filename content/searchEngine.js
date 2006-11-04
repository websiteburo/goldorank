var debugWindow;
var zoneDebug;
var progressCell;
var rankCell;
var pageCell;
var engine;
var nbRes;
var searchURL;
var numPage;
var listeResultats = [];
var currentNodeEngine;
var searchText;
var pageRecherchee;
var maxRank;
var nodeTabPanel;
var nodeRichListItem;
var nodeTabs;
var nodeTabPanels;

var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);

// Creation eventuelle du repertoire goldorank dans le profil de l'utilisateur
var fichUserProfile = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
fichUserProfile.append("goldorank");
if( !fichUserProfile.exists() || !fichUserProfile.isDirectory() ) {   // if it doesn't exist, create
   fichUserProfile.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0664);
}

//On regarde si le fichier des moteurs existe dans le repertoire profil de l'utilisateur, sinon on utilise le fichier d'origine
var fichierMoteurs = 'chrome://goldorank/content/moteurs/listeMoteurs.rdf';
fichUserProfile.append("listeMoteurs.rdf");
if (fichUserProfile.exists()){
	fichierMoteurs = 'file://'+fichUserProfile.path;
}

var ds_moteurs = rdfService.GetDataSourceBlocking(fichierMoteurs);
var rdf_moteurs = rdfService.GetResource('urn:goldorank:moteurs');
var rdf_langue = rdfService.GetResource('urn:goldorank:rdf#langue');
var rdf_logo_langue = rdfService.GetResource('urn:goldorank:rdf#logo_langue');
var rdf_nom = rdfService.GetResource('urn:goldorank:rdf#nom');
var rdf_logo = rdfService.GetResource('urn:goldorank:rdf#logo');
var container = Components.classes["@mozilla.org/rdf/container;1"].createInstance(Components.interfaces.nsIRDFContainer);

function debug(message){
    if (!debugWindow){
        debugWindow  = window.open('chrome://goldorank/content/debugWindow.xul', 'Debug', 'chrome,minimizable,resizable, width=730, height=600');
    }
    if (!zoneDebug){
        alert('Launching debug...');//Do not remove (I don't now why)
        zoneDebug = debugWindow.document.getElementById('debug');
    }
    zoneDebug.value = zoneDebug.value + message + "\n";
    //alert('Launching debug suite...');//Do not remove (I don't now why)
}

RegExp.escape = function(text) {
  if (!arguments.callee.sRE) {
    var specials = [
      '/', '.', '*', '+', '?', '|',
      '(', ')', '[', ']', '{', '}'
    ];
    arguments.callee.sRE = new RegExp(
      '(\\' + specials.join('|\\') + ')', 'g'
    );
  }
  return text.replace(arguments.callee.sRE, '\\$1');
}

function wget(url){
    contenu = "";
    p = new XMLHttpRequest();
    p.onload = null;
    p.open("GET",url, false);
    p.send(null);

    if ( p.status != "200" ) {
      alert("Réception erreur " + p.status);
    } 
    else {
      contenu=p.responseText;
    }
    return contenu;
}

var nodeButton = document.createElement('button');
nodeButton.height="25";
nodeButton.setAttribute('label', 'STOP');
nodeButton.setAttribute('oncommand', 'interruptionMoteur();');

var stopMoteur = 0;
function interruptionMoteur(){
    stopMoteur = 1;
}

var nodeEngine;
var listeResultats = new Array();
var trouve = 0;

var moteur;

function fulguropoing(){
    if (moteur.debug) debug("########FULGUROPOING###############");
    if (!trouve && (maxRank > listeResultats.length) && !stopMoteur){
        //On récupére les résultats de la page suivante
        numPage++;
        searchURL = 'http://' + moteur.serveur + moteur.url + encodeURIComponent(searchText) + moteur.strDebutPage;
        if (moteur.parPage == 'true'){
            searchURL = searchURL + (numPage -1 + parseInt(moteur.decalageDebut));
        }
        else {
            searchURL = searchURL + (listeResultats.length + parseInt(moteur.decalageDebut));
        }
        if (moteur.debug) debug("searchURL : " + searchURL);
        //~ if (moteur.decalageDebut){
            //~ //Récupération du numéro de page calculé
            //~ regex = new RegExp(moteur.strNumPage+"=([^\\s&]*)");
            //~ if ((resultats = regex.exec(searchURL))!=null){
                //~ searchURL = String(searchURL).replace(resultats[1], (parseInt(resultats[1]) + parseInt(moteur.decalageDebut)));
            //~ }
            //~ else{alert('pb offset')};
        //~ }
        pageCell.value = numPage;
        strPage = wget(searchURL);
        pageTestNext = strPage;
        trouve = moteur.getResultats(strPage);
        //On verifie qu'il y a des resultats dans les pages suivantes
        regexpHasMore = new RegExp(moteur.hasNextPage);
        nextRes = regexpHasMore.exec(pageTestNext);
        if (!nextRes){
            if (moteur.debug) debug("Arrêt: il n'y a pas d'autres pages de résultat");
            if (!trouve){
                //alert('pageTestNext');
                rankCell.value = 'N/A';
                pageCell.value = 'N/A';
            }
            //On stoppe la recherche pour ne pas boucler ad infinitum
            interruptionMoteur();
        }
        setTimeout("fulguropoing()", 1);
    }
    else {
        //Debug : raisons de l'arrêt ?
        if (moteur.debug) {
            debug("ARRET DE LA RECHERCHE: ------------");
            debug("trouve=" + trouve );
            debug("maxRank=" + maxRank);
            debug("listeResultats.length=" + listeResultats.length);
            debug("stopMoteur="+stopMoteur);
            debug("--------------------------------------");
        }
        
        resultsCell.parentNode.parentNode.removeChild(nodeButton);
        //On affiche la liste des resultats dans le combo-box
        for (var numres=0; numres<listeResultats.length; numres++){
            var nodeItem = document.createElement('menuitem');
            var urlres = listeResultats[numres];
            var urltxt = (numres+1)+' '+urlres;
            if (urltxt.length > 35){
                urltxt = urltxt.substr(0, 32) + '...';
            }
            if (numres == 0){
                resultsCell.parentNode.setAttribute('label', urltxt);
            }
            nodeItem.setAttribute('label', urltxt);
            nodeItem.setAttribute('value', urlres);
            resultsCell.appendChild(nodeItem);
        }
        resultsCell.parentNode.setAttribute('style', 'display:block;');
        //On lance le  moteur suivant
        setTimeout("nextEngine()", 1);
    }
}

function nextEngine(){
    nodeEngine = nodeEngine.nextSibling;
    if (nodeEngine){
        engine = new SearchEngine(nodeEngine);
        if (engine.engineInitialized){
            resultsCell.parentNode.parentNode.appendChild(nodeButton);
            engine.recherche(searchText);
        }
        else {
            nextEngine();
        }
    } 
}


/********** OBJET SearchEngine **************/
//Fonctions
function engineGetResultats(strPage){
    if (this.debug) debug(">> Analyse de strPage (engineGetResultats)...");
    trouve = 0;
    //On réduit la page à la zone utile
    if (this.debug) debug(">> Recherche resultListStart...");
    debutZone = strPage.indexOf(this.resultListStart);
    if ( debutZone >= 0){
        strPage = strPage.substring(debutZone);
        if (this.debug) debug("resultListStart : " + this.resultListStart + " : trouvé");
    }
    if (this.debug) debug(">> Recherche resultListEnd...");
    finZone = strPage.indexOf(this.resultListEnd);
    if (finZone >= 0){
        strPage = strPage.substring(0, finZone);
        if (this.debug) debug("resultListEnd : " + this.resultListEnd + " : trouvé");
    }
    if (this.debug) debug("strPage : " + strPage + "\n\n\n");
    //On supprime les retours à la ligne
    strPage = strPage.replace(/\n/g, "");
    strPage = strPage.replace(/\r/g, "");
    //On recherche l'ensemble des resultats
    strRegexp = RegExp.escape(this.resultItemStart) + '(.*?)' + RegExp.escape(this.resultItemEnd);
    var regex = new RegExp(strRegexp, "g");
    if (this.debug) debug(">> Recherche items (format = /" + strRegexp + "/)...");
    while ((resultats = regex.exec(strPage))!=null){
        if (this.debug) debug("item trouve : " + resultats[1]);
        urltrouvee = /http:\/\/[^'"]*/.exec(resultats[1]);
        
        //Gestion de l'encodage %3a pour les sites de type yahoo
        urlyahoo = /http%3a\/\/[^'"]*/.exec(urltrouvee);
        if (urlyahoo){
            urltrouvee = String(urlyahoo).replace('%3a',':');
        }
        
        //Gestion de voila
        urlvoila = /http%3A%2F%2F[^&]*/.exec(urltrouvee);
        if (urlvoila){
            urltrouvee = String(urlvoila).replace('%3A',':');
            urltrouvee = urltrouvee.replace(/%2F/g,'/');
        }
        
        //Gestion de MSN.com
        urlMsn = /\?http:\/\/.*/.exec(urltrouvee);
        if (urlMsn){
            urltrouvee = String(urlMsn).substr(1);
        }
        
        listeResultats.push(urltrouvee);
        rankCell.value = listeResultats.length;
        //Avancement de la barre de progression
        progressCell.value = (100 * listeResultats.length / maxRank) ;
        //Est-ce que c'est l'url recherchée?
        if (String(urltrouvee).match(regexPageCherchee)){
            progressCell.value = 100;
            trouve=1;
            break;
        }
        else if (maxRank <= listeResultats.length){
            //Fin des recherches atteintes sans avoir trouvé la page
            rankCell.value = '>'+maxRank;
            pageCell.value = '>'+numPage;
            break;
        }
    }
    if (this.debug) debug(">> Fin recherche items");
    return trouve;
}

function engineRecherche(searchText){
    numPage = 0;
    trouve = 0;
    listeResultats = new Array();
    numPage = 0;
    trouve = 0;
    moteur = this;
    if (this.debug){
        debug("\n################################\n#      " + this.nom + "\n################################");
    }
    setTimeout('fulguropoing()', 1);
}

function engineGetProp(prop){
    var valeur = "";
    var rdf_prop = rdfService.GetResource('urn:goldorank:rdf#'+prop);
    var txtProp = ds_moteurs.GetTarget(rdfService.GetResource(nodeEngine.id), rdf_prop, true);
    if (txtProp) {
        txtProp = txtProp.QueryInterface(Components.interfaces.nsIRDFLiteral);
        if (txtProp) {
            valeur = txtProp.Value;
        }
    }
    return valeur;
}

//Constructeur
function SearchEngine(nodeEngine){
    this.nomEngine = nodeEngine.name;
    
   //Initialisation du contexte d'un moteur
    this.engineInitialized = 0;
    //Détermination des éléments xul à mettre à jour
    checkedCell = nodeEngine.childNodes[0].firstChild;
    progressCell = nodeEngine.childNodes[2].firstChild;
    rankCell = nodeEngine.childNodes[3].firstChild;
    pageCell = nodeEngine.childNodes[4].firstChild;
    resultsCell = nodeEngine.childNodes[5].firstChild.firstChild;
    
    //Initialisation des valeurs
    engine = nodeEngine.id;
    progressCell.value = 0;
    numPage = 0;
    stopMoteur = 0;
    if (checkedCell.checked){
        listeResultats = [];
        rankCell.value = '1';
        pageCell.value = '1';
        
        //Définit  les méthodes pour l'objet
        this.getProp = engineGetProp;
        this.recherche = engineRecherche;
        this.getResultats = engineGetResultats;
        
        //Recuperation des valeurs utiles du moteur        
        this.debug = (this.getProp('debug') == 'true');
        this.serveur = this.getProp('serveur');
        this.nom = this.getProp('nom');
        this.url = this.getProp('url');
        //this.regexPos = this.getProp('regexPos');
        this.strDebutPage = this.getProp('strDebutPage');
        //this.taillePage = this.getProp('taillePage');
        this.decalageDebut = this.getProp('decalageDebut');
        this.parPage = this.getProp('parPage');
        
        this.resultListStart = this.getProp('resultListStart');
        this.resultListEnd = this.getProp('resultListEnd');
        this.resultItemStart = this.getProp('resultItemStart');
        this.resultItemEnd = this.getProp('resultItemEnd');
        this.strNumPage = this.getProp('strNumPage');
        this.hasNextPage = this.getProp('hasNextPage');
        
        //~ this.goldorank_offset = this.getProp('goldorank_offset');
        //~ if (!this.goldorank_offset){
            //~ this.goldorank_offset = 0;
        //~ }
        //~ this.goldorank_offsetPage = this.getProp('goldorank_offsetPage');
        //~ if (!this.goldorank_offsetPage){
            //~ this.goldorank_offsetPage = 0;
        //~ }
        this.engineInitialized = 1;
       //this.engineInitialized = (this.resultItemStart && this.resultItemEnd);
        if (!this.engineInitialized) {
            rankCell.value = 'Err';
            pageCell.value = 'Err';
            alert('pb initialisation: resultItems');
        }
    }
}

/********** FIN OBJET SearchEngine *********************/

function rechercherS(){
    //Valeurs de recherche
    searchText = document.getElementById('motscles').value;
    searchText = searchText ? searchText : "A";
    pageCherchee = document.getElementById('page').value;
    regexPageCherchee = new RegExp('(http://)?'+RegExp.escape(pageCherchee)+'/?');
    maxRank = document.getElementById('maxRank').value;
    
    //nodeEngine = nodeTabPanels.childNodes[nodeTabs.selectedIndex].firstChild.childNodes[2];
    nodeEngine = nodeTabPanels.childNodes[nodeTabs.selectedIndex].firstChild.childNodes[1].childNodes[1];
    //On réinitialise l'affichage
    var moteur = nodeEngine;
    while (moteur){
        //progressCell
        moteur.childNodes[2].firstChild.value = '0';
        //rankCell
        moteur.childNodes[3].firstChild.value = '';
        //pageCell
        moteur.childNodes[4].firstChild.value = '';
        //resultsCell
        resultsCell = moteur.childNodes[5].firstChild.firstChild
        while (resultsCell.firstChild){
            resultsCell.removeChild(resultsCell.firstChild);
        }
        resultsCell.parentNode.setAttribute('style', 'display:none;');
        //Bouton stop
        if (resultsCell.parentNode.parentNode.length == 2){
            resultsCell.parentNode.parentNode.removeChild(nodeButton);
        }
        moteur = moteur.nextSibling;
    }

    var engine;
    if (nodeEngine){
        engine = new SearchEngine(nodeEngine);
        if (engine.engineInitialized){
            //On effectue la recherche
            resultsCell.parentNode.parentNode.appendChild(nodeButton);
            engine.recherche(searchText);
        }
        else nextEngine();
    }    
}

function ouvreUrl(url){
    var tBrowser = opener.document.getElementById("content") ;
    tBrowser.selectedTab = tBrowser.addTab(url) ;
}