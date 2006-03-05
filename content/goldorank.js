function peupleValeurs(){
    document.getElementById('motscles').value=opener.content.document.getSelection();
    document.getElementById('page').value=opener.content.document.location;
}

function rechercher() {
    //Elements xul
    var logoEngineCell = document.getElementById('logoEngineCell');
    var nomEngineCell = document.getElementById('nomEngineCell');
    var progressCell = document.getElementById('progressCell');
    var rankCell = document.getElementById('rankCell');
    var pageCell = document.getElementById('pageCell');
    
    //Valeurs de recherche
    var searchText = document.getElementById('motscles').value;
    searchText = searchText ? searchText : "A";
    var pageCherchee = document.getElementById('page').value;
    var maxRank = document.getElementById('maxRank').value;
    var engine = document.getElementById("searchEngineList").value;
    
    //Initialisation du service de recherche et des éléments RDF
    var searchSvc = Components.classes["@mozilla.org/rdf/datasource;1?name=internetsearch"].getService(Components.interfaces.nsIInternetSearchService);
    var searchURL;
    var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
    var ds = rdfService.GetDataSource('rdf:internetsearch');
    var searchroot = rdfService.GetResource('NC:LastSearchRoot');
    var rdf_url = rdfService.GetResource('http://home.netscape.com/NC-rdf#URL');
    var rdf_data = rdfService.GetResource('http://home.netscape.com/NC-rdf#data');
    var rdf_logo = rdfService.GetResource('http://home.netscape.com/NC-rdf#Icon');
    var rdf_nom = rdfService.GetResource('http://home.netscape.com/NC-rdf#Name');
    var listeResultats = [];
    
    //Mise en place du logo et du nom du moteur
    var logoEngine = ds.GetTarget(rdfService.GetResource(engine), rdf_logo, true);
    if (logoEngine instanceof Components.interfaces.nsIRDFLiteral)
        logoEngineCell.src = logoEngine.Value;
    var nomEngine = ds.GetTarget(rdfService.GetResource(engine), rdf_nom, true);
    if (nomEngine instanceof Components.interfaces.nsIRDFLiteral)
        nomEngineCell.value = nomEngine.Value;
        
    
    //Détermination du nombre de résultats par page
    var txtEngine = ds.GetTarget(rdfService.GetResource(engine), rdf_data, true);
    if (txtEngine) txtEngine = txtEngine.QueryInterface(Components.interfaces.nsIRDFLiteral);
    if (txtEngine) txtEngine = txtEngine.Value;
    var nbRes = 10;//10 resultats par page par défaut
    regexNbRes = /factor=["']?(\d+)["']?/
    rechNbRes = txtEngine.match(regexNbRes);
    if (rechNbRes != null){
        nbRes = rechNbRes[1];
    }
    
    var RDF_observer = {
        onAssert : function(ds, src, prop, target)  {        
            if (prop == rdf_url) {
                url = target.QueryInterface(Components.interfaces.nsIRDFLiteral);
                listeResultats.push(url.Value+"\n");
                rankCell.value = listeResultats.length
                progressCell.value = (100 * listeResultats.length / maxRank) ;
                //Est-ce que c'est l'url recherchée?
                if (url.Value == pageCherchee){
                    progressCell.value = 100;
                    alert('page: ' + (numPage+1) + ', position: ' + listeResultats.length);
                    ds.RemoveObserver(this);
                }
                else if (maxRank <= listeResultats.length){
                    //Fin des recherches atteintes sans avoir trouvé la page
                    rankCell.value = 'N/A';
                    pageCell.value = 'N/A';
                    ds.RemoveObserver(this);
                }
                else if (listeResultats.length == nbRes * (numPage+1)){
                    //On récupére les résultats de la page suivante
                    searchURL = searchSvc.GetInternetSearchURL(engine, encodeURIComponent(searchText), 0, ++numPage, {value:0});
                    searchSvc.FindInternetSearchResults(searchURL);
                    pageCell.value = numPage + 1;
                }
            }
        },
        onUnassert : function(ds, src, prop, target){},
        onChange : function(ds, src, prop, old_target, new_target) {},
        onMove : function(ds, old_src, new_src, prop, target){},
        onBeginUpdateBatch : function(ds){},
        onEndUpdateBatch   : function(ds){}
    }
    
    //Initialisation des valeurs
    rankCell.value = '1';
    pageCell.value = '1';
    progressCell.value = 0;
    var trouve = 0;
    var numPage = 0;
    searchURL = searchSvc.GetInternetSearchURL(engine, encodeURIComponent(searchText), 0, numPage, {value:0});
    ds.AddObserver(RDF_observer);
    searchSvc.FindInternetSearchResults(searchURL);
}