console.log("Start Starlight devtools!");

function updateSidebar(contents) {
    starlightSidebar.setObject({outerHTML: contents.outerHTML});
}

chrome.devtools.panels.elements.createSidebarPane("Starlight",
    function(sidebar) {
        sidebar.setPage("html/sidebar.html");
});