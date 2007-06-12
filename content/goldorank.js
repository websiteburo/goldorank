var nodeButton = document.createElement('button');
nodeButton.height="25";
nodeButton.setAttribute('label', 'STOP');
nodeButton.setAttribute('oncommand', 'interruptionMoteur();');

function peupleValeurs(){
    document.getElementById('motscles').value=opener.content.document.getSelection();
    document.getElementById('page').value=opener.content.document.location;
    
    nodeTabPanel = document.getElementById("tabpanel_modele");
    nodeRow = document.getElementById("row_modele");
    
    nodeTabs = document.getElementById('lestabs');
    nodeTabPanels = document.getElementById('lestabpanels');
    
    // Construction des tabs et des moteurs à partir du fichier rdf
    container.Init(ds_moteurs, rdf_moteurs);
    var moteurs_langues = container.GetElements();
    while (moteurs_langues.hasMoreElements()){
      untab = document.createElement('tab');
      var langue = moteurs_langues.getNext();
      if (langue instanceof Components.interfaces.nsIRDFResource){
        var strLangue = ds_moteurs.GetTarget(langue, rdf_langue, true);
        var strLogolangue = ds_moteurs.GetTarget(langue, rdf_logo_langue, true);
        if (strLogolangue instanceof Components.interfaces.nsIRDFLiteral){
          strLogolangue = strLogolangue.Value;
          unlogo = document.createElement('image');
          unlogo.setAttribute('src', strLogolangue);
          untab.appendChild(unlogo);
        }
        if (strLangue instanceof Components.interfaces.nsIRDFLiteral){
          strLangue = strLangue.Value;
          unlabel = document.createElement('label');
          unlabel.setAttribute('value', strLangue);
          untab.appendChild(unlabel);
          
        }
        nodeTabs.appendChild(untab);
        untabpanel = nodeTabPanel.cloneNode(true);
        container.Init(ds_moteurs, langue);
        lesmoteurs = container.GetElements();
        while (lesmoteurs.hasMoreElements()){
            desc_moteur = lesmoteurs.getNext();
            if (desc_moteur instanceof Components.interfaces.nsIRDFResource){
                strNom = ds_moteurs.GetTarget(desc_moteur, rdf_nom, true);
                if (strNom instanceof Components.interfaces.nsIRDFLiteral){
                  strNom = strNom.Value;
                }
                strLogo = ds_moteurs.GetTarget(desc_moteur, rdf_logo, true);
                if (strLogo instanceof Components.interfaces.nsIRDFLiteral){
                  strLogo = strLogo.Value;
                }
            }
            unrow = nodeRow.cloneNode(true);
            unrow.setAttribute('name', strNom);
            unrow.setAttribute('id', desc_moteur.Value);
            unrow.firstChild.nextSibling.firstChild.firstChild.nextSibling.setAttribute('src', strLogo);
            unrow.firstChild.nextSibling.firstChild.nextSibling.setAttribute('value', strNom);
            untabpanel.firstChild.firstChild.nextSibling.appendChild(unrow);
        }
        
        nodeTabPanels.appendChild(untabpanel);
      }
    }
    nodeTabs.firstChild.selected='true';
    nodeTabPanel.setAttribute('style', 'display:none;');
    nodeRow.setAttribute('style', 'display:none;');
}

function rechercherS(){
	//Valeurs de recherche
	searchText = document.getElementById('motscles').value;
	searchText = searchText ? searchText : "A";
	pageCherchee = document.getElementById('page').value;
	regexPageCherchee = new RegExp('(http://)?'+RegExp.escape(pageCherchee)+'/?');
	maxRank = document.getElementById('maxRank').value;

	//nodeEngine = nodeTabPanels.childNodes[nodeTabs.selectedIndex].firstChild.childNodes[2];
	nodeEngine = nodeTabPanels.childNodes[nodeTabs.selectedIndex].firstChild.childNodes[1].childNodes[1];
	//On réinitialise l'affichage
	var moteur = nodeEngine;
	while (moteur){
		//progressCell
		moteur.childNodes[2].firstChild.value = '0';
		//rankCell
		moteur.childNodes[3].firstChild.value = '';
		//pageCell
		moteur.childNodes[4].firstChild.value = '';
		//resultsCell
		resultsCell = moteur.childNodes[5].firstChild.firstChild
			while (resultsCell.firstChild){
				resultsCell.removeChild(resultsCell.firstChild);
			}
		resultsCell.parentNode.setAttribute('style', 'display:none;');
		//Bouton stop
		if (resultsCell.parentNode.parentNode.length == 2){
			resultsCell.parentNode.parentNode.removeChild(nodeButton);
		}
		moteur = moteur.nextSibling;
	}

	var engine;
	if (nodeEngine){
		engine = new SearchEngine(nodeEngine);
		if (engine.engineInitialized){
			//On effectue la recherche
			resultsCell.parentNode.parentNode.appendChild(nodeButton);
			engine.recherche(searchText);
		}
		else nextEngine();
	}    
}

function ouvreUrl(url){
	var tBrowser = opener.document.getElementById("content") ;
	tBrowser.selectedTab = tBrowser.addTab(url) ;
}

function generateReport(){
	var tBrowser = window.opener.getBrowser() ;
	tBrowser.selectedTab = tBrowser.addTab("chrome://goldorank/content/report.html");
	setTimeout("report()",  1000);
}
function report(){
	doc = window.opener.getBrowser().selectedBrowser.contentDocument; 
	divRecherche = doc.getElementById('recherche');
	divURL = doc.getElementById('url');
	divResults = doc.getElementById('results');

	divRecherche.innerHTML =  document.getElementById('motscles').value;
	divURL.innerHTML = document.getElementById('page').value;
	divResults.innerHTML = "tout plein de resultats!!!";
}
