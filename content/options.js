var desc_moteur;

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
			proprietesMoteur = new Array('nom', 'logo', 'serveur', 'url', 'strDebutPage', 'parPage', 'decalageDebut', 'hasNextPage', 'strNumPage', 'resultListStart', 'resultListEnd', 'resultItemStart', 'resultItemEnd');
			for (a in proprietesMoteur) {
				prop = proprietesMoteur[a];
				document.getElementById(prop).value = getMoteurProperty(desc_moteur, prop);
			}
		}
    }
}

function setMoteurProperty(nodeProperty){
	var rdf_prop = rdfService.GetResource('urn:goldorank:rdf#'+nodeProperty.id);
	var oldname = getMoteurProperty(desc_moteur, nodeProperty.id);
    var name = nodeProperty.value;
	debug(getMoteurProperty(desc_moteur, nodeProperty.id));
	ds_moteurs.Change(desc_moteur, rdf_prop, rdfService.GetLiteral(oldname), rdfService.GetLiteral(name));
	debug(getMoteurProperty(desc_moteur, nodeProperty.id));
	ds_moteurs.Unassert(desc_moteur, rdf_prop, rdfService.GetLiteral(oldname));
	debug(getMoteurProperty(desc_moteur, nodeProperty.id));
}

function saveRdfMoteur(){
	ds_moteurs.FlushTo( 'file://'+fichUserProfile.path);
	return true;
}