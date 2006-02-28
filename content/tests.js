 function test(){
    output('Début des tests\n\n');
    //begin
    var rdf = Components.classes[RDFSERVICE_CONTRACTID].getService(nsIRDFService);
    var source = rdf.GetResource("NC:LastSearchRoot", true);
    var childProperty = rdf.GetResource("http://home.netscape.com/NC-rdf#LastText", true);
    output(childProperty);
    //end
    output('Fin des tests');
}
function output(text){
    divOutput = document.getElementsByTagName('body')[0];
    var txt = document.createTextNode(text);
    divOutput.appendChild(txt); 
}
bodytag = window.content.document.getElementsByTagName('body')[0];
lien = document.createElement('a');
lien.onclick = function (){test();}
lien.href='#';
lien.appendChild(document.createTextNode('test'));
bodytag.appendChild(lien);