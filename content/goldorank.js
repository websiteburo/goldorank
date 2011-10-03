var nodeButton = document.createElement('button');
nodeButton.height="25";
nodeButton.setAttribute('label', 'STOP');
nodeButton.setAttribute('oncommand', 'interruptionMoteur();');


function peupleValeurs(){
    document.getElementById('motscles').value=opener.content.document.getSelection();
    document.getElementById('page').value=opener.content.document.location;

    // Construction des modeles
    stringsBundle = document.getElementById("string-bundle");
    //.....NodeTabPanel
    nodeTabPanel = document.createElement('tabpanel');
    nodeTabPanel.setAttribute('flex', '1');
    nodeGrid = document.createElement('grid');
    nodeGrid.setAttribute('flex', '1');
    nodeGrid.setAttribute('class', 'simililist');
    nodeColumns = document.createElement('columns');
    nodeColumn = document.createElement('column');
    nodeColumn1 = document.createElement('column');
    nodeColumn1.setAttribute('flex', '1');
    nodeColumn2 = document.createElement('column');
    nodeColumn2.setAttribute('flex', '2');
    nodeColumn3 = document.createElement('column');
    nodeColumn3.setAttribute('flex', '1');
    nodeColumn4 = document.createElement('column');
    nodeColumn4.setAttribute('flex', '1');
    nodeColumn5 = document.createElement('column');
    nodeColumn5.setAttribute('flex', '2');
    nodeColumns.appendChild(nodeColumn);
    nodeColumns.appendChild(nodeColumn1);
    nodeColumns.appendChild(nodeColumn2);
    nodeColumns.appendChild(nodeColumn3);
    nodeColumns.appendChild(nodeColumn4);
    nodeColumns.appendChild(nodeColumn5);
    nodeRows = document.createElement('rows');
    nodeRoww = document.createElement('row');
    nodeRoww.setAttribute('class', 'simililistHeader');
    nodeLabel = document.createElement('label');
    nodeLabel.setAttribute('value', ' ');
    nodeLabel1 = document.createElement('label');
    nodeLabel1.setAttribute('value', ''+stringsBundle.getString('stEngine'));
    nodeLabel2 = document.createElement('label');
    nodeLabel2.setAttribute('value', stringsBundle.getString('stProgress'));
    nodeLabel3 = document.createElement('label');
    nodeLabel3.setAttribute('value', stringsBundle.getString('stRank'));
    nodeLabel4 = document.createElement('label');
    nodeLabel4.setAttribute('value', stringsBundle.getString('stPage'));
    nodeLabel5 = document.createElement('label');
    nodeLabel5.setAttribute('value',stringsBundle.getString('stResults'));
    nodeRoww.appendChild(nodeLabel);
    nodeRoww.appendChild(nodeLabel1);
    nodeRoww.appendChild(nodeLabel2);
    nodeRoww.appendChild(nodeLabel3);
    nodeRoww.appendChild(nodeLabel4);
    nodeRoww.appendChild(nodeLabel5);
    nodeRows.appendChild(nodeRoww);
    nodeGrid.appendChild(nodeColumns);
    nodeGrid.appendChild(nodeRows);
    nodeTabPanel.appendChild(nodeGrid);

    //........nodeRow
    nodeRow = document.createElement('row');
    nodeHbox = document.createElement('hbox');
    nodeCheckbox = document.createElement('checkbox');
    nodeCheckbox.setAttribute('checked', 'false');
    nodeHbox.appendChild(nodeCheckbox);
    nodeHbox1 = document.createElement('hbox');
    nodeVbox = document.createElement('vbox');
    nodeSpacer = document.createElement('spacer');
    nodeSpacer.setAttribute('flex', '1');
    nodeImage = document.createElement('image');
    nodeImage.setAttribute('class', '.engine-icon');
    nodeSpacer1 = document.createElement('spacer');
    nodeSpacer1.setAttribute('flex', '1');
    nodeLabelr = document.createElement('label');
    nodeVbox.appendChild(nodeSpacer);
    nodeVbox.appendChild(nodeImage);
    nodeVbox.appendChild(nodeSpacer1);
    nodeHbox1.appendChild(nodeVbox);
    nodeHbox1.appendChild(nodeLabelr);
    nodeHbox2 = document.createElement('hbox');
    nodeProgress = document.createElement('progressmeter');
    nodeProgress.setAttribute('mode', 'determined');
    nodeProgress.setAttribute('value', '0');
    nodeProgress.setAttribute('flex', '1');
    nodeHbox2.appendChild(nodeProgress);
    nodeHbox3 = document.createElement('hbox');
    nodeLabelr1 = document.createElement('label');
    nodeHbox3.appendChild(nodeLabelr1);
    nodeHbox4 = document.createElement('hbox');

    //nodeLabelr2 = document.createElement('label');
    nodeButtonr2 = document.createElement('button');
    nodeButtonr2.height="25";
    nodeButtonr2.setAttribute('label', '');
    nodeHbox4.appendChild(nodeButtonr2);

    nodeHbox5 = document.createElement('hbox');
    nodeMenulist = document.createElement('menulist');
    nodeMenulist.setAttribute('oncommand', 'ouvreUrl(this.value);');
    nodeMenulist.setAttribute('style', 'display:none;');
    nodeMenupopup = document.createElement('menupopup');
    nodeMenulist.appendChild(nodeMenupopup);
    nodeHbox5.appendChild(nodeMenulist);
    nodeRow.appendChild(nodeHbox);
    nodeRow.appendChild(nodeHbox1);
    nodeRow.appendChild(nodeHbox2);
    nodeRow.appendChild(nodeHbox3);
    nodeRow.appendChild(nodeHbox4);
    nodeRow.appendChild(nodeHbox5);
    // Fin construction modeles
    
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
            //unrow.setAttribute('style', 'display:inline;');
        }
        
        nodeTabPanels.appendChild(untabpanel);
        //untabpanel.setAttribute('style', 'display:inline;');
      }
    }
    nodeTabs.selectedIndex=0;
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
    resultsCell = moteur.childNodes[5].firstChild.firstChild;
			while (resultsCell.firstChild){
				resultsCell.removeChild(resultsCell.firstChild);
			}
		//resultsCell.parentNode.setAttribute('style', 'display:none;');
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

