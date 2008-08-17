var desc_moteur;

function peupleValeurs(){
	nodeListeMoteurs = document.getElementById("listeMoteurs");
	nodeListeMoteurs.datasources = fichierMoteurs;
	nodeListeMoteurs.ref = "urn:goldorank:moteurs";
}

function doOK(){
	saveRdfMoteur();
	return true;
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
			proprietesMoteur = new Array('nom', 'serveur', 'url', 'strDebutPage', 'parPage', 'decalageDebut', 'hasNextPage', 'resultListStart', 'resultListEnd', 'resultItemStart', 'resultItemEnd', 'resultItemRegexp', 'debug');
			for (a in proprietesMoteur) {
				prop = proprietesMoteur[a];
				document.getElementById(prop).value = getMoteurProperty(desc_moteur, prop);
				document.getElementById(prop).parentNode.setAttribute('style', '');
			}
		}
    }
}

function setMoteurProperty(nodeProperty){
	var rdf_prop = rdfService.GetResource('urn:goldorank:rdf#'+nodeProperty.id);
	var oldname = getMoteurProperty(desc_moteur, nodeProperty.id);
    var name = nodeProperty.value;
	//~ debug(getMoteurProperty(desc_moteur, nodeProperty.id));
	ds_moteurs.Change(desc_moteur, rdf_prop, rdfService.GetLiteral(oldname), rdfService.GetLiteral(name));
}

function saveRdfMoteur(){
  var remote = ds_moteurs.QueryInterface(Components.interfaces.nsIRDFRemoteDataSource);
  remote.Flush();
}

function tester(){
	searchURL = 'http://' + getMoteurProperty(desc_moteur, 'serveur') + getMoteurProperty(desc_moteur, 'url') + 'test' ;
	strPage = wget(searchURL);
	
	//On recherche les elements definissant le moteur
	propsToCheck = new Array('hasNextPage', 'resultListStart', 'resultListEnd', 'resultItemStart', 'resultItemEnd');
	checkok = true;
	for (a in propsToCheck) {
		prop = propsToCheck[a];
		regexp = new RegExp( getMoteurProperty(desc_moteur, prop));
		result = regexp.exec(strPage);
		
		if (result != null){
			document.getElementById(prop).parentNode.setAttribute('style', 'background-color:green;');
		}
		else {
			checkok = false;
			document.getElementById(prop).parentNode.setAttribute('style', 'background-color:red;');
		}
	}
	if (!checkok){
		debug(strPage);
	}
}
