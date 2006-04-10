var lesMoteurs = [
        {
           "name": "Google",
           "description": "Google Search",
           "logo": "goldorank_google.gif",
            "method": "GET",
            "action": "http://www.google.com/search",
            "queryCharset": "utf-8",
            "resultListStart": "<!--a-->",
            "resultListEnd": "<!--z-->",
            "resultItemStart": "<!--m-->", 
            "resultItemEnd": "<!--n-->",
            "input_user": "q",
            "input_add": "hl=en&ie=utf-8&oe=utf-8",
            "inputnext_name": "start",
            "inputnext_factor": "10",

            
            "Nom": "Google",
            "Serveur": "www.google.com",
            "Url": "/search?p=",
            "Regexpos": "<a class='res'(.*?)<\/a",
      "Strdebutpage": "&page=",
      "parpage": false,
      "Taillepage": 10,
      "Decalagedebut": 0
    },
    {
        "name": "Yahoo",
        "description": "Yahoo Search",
        "logo": "goldorank_yahoo.gif",
        "method": "GET",
        "action": "http://search.yahoo.com/search",
        "resultListStart": "WEB RESULTS",
        "resultListEnd": "</ol>",
        "resultItemStart": "<li>", 
        "resultItemEnd": "search/cache",
        "goldorank_offset": "1",
        "input_user": "p",
        "input_add": "ei=UTF-8",
        "inputnext_name": "b",
        "inputnext_factor": "10",
        
        
        "Nom": "Yahoo",
        "Serveur": "fr.search.yahoo.com",
        "Url": "/search?p=",
        "Regexpos": "<li><div><a class=yschttl(.*?)<\/a",
        "Strdebutpage": "&b=",
        "parpage": false,
        "Taillepage": 10,
        "Decalagedebut": 1
    }
];

/*
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_google.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_yahoo.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_MSN.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_alltheweb.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_AltaVista.src"/>
    
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_Voila_France.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_google_fr.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_yahoo-france.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_MSN_fr.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_ask_fr.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_Lycos.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_Excite.src"/>
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_altafr.src"/>
    
    <RDF:li RDF:resource="NC:SearchCategory?engine=urn:search:engine:goldorank_technorati.src"/
*/
