console.log("Hello, background is running !!");

var connections = {};

// Background page -- background.js
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
    console.log("Starlight devtool connected !! connection: ", devToolsConnection);
    // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        // Inject a content script into the identified tab
        if (message.command === "init") {
            console.log("Initialize required!! command: ", message.command, "tabid: ", message.tabId, "script: ", message.scriptToInject);
            chrome.tabs.executeScript(message.tabId,
                { file: message.scriptToInject });
            connections[message.tabId] = devToolsConnection;
            
            devToolsConnection.onDisconnect.addListener(function() {
                console.log("Disconnected: ", devToolsConnection);
                devToolsConnection.onMessage.removeListener(devToolsListener);
                delete connections[message.tabId];
            });

            // send url of current tab
            // comment out: tabs.query is not stable on developer mode
            // https://bugs.chromium.org/p/chromium/issues/detail?id=462939
            /*
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                devToolsConnection.postMessage({command: "url", data: tabs[0].url});
            });
            */
        }
    }
    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

});

chrome.runtime.onMessage.addListener(function(req, sender, res) {
    console.log("Incoming message from injected script: ", req);
    if (sender.tab) {
        var senderTabId = sender.tab.id;
        console.log("Relay message from ", senderTabId, "request: ", req);
        if (connections[senderTabId]) {
            connections[senderTabId].postMessage(req);
        }
    }
    return true;
});