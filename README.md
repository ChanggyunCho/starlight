# Starlight chrome devtools extension

## Usage

1. Download the source
1. Connect to `chrome://extensions` in chrome
1. Click 'Load Unpacked Extension'
1. Select folder
1. Open devtools (F12) in the page you wanna capture
1. Select "Elements" Panel
1. Select "Starlight" sidebar

## Chrome devtools extension

- Documents: <https://developer.chrome.com/extensions/devtools>
- Messaging from injected script to devtools panel/sidebar: <http://thomasboyt.github.io/2014/10/06/chrome-message-workaround.html>


## Devtools extension 만드는 과정

### 1. [manifest.json](/manifest.json) 정의

### 2. 시작점은 [html](/devtools.html)이 되고 여기에 script를 넣음으로써 확장이 됨

### 3. sidebar에 대한 html 지정

```javascript
chrome.devtools.panels.elements.createSidebarPane("Starlight",
    function(sidebar) {
        sidebar.setPage("html/sidebar.html");
});
```

### 4. background script 정의

Backgound script의 역할

- Script injection: DOM element에 접근하기 위해선 script injection이 필수
- injected script와 sidebar간의 연결 중계

manifest.json

```json
{
    "background": {
        "scripts": ["background.js"],
        "persistent": false
    }
}
```

### 5. Script injection

 이 크롬 확장은 개발자도구의 Elements 탭에서 선택한 html tag를 가져다가 내가 원하는 다른 페이지에 embedding이 가능하도록 만들어주고자 했다.
이 때문에 Elements 탭에서 선택한 아이템을 다시 sidebar로 가져와야 하는데 이것을 위해서 script injection이 필요하다.
그리고 Script injection은 `chrome.tabs.executeScript()` 메소드를 통해 가능한데 이것은 background script에서만 실행할 수 있다.

```javascript
//background.js
chrome.tabs.executeScript(message.tabId, { file: message.scriptToInject });
```

### 6. Content script 정의

 Injected script와 background 또는 panel/sidebar간 direct messaging channel이 없는 관계로 content script를 중간에 둬서 통신을 해야한다.

```json
{
    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["content-script.js"],
            "run_at": "document_start"
        }
    ]
}
```

```javascript
// content-script.js
window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    // console.log("Recieve message event: ", event);
    var message = event.data;
    if (typeof message !== 'object' || message === null || message.source !== 'starlight-injected') return;
    console.log("Relay message: ", message);
    chrome.runtime.sendMessage(message);
});
```

### 7. Messaging

 Messaging 구조는 다음과 같다.

Injected script [inject.js](/inject.js) - Content script [content-script.js](/content-script.js) - Background script [background.js](/background.js) - Sidebar [sidebar.js](/script/sidebar.js)

```javascript
// inject.js
window.postMessage({
    command: "html",
    data: html,
    source: "starlight-injected"
}, '*');
```

```javascript
// content-script.js
window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    // console.log("Recieve message event: ", event);
    var message = event.data;
    if (typeof message !== 'object' || message === null || message.source !== 'starlight-injected') return;
    console.log("Relay message: ", message);
    chrome.runtime.sendMessage(message);
});
```

```javascript
// background.js
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
```

```javascript
// sidebar.js
backgroundPageConnection.onMessage.addListener(function(message) {
    console.log("Message from background: ", message);
    switch(message.command) {
        case "html":
        {
            //$("#input-xpath")
            //$("#sample").text(message.data);
            document.getElementById("sample").innerHTML = message.data;
        }
        break;
        default:
    }
});
```