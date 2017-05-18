console.log("Hello it's sidebar script!");

// Create a connection to the background page
console.log("Connect to the background");
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function(message) {
    console.log("Message from background: ", message);
});

backgroundPageConnection.postMessage({
    command: "init",
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "inject.js"
});


// function getSelectedElement() {
//     return $0;
// }

chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
    chrome.devtools.inspectedWindow.eval("setSelectedElement($0)", {useContentScriptContext: true});
    // chrome.devtools.inspectedWindow.eval("("+getSelectedElement+")()", function(result, err) {
    //     if (err) throw result;

    //     console.log(result);
    // });
});

/*
chrome.runtime.onMessage.addListener(function(req, sender) {
    console.log("Request arrived. request: ", req, ", sender: ", sender);
});
*/