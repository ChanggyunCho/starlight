console.log("Hello it's sidebar script!");

// Create a connection to the background page
console.log("Connect to the background");
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

var styleElements = {};

// Add event listener to the button
document.getElementById("button-create").addEventListener("click", function() {
    var xpath = document.getElementById("input-xpath").value;
    var url = document.getElementById("input-url").value;
    if (xpath && url) {
        var xhr = new XMLHttpRequest();
        var requestUrl = "https://htmlpartitionsync.azurewebsites.net/api/PartitionJs?url=" + encodeURIComponent(url) + "&xpath=" + encodeURIComponent(xpath);
        var embedCode = "<script src=\"" + requestUrl + "\"></script>";
        document.getElementById("input-embed").value = embedCode;
        // document.getElementById("input-embed").textContent = embedCode;
        /*
        // Call GET method
        console.log("Call XHR: ", requestUrl);
        xhr.open("GET", requestUrl, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                var resp = console.log(xhr.responseText);
            }
        };
        xhr.send();
        */
    }
});

document.getElementById("button-copy-embed").addEventListener("click", function() {
    let inputField = document.getElementById("input-embed");
    if (inputField.value) {
        // copy to clipboard
        inputField.select();
        document.execCommand('copy');
    }
});

function getStyleTag() {
    let tag = "";
    if (styleElements.style) {
        styleElements.style.forEach(function(style) {
            tag += style;
            tag += "\n";
        });
    }
    if (styleElements.styleLink) {
        styleElements.styleLink.forEach(function(link) {
            tag += link;
            tag += "\n";
        });
    }
    return tag;
}

// Listener for message from background script (background.js)
backgroundPageConnection.onMessage.addListener(function(message) {
    console.log("Message from background: ", message);
    switch(message.command) {
        case "html":
        {
            //$("#input-xpath")
            //$("#sample").text(message.data);
            let html = getStyleTag() + message.data.html;
            document.getElementById("textarea-tag").textContent = html;
            document.getElementById("sample").innerHTML = html;
            document.getElementById("input-xpath").value = message.data.xpath;
        }
        break;
        case "url":
        {
            document.getElementById("input-url").value = message.data;
        }
        break;
        case "style":
        {
            styleElements.style = message.data.style;
            styleElements.styleLink = message.data.link;
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