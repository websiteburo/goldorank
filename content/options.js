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
			proprietesMoteur = new Array('nom', 'serveur', 'url', 'strDebutPage', 'parPage', 'decalageDebut', 'hasNextPage', 'resultListStart', 'resultListEnd', 'resultItemStart', 'resultItemEnd', 'debug');
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
	//On serialise le rdf dans une chaine de caractère
	var stringOutputStream = {
		data: "",
		close : function(){},
		flush : function(){},
		write : function (buffer,count){
			this.data += buffer;
			return count;
		},
		writeFrom : function (stream,count){},
		isNonBlocking: false
	}
	var serializer=Components.classes["@mozilla.org/rdf/xml-serializer;1"].createInstance(Components.interfaces.nsIRDFXMLSerializer);
	serializer.init(ds_moteurs);
	serializer.QueryInterface(Components.interfaces.nsIRDFXMLSource);
	serializer.Serialize(stringOutputStream);
	
	//On enregistre la chaine de caractères dans un fichier
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	} catch (e) {
		alert("Permission to save file was denied.");
	}
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	file.initWithPath( fichUserProfile.path );
	if ( file.exists() == false ) {
		file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
	}
	var fileOutputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream );
	/* Open flags 
	#define PR_RDONLY       0x01
	#define PR_WRONLY       0x02
	#define PR_RDWR         0x04
	#define PR_CREATE_FILE  0x08
	#define PR_APPEND      0x10
	#define PR_TRUNCATE     0x20
	#define PR_SYNC         0x40
	#define PR_EXCL         0x80
	*/
	fileOutputStream.init( file, 0x04 | 0x08 | 0x20, 644, 0 );
	var output = stringOutputStream.data.safeEntities();
	//~ debug(output);
	var result = fileOutputStream.write( output, output.length );
	fileOutputStream.close();
	stringOutputStream.close();
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
