var desc_moteur;

function peupleValeurs(){
	nodeListeMoteurs = document.getElementById("listeMoteurs");
	nodeListeMoteurs.datasources = fichierMoteurs;
	nodeListeMoteurs.ref = "urn:goldorank:moteurs";
}

function saveRdfMoteur(){
  var remote = ds_moteurs.QueryInterface(Components.interfaces.nsIRDFRemoteDataSource);
  remote.Flush();
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
      proprietesMoteur = ['nom', 'serveur', 'url', 'strDebutPage', 'parPage', 'decalageDebut', 'hasNextPage', 'resultListStart', 'resultListEnd', 'resultItemStart', 'resultItemEnd', 'resultItemRegexp', 'debug'];
      for (var i = 0, len = proprietesMoteur.length; i < len; i++) {
        prop = proprietesMoteur[i];
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

function searchProp(prop){
  var checkok = true;
  regexp = new RegExp( getMoteurProperty(desc_moteur, prop), "g");
  result = strPage.match(regexp);

  var thehbox = document.getElementById(prop).parentNode;

  if (result !== null){
    thehbox.setAttribute('style', 'background-color:green;');
    thehbox.firstChild.value = thehbox.firstChild.value + ' ' + result.length;
  }
  else {
    checkok = false;
    thehbox.setAttribute('style', 'background-color:red;');
  }
  return checkok;
}

function tester(){
	searchURL = 'http://' + getMoteurProperty(desc_moteur, 'serveur') + getMoteurProperty(desc_moteur, 'url') + 'test' ;
	strPage = wget(searchURL);
	
	//On recherche les elements definissant le moteur
  var checkok = searchProp('hasNextPage');

  debutZone = strPage.indexOf(getMoteurProperty(desc_moteur, 'resultListStart'));
  if ( debutZone >= 0){
    document.getElementById('resultListStart').parentNode.setAttribute('style', 'background-color:green;');
    strPage = strPage.substring(debutZone);
  }
  else {
    checkok = false;
    document.getElementById('resultListStart').parentNode.setAttribute('style', 'background-color:red;');
  }

  finZone = strPage.indexOf(getMoteurProperty(desc_moteur, 'resultListEnd'));
  if (finZone >= 0){
    document.getElementById('resultListEnd').parentNode.setAttribute('style', 'background-color:green;');
    strPage = strPage.substring(0, finZone);
  }
  else {
    checkok = false;
    document.getElementById('resultListEnd').parentNode.setAttribute('style', 'background-color:red;');
  }

  checkok = checkok && searchProp('resultItemStart') && searchProp('resultItemEnd');

	if (!checkok){
		debug(strPage);
	}
}

function showSql(){
  sql = "INSERT INTO `moteurs` (`nom`, `url`, `serveur`, `regexPos`, `strDebutPage`, `taillePage`, `decalageDebut`, `logo`, `parPage`, `strDebutListe`, `strFinListe`, `strDebutLien`, `strFinLien`, `strMarquePageSuiv`) VALUES ('"+getMoteurProperty(desc_moteur, 'nom').replace(/'/g,"\'")+"', '"+getMoteurProperty(desc_moteur, 'url').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'serveur').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'regexpos').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'strDebutPage').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'taillepage').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'decalageDebut').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'logo').replace(/chrome:\/\/goldorank\/content\/moteurs\//, "").replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'parPage').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'resultListStart').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'resultListEnd').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'resultItemStart').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'resultItemEnd').replace(/'/g,"\\'")+"', '"+getMoteurProperty(desc_moteur, 'hasNextPage').replace(/'/g,"\\'")+"');";
  alert(sql);
}
