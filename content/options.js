function peupleValeurs(){
	nodeListeMoteurs = document.getElementById("listeMoteurs");
	nodeListeMoteurs.datasources = fichierMoteurs;
	nodeListeMoteurs.ref = "urn:goldorank:moteurs";
}

function getMoteurProperty(dsmoteur, prop){
    var valeur = "";
    var rdf_prop = rdfService.GetResource('urn:goldorank:rdf#'+prop);
    var txtProp = ds_moteurs.GetTarget(dsmoteur, rdf_prop, true);
    if (txtProp) {
        txtProp = txtProp.QueryInterface(Components.interfaces.nsIRDFLiteral);
        if (txtProp) {
            valeur = txtProp.Value;
        }
    }
    return valeur;
}

function getSelectedEngine(tree){
	if (tree.view instanceof Components.interfaces.nsIXULTreeBuilder) {
        desc_moteur = tree.view.getResourceAtIndex(tree.currentIndex);
        if (desc_moteur instanceof Components.interfaces.nsIRDFResource){
			proprietesMoteur = new Array('nom', 'serveur', 'url');
			for a in proprietesMoteur {
				prop = proprietesMoteur[a];
				alert(prop);
				document.getElementById(prop).value = getMoteurProperty(desc_moteur, prop);
			}
		}
    }
}

