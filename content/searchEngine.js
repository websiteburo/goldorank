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

var searchSvc = Components.classes["@mozilla.org/rdf/datasource;1?name=internetsearch"].getService(Components.interfaces.nsIInternetSearchService);
var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
var ds_search = rdfService.GetDataSource('rdf:internetsearch');
var ds_moteurs = rdfService.GetDataSourceBlocking('chrome://goldorank/content/moteurs/listeMoteurs.rdf');

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

function peupleValeurs(){
    document.getElementById('motscles').value=opener.content.document.getSelection();
    document.getElementById('page').value=opener.content.document.location;
    
    //On ajoute la prise en compte des catégories de moteurs pour que le navigateur puisse interroger la catégorie Goldorank
    var ds = rdfService.GetDataSource('rdf:internetsearch');
    var catDS = ds.GetCategoryDataSource();
    if (catDS) {
        catDS = catDS.QueryInterface(Components.interfaces.nsIRDFDataSource);
        listeMoteurs = document.getElementById('resultClassement');
        listeMoteurs.database.AddDataSource(catDS);
        listeMoteurs.builder.rebuild();
    }
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
    //ouvreUrl(searchURL);
    //alert(moteur.resultListStart+"\n"+moteur.resultListEnd+"\n--\n"+moteur.resultItemStart+"\n"+moteur.resultItemEnd);
}

var nodeEngine;
var listeResultats = new Array();
var trouve = 0;

var moteur;
function fulguropoing(){
    if (!trouve && (maxRank > listeResultats.length) && !stopMoteur){
        //On récupére les résultats de la page suivante
        searchURL = searchSvc.GetInternetSearchURL(moteur.nomEngine, encodeURIComponent(searchText), 0, (++numPage - 1 + parseInt(moteur.goldorank_offsetPage)), {value:0});
        if (moteur.goldorank_offset){
            //Récupération du numéro de page calculé
            regex = new RegExp(moteur.strNumPage+"=([^\\s&]*)");
            if ((resultats = regex.exec(searchURL))!=null){
                searchURL = String(searchURL).replace(resultats[1], (parseInt(resultats[1]) + parseInt(moteur.goldorank_offset)));
            }
            else{alert('pb offset')};
        }
        pageCell.value = numPage;
        strPage = wget(searchURL);
        trouve = moteur.getResultats(strPage);
        setTimeout("fulguropoing()", 1);
    }
    else {
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
            //alert(numres+nodeItem.label);
            resultsCell.appendChild(nodeItem);
        }
        resultsCell.parentNode.style.display = "block";
        //On lance le  moteur suivant
        setTimeout("nextEngine()", 1);
    }
}

function nextEngine(){
    nodeEngine = nodeEngine.nextSibling;
    if (nodeEngine){
        //alert(nodeEngine.id);
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
    trouve = 0;
    //On réduit la page à la zone utile
    debutZone = strPage.indexOf(this.resultListStart);
    if ( debutZone >= 0){
        strPage = strPage.substring(debutZone);
    }
    finZone = strPage.indexOf(this.resultListEnd);
    if (finZone >= 0){
        strPage = strPage.substring(0, finZone);
    }
    //On supprime les retours à la ligne
    strPage = strPage.replace(/\n/g, "");
    strPage = strPage.replace(/\r/g, "");
    //On recherche l'ensemble des resultats
    var regex = new RegExp(RegExp.escape(this.resultItemStart) + '(.*?)' + RegExp.escape(this.resultItemEnd), "g");
    while ((resultats = regex.exec(strPage))!=null){
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
        //else alert(urltrouvee);
        
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
    return trouve;
}

function engineRecherche(searchText){
    numPage = 0;
    trouve = 0;
    //~ while (!trouve && maxRank > this.listeResultats.length){
        //~ //On récupére les résultats de la page suivante
        //~ searchURL = searchSvc.GetInternetSearchURL(this.nomEngine, encodeURIComponent(searchText), 0, ++numPage, {value:0});
        //~ pageCell.value = numPage + 1;
        //~ strPage = wget(searchURL);
        //~ alert(searchURL);
        //~ trouve = this.getResultats(strPage);
    //~ }
    //~ return this.listeResultats;
    listeResultats = new Array();
    numPage = 0;
    trouve = 0;
    moteur = this;
    setTimeout('fulguropoing()', 1);
}

function engineGetProp(prop){
    var rdf_prop = rdfService.GetResource('urn:goldorank:rdf#'+prop);
    var txtProp = ds_moteurs.GetTarget(rdfService.GetResource(nodeEngine.id), rdf_prop, true);
    if (txtProp) txtProp = txtProp.QueryInterface(Components.interfaces.nsIRDFLiteral);
    if (txtProp) valeur = txtProp.Value;
    return valeur;
}

//Constructeur
function SearchEngine(nodeEngine){
    this.nomEngine = nodeEngine.uri;
    //this.listeResultats = new Array();
    
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
        //Serveur
        //alert(engine+ ' -> '+this.getProp('serveur'));
        
        this.serveur = this.getProp('serveur');
        this.nom = this.getProp('nom');
        this.serveur = this.getProp('serveur');
        this.url = this.getProp('url');
        this.regexPos = this.getProp('regexPos');
        this.strDebutPage = this.getProp('strDebutPage');
        this.taillePage = this.getProp('taillePage');
        this.decalageDebut = this.getProp('decalageDebut');
        this.parPage = this.getProp('parPage');
        
        /*this.resultListStart = this.getProp('resultListStart', this.txtEngine);
        this.resultListEnd = this.getProp('resultListEnd', this.txtEngine);
        this.resultItemStart = this.getProp('resultItemStart', this.txtEngine);
        this.resultItemEnd = this.getProp('resultItemEnd', this.txtEngine);
        
        //Recherche du terme designant le numero de page
        var regex = new RegExp("<inputnext name=\"([^\"]*)\"");
        res = regex.exec(this.txtEngine);
        if (res){
            this.strNumPage = res[1];
        }*/
        
        this.goldorank_offset = this.getProp('goldorank_offset');
        if (!this.goldorank_offset){
            this.goldorank_offset = 0;
        }
        this.goldorank_offsetPage = this.getProp('goldorank_offsetPage');
        if (!this.goldorank_offsetPage){
            this.goldorank_offsetPage = 0;
        }
        this.engineInitialized = 1;
       /*this.engineInitialized = (this.resultItemStart && this.resultItemEnd);
        if (!this.engineInitialized) {
            rankCell.value = 'Err';
            pageCell.value = 'Err';
            alert('pb initialisation: resultItems');
        }*/
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
    
    //Initialisation du service de recherche
    var searchroot = rdfService.GetResource('NC:LastSearchRoot');
    
    nodeEngine = document.getElementById('resultClassement').childNodes[3];
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
        resultsCell.parentNode.style.display = "none";
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
            //alert('recherche sur '+nodeEngine.id);
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