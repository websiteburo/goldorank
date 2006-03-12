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
var RDF_observer;

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

function rechercher() {   
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
    
    RDF_observer = {
        onAssert : function(ds, src, prop, target)  {        
            if (prop == rdf_url) {
                var lancerSuivant = 0;
                url = target.QueryInterface(Components.interfaces.nsIRDFLiteral);
                listeResultats.push(url.Value);
                rankCell.value = listeResultats.length
                //Avancement de la barre de progression
                progressCell.value = (100 * listeResultats.length / maxRank) ;
                //Est-ce que c'est l'url recherchée?
                if (url.Value == pageCherchee){
                    progressCell.value = 100;
                    lancerSuivant = 1;
                }
                else if (maxRank <= listeResultats.length){
                    //Fin des recherches atteintes sans avoir trouvé la page
                    rankCell.value = 'N/A';
                    pageCell.value = 'N/A';
                    lancerSuivant = 1;
                }
                else if (listeResultats.length == nbRes * (numPage+1)){
                    //On récupére les résultats de la page suivante
                    searchURL = searchSvc.GetInternetSearchURL(engine, encodeURIComponent(searchText), 0, ++numPage, {value:0});
                    searchSvc.FindInternetSearchResults(searchURL);
                    pageCell.value = numPage + 1;
                }
                
                if (lancerSuivant){
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
                    
                    nextNode = currentNodeEngine.nextSibling;
                    if (nextNode){
                        //On lance les recherches pour le moteur suivant
                        if (initEngine(nextNode)){
                            searchURL = searchSvc.GetInternetSearchURL(engine, encodeURIComponent(searchText), 0, numPage, {value:0});
                            searchSvc.FindInternetSearchResults(searchURL);
                        }
                        else {
                            //Plus de moteur compatible
                            ds.RemoveObserver(this);
                        }
                    }
                    else {
                        //Les recherches pour tous les moteurs sont terminées
                        ds.RemoveObserver(this);
                    }
                }
            }
        },
        onUnassert : function(ds, src, prop, target){},
        onChange : function(ds, src, prop, old_target, new_target) {},
        onMove : function(ds, old_src, new_src, prop, target){},
        onBeginUpdateBatch : function(ds){},
        onEndUpdateBatch   : function(ds){}
    }
    
    
    var nodeEngine = document.getElementById('resultClassement').childNodes[3];
    //On réinitialise l'affichage
    var moteur = nodeEngine;
    while (moteur){
        //progressCell
        moteur.childNodes[1].firstChild.value = '0';
        //rankCell
        moteur.childNodes[2].firstChild.value = '';
        //pageCell
        moteur.childNodes[3].firstChild.value = '';
        moteur = moteur.nextSibling;
    }
    //Lancement de la recherche pour le premier moteur
    if (initEngine(nodeEngine)){
        ds.AddObserver(RDF_observer);
        searchURL = searchSvc.GetInternetSearchURL(engine, encodeURIComponent(searchText), 0, numPage, {value:0});
        searchSvc.FindInternetSearchResults(searchURL);
        setTimeout("verifierPeriodiquementMoteurs('"+engine+"', 1)", 5000);
    }
    else {
        alert('aucun moteur compatible');
    }
}

//Regarde si un moteur est bloqué et passe au suivant si c'est le cas
function verifierPeriodiquementMoteurs(ancienEngine, ancienRank) {
    nbResultActuel = listeResultats.length
    if (nbResultActuel == ancienRank && engine == ancienEngine){
        //Blocage
        if (nbResultActuel == 0){
            //Format de moteur invalide
            rankCell.value = 'Err';
            pageCell.value = 'Err';
        }
        else {
            //Tous les résultats on été affichés
            rankCell.value = "N/A";
            pageCell.value = "N/A";
            progressCell.value = 100;
        }
        nextNode = currentNodeEngine.nextSibling;
        if (nextNode){
            //On lance les recherches pour le moteur suivant
            if (initEngine(nextNode)){
                searchURL = searchSvc.GetInternetSearchURL(engine, encodeURIComponent(searchText), 0, numPage, {value:0});
                searchSvc.FindInternetSearchResults(searchURL);
            }
            else {
                //Plus de moteur compatible
                ds.RemoveObserver(RDF_observer);
                return;
            }
        }
        else {
            //Les recherches pour tous les moteurs sont terminées
            ds.RemoveObserver(RDF_observer);
            return;
        }
    }
    setTimeout("verifierPeriodiquementMoteurs('"+engine+"', "+nbResultActuel+")", 5000);
}

//Initialisation du contexte d'un moteur
function initEngine(nodeEngine){
    var engineInitialized = 0;
    //Détermination des éléments xul à mettre à jour
    progressCell = nodeEngine.childNodes[1].firstChild;
    rankCell = nodeEngine.childNodes[2].firstChild;
    pageCell = nodeEngine.childNodes[3].firstChild;
    resultsCell = nodeEngine.childNodes[4].firstChild.firstChild;
    
    //Initialisation des valeurs
    currentNodeEngine = nodeEngine;
    engine = nodeEngine.id;
    nbRes = getNbRes(engine);
    listeResultats = [];
    rankCell.value = '1';
    pageCell.value = '1';
    progressCell.value = 0;
    numPage = 0;
    engineInitialized = engineOk(engine);
    if (!engineInitialized){
        //Le moteur n'est pas compatible, on passe au moteur suivant s'il existe
        rankCell.value = 'Err';
        pageCell.value = 'Err';
        if (nodeEngine.nextSibling) engineInitialized = initEngine(nodeEngine.nextSibling);
    }
    return engineInitialized;
}

//Détermine si le moteur est compatible avec l'analyse des résultats
function engineOk(engine){
    var estok = 1;
    var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
    var ds = rdfService.GetDataSource('rdf:internetsearch');
    var rdf_data = rdfService.GetResource('http://home.netscape.com/NC-rdf#data');
    var txtEngine = ds.GetTarget(rdfService.GetResource(engine), rdf_data, true);
    if (txtEngine) txtEngine = txtEngine.QueryInterface(Components.interfaces.nsIRDFLiteral);
    if (txtEngine) txtEngine = txtEngine.Value;
    //Il doit y avoir les délimiteurs de résultats (non commentés)
    regexDelStart = /[\n\r]\s*resultItemStart/;
    regexDelEnd = /[\n\r]\s*resultItemEnd/;
    if ( ! (txtEngine.match(regexDelStart) && txtEngine.match(regexDelEnd)) ){
        estok = 0;
    } 
    return estok;
}

//Détermination du nombre de résultats par page pour le moteur de recherche 'engine'
function getNbRes(engine){
    var nbRes = 10;//10 resultats par page par défaut
    var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
    var ds = rdfService.GetDataSource('rdf:internetsearch');
    var rdf_data = rdfService.GetResource('http://home.netscape.com/NC-rdf#data');
    var txtEngine = ds.GetTarget(rdfService.GetResource(engine), rdf_data, true);
    if (txtEngine) txtEngine = txtEngine.QueryInterface(Components.interfaces.nsIRDFLiteral);
    if (txtEngine) txtEngine = txtEngine.Value;
    regexNbRes = /factor=["']?(\d+)["']?/
    rechNbRes = txtEngine.match(regexNbRes);
    if (rechNbRes != null){
        nbRes = rechNbRes[1];
    }
    return nbRes;
}

function ouvreUrl(select){
    var tBrowser = opener.document.getElementById("content") ;
    tBrowser.selectedTab = tBrowser.addTab(select.value) ;
}