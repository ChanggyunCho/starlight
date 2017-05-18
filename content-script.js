console.log("Add window event listener");

window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    // console.log("Recieve message event: ", event);
    var message = event.data;
    if (typeof message !== 'object' || message === null || message.source !== 'starlight-injected') return;
    console.log("Relay message: ", message);
    chrome.runtime.sendMessage(message);
});