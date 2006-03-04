function peupleValeurs(){
    document.getElementById('motscles').value=opener.content.document.getSelection();
    document.getElementById('page').value=opener.content.document.location;
}

function afficheResults(engine){
    
}

function rechercher() {
    var searchText = document.getElementById('motscles').value;
    var engine = document.getElementById("searchEngineList").value;
    
    var searchSvc = Components.classes["@mozilla.org/rdf/datasource;1?name=internetsearch"].getService(Components.interfaces.nsIInternetSearchService);

    // XXX Bug 269994: Use dummy string if there is no user entered string
    var searchURL = searchSvc.GetInternetSearchURL(engine, searchText ? encodeURIComponent(searchText):"A", 0, 0, {value:0});
    
    var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
    var ds = rdfService.GetDataSource('rdf:internetsearch');
    var searchroot = rdfService.GetResource('NC:LastSearchRoot');
    var predicat = rdfService.GetResource('http://home.netscape.com/NC-rdf#child');
    var rdf_url = rdfService.GetResource('http://home.netscape.com/NC-rdf#URL');
    var rdf_data = rdfService.GetResource('http://home.netscape.com/NC-rdf#data');
    var listeResultats = [];
    
    //Détermination du nombre de résultats par page
    var txtEngine = ds.GetTarget(rdfService.GetResource(engine), rdf_data, true);
    if (txtEngine) txtEngine = txtEngine.QueryInterface(Components.interfaces.nsIRDFLiteral);
    if (txtEngine) txtEngine = txtEngine.Value;
    var nbRes = 7;
    regexNbRes = /factor=["']?(\d+)["']?/
    rechNbRes = txtEngine.match(regexNbRes);
    if (rechNbRes != null){
        nbRes = rechNbRes[1];
    }
    
    var RDF_observer = {
        onAssert : function(ds, src, prop, target)  {        
            if (prop == rdf_url) {
                url = target.QueryInterface(Components.interfaces.nsIRDFLiteral);
                listeResultats.push(url.Value);
                if (listeResultats.length == nbRes){
                    alert(listeResultats.toString());
                    ds.RemoveObserver(this);
                }
            }
        },
        onUnassert : function(ds, src, prop, target){},
        onChange : function(ds, src, prop, old_target, new_target) {},
        onMove : function(ds, old_src, new_src, prop, target){},
        onBeginUpdateBatch : function(ds){},
        onEndUpdateBatch   : function(ds){}
    }
    ds.AddObserver(RDF_observer);
    searchSvc.FindInternetSearchResults(searchURL);    
}