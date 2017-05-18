console.log("Start Starlight devtools!");
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
var starlightSidebar;

function updateSidebar(contents) {
    starlightSidebar.setObject({outerHTML: contents.outerHTML});
}

chrome.devtools.panels.elements.createSidebarPane("Starlight",
    function(sidebar) {
        sidebar.setPage("html/sidebar.html");
        starlightSidebar = sidebar;
        // add listener to Elements Panel
        chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
            //sidebar.setExpression("(" + getSelectedElement.toString() + ")()");
            chrome.devtools.inspectedWindow.eval("setSelectedElement($0)", {useContentScriptContext: true});
        });
        // sidebar initialization code here
        //sidebar.setObject({ some_data: "Some data to show" });
});

// executed in the inspected page scope
function getSelectedElement() {
    if ($0) {
        return {tag: $0.outerHTML};
    } else return {};
}
// DevTools page -- devtools.js
// Create a connection to the background page
console.log("Connect to the background");
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function(message) {
    console.log("Message from background: ", message);
});

/*
chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "inject.js"
}, function(response) {
    console.log("Response: ", response);
});
*/
backgroundPageConnection.postMessage({
    command: "init",
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "inject.js"
})