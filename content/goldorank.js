function peupleValeurs(){
    document.getElementById('motscles').value=opener.content.document.getSelection();
    document.getElementById('page').value=opener.content.document.location;
}

function afficheResults(){
    var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
    var ds = rdfService.GetDataSource('rdf:internetsearch');
    
    
    //*
    var observer = {
        onBeginLoad : function(sink){},
        onInterrupt : function(sink){},
        onResume : function(sink){},
        onError : function(sink,status,msg){},
        onEndLoad : function(sink){
            sink.removeXMLSinkObserver(this);
            sink.QueryInterface(Components.interfaces.nsIRDFDataSource);
            
            var tr='';
            var searchroot = rdfService.GetResource('NC:LastSearchRoot');
            var predicat = rdfService.GetResource('http://home.netscape.com/NC-rdf#child');
            var rdf_url = rdfService.GetResource('http://home.netscape.com/NC-rdf#URL');
            var resultats = ds.GetTargets(searchroot, predicat, true);
            while (resultats.hasMoreElements()) {
                var resultat = resultats.getNext();
                var url = ds.GetTarget(resultat, rdf_url, true);
                if (url) url = url.QueryInterface(Components.interfaces.nsIRDFLiteral);
                if (url) tr += url.Value + "\n";            
            }
            alert(tr);
        }
    };

    //var ds=rdfService.GetDataSource("http://www.xulplanet.com/tutorials/xultu/animals.rdf");
    ds.QueryInterface(Components.interfaces.nsIRDFXMLSink);
    ds.addXMLSinkObserver(observer);
//*/
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
        /*
        var all_res=ds.GetAllResources();
        regexEngine = /^engine/
        for(var r=0; all_res.hasMoreElements(); r++)  {
            var res=all_res.getNext();
            //if (res instanceof Components.interfaces.nsIRDFResource && !res.Value.match(regexEngine))    {
            if (res instanceof Components.interfaces.nsIRDFResource)    {
                t += r + " " + res.Value + "\n";
            }
        }
        //*/
        
    }
    
}