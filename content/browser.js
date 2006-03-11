//Suppression des moteurs Goldorank de la boite de dialogue de base
function removeGoldorankEngines(){
    var goldorank_rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
    var goldorank_resRoot = goldorank_rdfService.GetResource('NC:SearchEngineRoot');
    var goldorank_resChild = goldorank_rdfService.GetResource('http://home.netscape.com/NC-rdf#child');
    var goldorank_ds = goldorank_rdfService.GetDataSource("rdf:internetsearch");
    var goldorank_all_res = goldorank_ds.GetAllResources();
    for(var r=0; goldorank_all_res.hasMoreElements(); r++)  {
        var res=goldorank_all_res.getNext();
        // res is a resource
        if (res instanceof Components.interfaces.nsIRDFResource)    {
            if (res.Value.match(/oldorank/)){
                goldorank_ds.Unassert(goldorank_resRoot, goldorank_resChild, res);
            }
        }
    }
    
    var goldorank_listeMoteursBase = document.getElementById('searchEnginePopup');
    goldorank_listeMoteursBase.builder.rebuild();
    goldorank_listeMoteursBase = document.getElementById('searchbar-dropmarker').firstChild;
    goldorank_listeMoteursBase.builder.rebuild();
}

window.addEventListener("load", function(e) {removeGoldorankEngines();}, false);
