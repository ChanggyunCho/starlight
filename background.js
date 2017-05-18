console.log("Hello, background is running !!");

// Background page -- background.js
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
    console.log("Starlight devtool connected !! connection: ", devToolsConnection);
    // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        // Inject a content script into the identified tab
        console.log("Inject required!! command: ", message.command, "tabid: ", message.tabId, "script: ", message.scriptToInject);
        chrome.tabs.executeScript(message.tabId,
            { file: message.scriptToInject });
    }
    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(function() {
        console.log("Disconnected: ", devToolsConnection);
        devToolsConnection.onMessage.removeListener(devToolsListener);
    });
});

chrome.runtime.onMessage.addListener(function(req, sender, res) {
    if (sender.tab) {
        var senderTabId = sender.tab.id;
        console.log("Relay message from ", senderTabId);
    }
    return true;
});

window.addEventListener('message', function(event) {
    //if (event.source !== window) return;
    console.log("Recieve message event: ", event);
    var message = event.data;
    if (typeof message !== 'object' || message === null || message.source !== 'starlight-injected') return;
    console.log("Relay message: ", message);
    chrome.runtime.sendMessage(message);
})