console.log("Hello it's sidebar script!");

chrome.runtime.onMessage.addListener(function(req, sender) {
    console.log("Request arrived. request: ", req, ", sender: ", sender);
});