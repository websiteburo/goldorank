function peupleValeurs(){
    document.getElementById('motscles').value=opener.content.document.getSelection();
    document.getElementById('page').value=opener.content.document.location;
}

function afficheResults(){
        var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
        var ds = rdfService.GetDataSource('rdf:internetsearch');
        
        var tr='';
        
        searchroot = rdfService.GetResource('NC:LastSearchRoot');
        predicat = rdfService.GetResource('http://home.netscape.com/NC-rdf#child');
        rdf_url = rdfService.GetResource('http://home.netscape.com/NC-rdf#URL');
        resultats = ds.GetTargets(searchroot, predicat, true);
        while (resultats.hasMoreElements()) {
            var resultat = resultats.getNext();
            url = ds.GetTargets(resultat, rdf_url, true);
            while (url.hasMoreElements()) {
                var target = url.getNext();
                if (target instanceof Components.interfaces.nsIRDFLiteral)
                    tr+=target.Value+"\n";
            }
        }
        alert(tr);
}

function rechercher() {
    var searchText = document.getElementById('motscles').value;
    var engine = document.getElementById("searchEngineList").value;
    var searchURL;
    
    var searchSvc = Components.classes["@mozilla.org/rdf/datasource;1?name=internetsearch"].getService(Components.interfaces.nsIInternetSearchService);

    // XXX Bug 269994: Use dummy string if there is no user entered string
    searchURL = searchSvc.GetInternetSearchURL(engine, searchText ? encodeURIComponent(searchText):"A", 0, 0, {value:0});
    
    if (searchSvc.FindInternetSearchResults(searchURL)){
        afficheResults()
        /*var all_res=ds.GetAllResources();
        regexEngine = /^engine/
        for(var r=0; all_res.hasMoreElements(); r++)  {
            var res=all_res.getNext();
            //if (res instanceof Components.interfaces.nsIRDFResource && !res.Value.match(regexEngine))    {
            if (res instanceof Components.interfaces.nsIRDFResource)    {
                t += r + " " + res.Value + "\n";
            }
        }*/
        
    }
    
}