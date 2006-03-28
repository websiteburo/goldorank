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

var searchSvc = Components.classes["@mozilla.org/rdf/datasource;1?name=internetsearch"].getService(Components.interfaces.nsIInternetSearchService);
var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
var ds = rdfService.GetDataSource('rdf:internetsearch');

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

function SearchEngine(nodeEngine){
    var nomEngine = nodeEngine.id;
    var listeResultats = new Array();
    
    function init(){
        alert('initialisation');
       //Initialisation du contexte d'un moteur
        var engineInitialized = 0;
        //Détermination des éléments xul à mettre à jour
        checkedCell = nodeEngine.childNodes[0].firstChild;
        progressCell = nodeEngine.childNodes[2].firstChild;
        rankCell = nodeEngine.childNodes[3].firstChild;
        pageCell = nodeEngine.childNodes[4].firstChild;
        resultsCell = nodeEngine.childNodes[5].firstChild.firstChild;
        
        //Initialisation des valeurs
        currentNodeEngine = nodeEngine;
        engine = nodeEngine.id;
        progressCell.value = 0;
        numPage = 0;
        if (checkedCell.checked){
            engineInitialized = 1;
            listeResultats = [];
            rankCell.value = '1';
            pageCell.value = '1';
            
            //Recuperation du xml descriptif du moteur
            var rdf_data = rdfService.GetResource('http://home.netscape.com/NC-rdf#data');
            var txtEngine = ds.GetTarget(rdfService.GetResource(nomEngine), rdf_data, true);
            if (txtEngine) txtEngine = txtEngine.QueryInterface(Components.interfaces.nsIRDFLiteral);
            if (txtEngine) this.txtEngine = txtEngine.Value;
            
            //Recuperation des valeurs utiles du moteur
            this.resultListStart = getProp('resultListStart');
            this.resultListEnd = getProp('resultListEnd');
            this.resultItemStart = getProp('resultItemStart');
            this.resultItemEnd = getProp('resultItemEnd');
        }
        alert(engineInitialized);
        return engineInitialized;
    }
    
    this.recherche = recherche;
    this.init = init;
    
    function recherche(searchText){
        numPage = 0;
        trouve = 0;
        while (!trouve && maxRank > listeResultats.length){
            //On récupére les résultats de la page suivante
            searchURL = searchSvc.GetInternetSearchURL(nomEngine, encodeURIComponent(searchText), 0, ++numPage, {value:0});
            pageCell.value = numPage + 1;
            strPage = wget(searchURL);
            trouve = getResultats(strPage);
        }
        return listeResultats;
    }

    function getResultats(strPage){
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
        var regex = new RegExp(this.resultItemStart + '(.*?)' + this.resultItemEnd, "g");
        while ((resultats = regex.exec(strPage))!=null){
            urltrouvee = /http:\/\/[^'"]*/.exec(resultats[1]);
            listeResultats.push(urltrouvee);
            rankCell.value = listeResultats.length;
            //Avancement de la barre de progression
            progressCell.value = (100 * listeResultats.length / maxRank) ;
            //Est-ce que c'est l'url recherchée?
            if (url.Value == pageCherchee){
                progressCell.value = 100;
                trouve=1;
                break;
            }
            else if (maxRank <= listeResultats.length){
                //Fin des recherches atteintes sans avoir trouvé la page
                rankCell.value = 'N/A';
                pageCell.value = 'N/A';
                break;
            }
        }
        return trouve;
    }

    function getProp(prop){
        var valeur;
        var regex = new RegExp(prop+'\s*=\s*[\'"]([^\'"]*)[\'"]');
        res = regex.exec(this.txtEngine);
        if (res){
            valeur = res[1];
        }
        return valeur;
    }
}

function rechercherS(){
    //Valeurs de recherche
    searchText = document.getElementById('motscles').value;
    searchText = searchText ? searchText : "A";
    var pageCherchee = document.getElementById('page').value;
    var maxRank = document.getElementById('maxRank').value;
    
    //Initialisation du service de recherche et des éléments RDF
    var searchroot = rdfService.GetResource('NC:LastSearchRoot');
    var rdf_url = rdfService.GetResource('http://home.netscape.com/NC-rdf#URL');
    var rdf_logo = rdfService.GetResource('http://home.netscape.com/NC-rdf#Icon');
    var rdf_nom = rdfService.GetResource('http://home.netscape.com/NC-rdf#Name');
    
    var nodeEngine = document.getElementById('resultClassement').childNodes[3];
    //On réinitialise l'affichage
    var moteur = nodeEngine;
    while (moteur){
        //progressCell
        moteur.childNodes[2].firstChild.value = '0';
        //rankCell
        moteur.childNodes[3].firstChild.value = '';
        //pageCell
        moteur.childNodes[4].firstChild.value = '';
        moteur = moteur.nextSibling;
    }

    var engine = new SearchEngine(nodeEngine);
    while (engine && engine.init()){
        //On effectue la recherche
        alert('recherche sur '+nodeEngine.id);
        listeResultats = engine.recherche(searchText);
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
        //On passe au moteur suivant s'il existe
        if (nodeEngine.nextSibling) {
            nodeEngine = nodeEngine.nextSibling;
            engine = new SearchEngine(nodeEngine);
        }
    }
    alert('fin');
    
}

function ouvreUrl(select){
    var tBrowser = opener.document.getElementById("content") ;
    tBrowser.selectedTab = tBrowser.addTab(select.value) ;
}