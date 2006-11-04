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