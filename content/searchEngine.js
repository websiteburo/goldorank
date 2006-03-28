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
    //this.getResultats = getResultats;
    
    function recherche(searchText, numPage){
        searchURL = searchSvc.GetInternetSearchURL(nomEngine, encodeURIComponent(searchText), 0, numPage, {value:0});
        debug(searchURL);
        strPage = wget(searchURL);
        resultats = getResultats(strPage);
    }

    function getResultats(strPage){
        var listeRes = new Array();
        //On réduit la page à la zone utile
        debutZone = strPage.indexOf(this.resultListStart);
        if ( debutZone >= 0){
            strPage = strPage.substring(debutZone);
        }
        finZone = strPage.indexOf(this.resultListEnd);
        if (finZone >= 0){
            strPage = strPage.substring(0, finZone);
        }
        //On recherche l'ensemble des resultats
        var regex = new RegExp(this.resultItemStart + '(.*?)' + this.resultItemEnd, "g");
        while ((resultats = regex.exec(strPage))!=null){
            listeRes.push(resultats[1]);
            alert(resultats[1]);
        }
        //~ for (i=0; i<resultats.length; i++){
            //~ if (i % 2 > 0){
                //~ listeRes.push(resultats[i]);
                //~ alert(resultats[i]);
            //~ }
        //~ }
        return listeRes;
    }

    function getProp(prop){
        var valeur;
        //var regex = new RegExp('[\n\r]\s*'+prop+'\s*=\s*[\'"]([^\'"]*)[\'"]');
        var regex = new RegExp(prop+'\s*=\s*[\'"]([^\'"]*)[\'"]');
        res = regex.exec(this.txtEngine);
        if (res){
            valeur = res[1];
        }
        return valeur;
    }
}

function rechercherS(){
    var nodeEngine = document.getElementById('resultClassement').childNodes[3];
    var engine = new SearchEngine(nodeEngine.id);
    engine.recherche('miaou', 2);
    
}