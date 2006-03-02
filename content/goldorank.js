function peupleValeurs(){
    document.getElementById('motscles').value=opener.content.document.getSelection();
    document.getElementById('page').value=opener.content.document.location;
}

function rechercher() {
    var searchText = document.getElementById('motscles').value;
    var engine = document.getElementById("searchEngineList").value;
    var searchURL;
    
    var searchSvc = Components.classes["@mozilla.org/rdf/datasource;1?name=internetsearch"].getService(Components.interfaces.nsIInternetSearchService);

    // XXX Bug 269994: Use dummy string if there is no user entered string
    searchURL = searchSvc.GetInternetSearchURL(engine, searchText ? encodeURIComponent(searchText):"A", 0, 0, {value:0});
    
    if (searchSvc.FindInternetSearchResults(searchURL)){
        var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
        var ds = rdfService.GetDataSource('rdf:internetsearch');
        
        var t='';
        var all_res=ds.GetAllResources();
        regexEngine = /^engine/
        for(var r=0; all_res.hasMoreElements(); r++)  {
            var res=all_res.getNext();
            if (res instanceof Components.interfaces.nsIRDFResource && !res.Value.match(regexEngine))    {
                t += res.Value + "\n";
            }
        }
        alert(t);
    }
    
    /*
    try {
      // Get the engine's base URL
      searchURL = makeURI(searchURL).host;
    } catch (ex) {}
    
    var resultsTree = document.getElementById( "resultsList" );
resultsTree.setAttribute("ref", decodeURI(searchURL));
    window.opener.delayedSearchLoadURL(searchURL);
    
    window.open('http://www.google.com/search?q='+document.getElementById('motscles').value, '', 'chrome,minimizable,resizable');
    */
}

/* fonctions tirees de browser.js 
function delayedSearchLoadURL(aURL) {
  setTimeout(SearchLoadURL, 0, aURL);
}

function SearchLoadURL(aURL) {
    if (!aURL) return;
    loadURI(aURL, null, null);
    content.focus();
}

function loadURI(uri, referrer, postData)
{
  try {
    if (postData === undefined)
      postData = null;
    getWebNavigation().loadURI(uri, nsIWebNavigation.LOAD_FLAGS_NONE, referrer, postData, null);
  } catch (e) {
  }
}*/