/**************Génération des rapports *************/
var report_page;
report = function(){
	//doc = window.opener.getBrowser().selectedBrowser.contentDocument; 
	doc = report_page.document;

	doc.getElementById('recherche').innerHTML =  document.getElementById('motscles').value;
	doc.getElementById('url').innerHTML = document.getElementById('page').value;
  var currentTime = new Date();
	doc.getElementById('date').innerHTML = currentTime.toLocaleString();

  //On parcourt les moteurs et on affiche les résultats obtenus
  nodeTabPanels = document.getElementById('lestabpanels');
	nodeEngine = nodeTabPanels.childNodes[nodeTabs.selectedIndex].firstChild.childNodes[1].childNodes[1];
  while (nodeEngine){
    checkedCell = nodeEngine.childNodes[0].firstChild;
    rankCell = nodeEngine.childNodes[3].firstChild;
    pageCell = nodeEngine.childNodes[4].firstChild;
		if (checkedCell.checked){ 
      //doc.getElementById('results').innerHTML += "<table><tr><td colspan='2'><img src='"+nodeEngine.childNodes[1].firstChild.childNodes[1].src+"'> <b>"+nodeEngine.childNodes[1].childNodes[1].value+"</b></td></tr><tr><td>Position : "+rankCell.value+"</td></tr><tr><td>Page : "+pageCell.value+"</td></tr></table>";
      doc.getElementById('results').innerHTML += "<div class='moteur'><img src='"+nodeEngine.childNodes[1].firstChild.childNodes[1].src+"'> <b>"+nodeEngine.childNodes[1].childNodes[1].value+"</b><br />Position : "+rankCell.value+"<br />Page : "+pageCell.label.value+"</div>";
    }
    nodeEngine = nodeEngine.nextSibling;
  }
};

function generateReport(){
	//var tBrowser = window.opener.getBrowser() ;
	//tBrowser.selectedTab = tBrowser.addTab("chrome://goldorank/content/report.html");
	report_page = window.open("chrome://goldorank/content/report.html", 'report_page');
	setTimeout(report,  1000);
}

