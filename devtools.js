/*
chrome.devtools.panels.create(
    "Starlight",
    "icon.png",
    "starlight-console.html",
    function(panel) {
      // code invoked on panel creation
      panel.onShown.addListener(function(win){ win.focus(); });
    }
);
*/
chrome.devtools.panels.elements.createSidebarPane("Starlight",
    function(sidebar) {
        // add listener to Elements Panel
        chrome.devtools.panels.elements.onSearch.addListener(function(action, queryString) {
            console.log("Action: ", action, ", query: ", queryString);
        });
        // sidebar initialization code here
        sidebar.setObject({ some_data: "Some data to show" });
});

/*
// DevTools page -- devtools.js
// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

// Relay the tab ID to the background page
chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "content_script.js"
});

onShown.addListener(function callback)
extensionPanel.onShown.addListener(function (extPanelWindow) {
    extPanelWindow instanceof Window; // true
    extPanelWindow.postMessage( // …
});
*/