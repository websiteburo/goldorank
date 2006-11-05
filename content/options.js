function peupleValeurs(){
	nodeListeMoteurs = document.getElementById("listeMoteurs");
	nodeListeMoteurs.datasources = fichierMoteurs;
	nodeListeMoteurs.ref = "urn:goldorank:moteurs";
}

function getSelectedEngine(tree){
	//~ if (tree.view instanceof Components.interfaces.nsIXULTreeBuilder) {
	if (tree.view instanceof Components.interfaces.nsITreeView) {
		desc_moteur = tree.view.getResourceAtIndex(tree.currentIndex);
		if (desc_moteur instanceof Components.interfaces.nsIRDFResource){
			strNom = ds_moteurs.GetTarget(desc_moteur, rdf_nom, true);
			alert(strNom);
		}
	}
}