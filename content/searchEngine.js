    function traiteRecherche(originalRequest){
        alert('finsdfcherche');
    }

function SearchEngine(nomEngine){
    var searchSvc = Components.classes["@mozilla.org/rdf/datasource;1?name=internetsearch"].getService(Components.interfaces.nsIInternetSearchService);
    var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
    var ds = rdfService.GetDataSource('rdf:internetsearch');
    
    init();
    
    function init(){
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
    
    //this.getProp = getProp;
    this.recherche = recherche;
    
    function traiteRecherche(originalRequest){
        alert(originalRequest.responseText);
    }
    
    function recherche(searchText, numPage){
        searchURL = searchSvc.GetInternetSearchURL(nomEngine, encodeURIComponent(searchText), 0, numPage, {value:0});
        alert('debut recherche'+searchURL);
        searchURL = "http://www.google.com";
        var myAjax = new Ajax.Request(searchURL, {method: 'get', onComplete: traiteRecherche});
        //alert(searchURL);
    }

    function getProp(prop){
        var valeur;
        var regex = new RegExp('[\n\r]\s*'+prop+'\s*=\s*[\'"]([^\'"]*)[\'"]');
        res = regex.exec(this.txtEngine);
        if (res){
            valeur = res[1];
        }
        return valeur;
    }
}

function rechercherS(){
    var test = "<yo>\n<ii \nto='kk' \nta='tyt'>lkj</ii>\n<e></e>\n</yo>";
    
    //~ var nodeEngine = document.getElementById('resultClassement').childNodes[3];
    //~ var engine = new SearchEngine(nodeEngine.id);
    //~ engine.recherche('miaou', 2);
    
            searchURL = "http://www.google.com";
        var myAjax = new Ajax.Request(searchURL, {method: 'get', onComplete: traiteRecherche});
}