console.log("Start Starlight devtools!");

function updateSidebar(contents) {
    starlightSidebar.setObject({outerHTML: contents.outerHTML});
}

chrome.devtools.panels.elements.createSidebarPane("Starlight",
    function(sidebar) {
        sidebar.setPage("html/sidebar.html");
        // add listener to Elements Panel
        // chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
        //     chrome.devtools.inspectedWindow.eval("setSelectedElement($0)", {useContentScriptContext: true});
        // });
});