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

function show_rdf_ds(datasource_name) {
  var rdfService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
  var ds = rdfService.GetDataSource(datasource_name);
  var t="";
  var all_res=ds.GetAllResources();
  for(var r=0; all_res.hasMoreElements(); r++)  {
    if(t.length>50000) break;  // comment out for unlimited output
    var res=all_res.getNext();
    // res is a resource
    if (res instanceof Components.interfaces.nsIRDFResource)    {
      var tr=r + " R: "+res.Value+"\n";
      var ps= ds.ArcLabelsOut(res);
      while (ps.hasMoreElements())      {
        var predicate = ps.getNext();
        // predicate is a resource
        if (predicate instanceof Components.interfaces.nsIRDFResource)        {
          tr+="  -R:  "+predicate.Value+"\n";
          var ts= ds.GetTargets(res, predicate, true);
          while (ts.hasMoreElements())          {
            var target = ts.getNext();
            // target is either a resource, a literal or a typed-literal
            if (target instanceof Components.interfaces.nsIRDFResource)
              tr+="   >R: "+target.Value+"\n";
            else
            if (target instanceof Components.interfaces.nsIRDFLiteral)
              tr+="    >L: "+target.Value+"\n";
            else
            if (target instanceof Components.interfaces.nsIRDFBlob)
              tr+="    >BLOB length:"+target.length+"\n";
            else
            if (target instanceof Components.interfaces.nsIRDFInt)
              tr+="    >INT:"+target.Value+"\n";
            else
            if (target instanceof Components.interfaces.nsIRDFDate)
              tr+="    >DATE: "+target.Value+"\n";
            else
            if (target instanceof Components.interfaces.nsIRDFNode)
              tr+="    >Node \n";
            else
              tr+="    >Unknown\n";
          }
        } // end predicate-res
     } // end ps
     t+=tr+"\n";
    } else // should never happen
    if (res instanceof Components.interfaces.nsIRDFLiteral)    {
      t+=r + "L: "+res.Value+"\n";
    } else
      t+=r + "?: "+"\n";
  }
  return t;
}

//alert(show_rdf_ds("rdf:localstore"));

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