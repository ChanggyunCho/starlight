console.log("Execute injected script");

function setSelectedElement(selected) {
    if (selected) {
        var html = selected.outerHTML;
        //console.log("Selected: ", selected.outerHTML);
        // send html to devtools page
        console.log("Send message of selected html");
        /*
        chrome.runtime.sendMessage({
            tabId: chrome.devtools.inspectedWindow.tabId,
            command: "html",
            data: html
        });
        */
        window.postMessage({
            command: "html",
            data: html,
            source: "starlight-injected"
        }, '*');
    }
}