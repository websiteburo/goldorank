
// customize Protocol.prototype.newChannel and these constants

// XPCOM constant definitions

const kSCHEME = "goldorank";
const kPROTOCOL_NAME = "Goldorank Protocol";
const kPROTOCOL_CONTRACTID = "@mozilla.org/network/protocol;1?name=" + kSCHEME;
const kPROTOCOL_CID = Components.ID("eaba24a8-06d6-4557-bf2d-a629028df21e");


// Mozilla defined
const kSTANDARDURL_CONTRACTID = "@mozilla.org/network/standard-url;1";
const kIOSERVICE_CONTRACTID = "@mozilla.org/network/io-service;1";
const kAPPSHELLSERVICE_CONTRACTID = "@mozilla.org/appshell/appShellService;1";
const nsISupports = Components.interfaces.nsISupports;
const nsIIOService = Components.interfaces.nsIIOService;
const nsIProtocolHandler = Components.interfaces.nsIProtocolHandler;
const nsIURI = Components.interfaces.nsIURI;
const nsIAppShellService = Components.interfaces.nsIAppShellService;

    
// Protocol definition
function Protocol() {}

Protocol.prototype = {

	QueryInterface: function(iid)
	{
		if (!iid.equals(nsIProtocolHandler) && !iid.equals(nsISupports)) {
			throw Components.results.NS_ERROR_NO_INTERFACE;
		}
		return this;
	},

	scheme: kSCHEME,
	
	protocolFlags: nsIProtocolHandler.URI_NORELATIVE | nsIProtocolHandler.URI_NOAUTH,
	
	allowPort: function(port, scheme) {
		return true;
	},

	newURI: function(spec, charset, baseURI) {
		var uri = Components.classes[kSTANDARDURL_CONTRACTID].createInstance(nsIURI);
		uri.spec = spec;
		return uri;
	},

    mooshWindowNumber: 0,

	newChannel: function(uri)
	{
        var appShellServiceClass = Components.classes[kAPPSHELLSERVICE_CONTRACTID];
        var appShellService = appShellServiceClass.getService(nsIAppShellService);
        var hiddenWindow = appShellService.hiddenDOMWindow;

		var mooshWindow;
        var newChannelURL = "javascript:void(0)";

        newWindow = hiddenWindow.open(
            "chrome://goldorank/content/goldorank.xul",
            "goldorank" + Protocol.prototype.mooshWindowNumber++,
            "chrome,resizable,minimizable"
        );
        
		hiddenWindow.setTimeout(
			function (newWindow) {
                
                // ...

			},
			250,
			newWindow
		);
        
        // create dummy nsIURI and nsIChannel instances
        var ios = Components.classes[kIOSERVICE_CONTRACTID].getService(nsIIOService);
        return ios.newChannel(newChannelURL, null, null);
	},
	
} 

// ProtocolFactory definition
var ProtocolFactory = new Object();

ProtocolFactory.createInstance = function (outer, iid) {
	if (outer != null) {
		throw Components.results.NS_ERROR_NO_AGGREGATION;
	}

	if (!iid.equals(nsIProtocolHandler) && !iid.equals(nsISupports)) {
		throw Components.results.NS_ERROR_NO_INTERFACE;
	}

	return new Protocol();
}
      

// TestModule definition

/**
 * JS XPCOM component registration goop:
 *
 * We set ourselves up to observe the xpcom-startup category.  This provides
 * us with a starting point.
 */

var TestModule = new Object();

TestModule.registerSelf = function (compMgr, fileSpec, location, type) {
	compMgr = compMgr.QueryInterface(
		Components.interfaces.nsIComponentRegistrar
	);
	compMgr.registerFactoryLocation(
		kPROTOCOL_CID,
		kPROTOCOL_NAME,
		kPROTOCOL_CONTRACTID,
		fileSpec, 
		location, 
		type
	);
}

TestModule.getClassObject = function (compMgr, cid, iid) {
	if (!cid.equals(kPROTOCOL_CID)) {
		throw Components.results.NS_ERROR_NO_INTERFACE;
	}

	if (!iid.equals(Components.interfaces.nsIFactory)) {
		throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
	}

	return ProtocolFactory;
}

TestModule.canUnload = function (compMgr) {
    return true;
}


// Module retreival interface

function NSGetModule() {
	return TestModule;
}

