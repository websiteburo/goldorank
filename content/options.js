function peupleValeurs(){
	nodeListeMoteurs = document.getElementById("listeMoteurs");
	nodeListeMoteurs.datasources = fichierMoteurs;
	nodeListeMoteurs.ref = "urn:goldorank:moteurs";
}

function getSelectedEngine(tree){
	if (tree instanceof Components.interfaces.nsIXULTreeBuilder) {
		alert('kkk');
		desc_moteur = tree.getResourceAtIndex(tree.currentIndex);
		if (desc_moteur instanceof Components.interfaces.nsIRDFResource){
			strNom = ds_moteurs.GetTarget(desc_moteur, rdf_nom, true);
			alert(strNom);
		}
	}
}