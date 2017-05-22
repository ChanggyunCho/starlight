console.log("Hello it's sidebar script!");

// Create a connection to the background page
console.log("Connect to the background");
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

// Listener for message from background script (background.js)
backgroundPageConnection.onMessage.addListener(function(message) {
    console.log("Message from background: ", message);
    switch(message.command) {
        case "html":
        {
            //$("#input-xpath")
            //$("#sample").text(message.data);
            document.getElementById("sample").innerHTML = message.data.html;
            document.getElementById("input-xpath").value = message.data.xpath;
        }
        break;
        default:
    }
});

// Send request for initialize injected script to the background
backgroundPageConnection.postMessage({
    command: "init",
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "inject.js"
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
    chrome.devtools.inspectedWindow.eval("setSelectedElement($0)", {useContentScriptContext: true});
});