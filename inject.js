console.log("Execute injected script");

var DOMNodePathStep = class {
    constructor(value, optimized) {
        this.value = value;
        this.optimized = optimized || false;
    }
    toString() {
        return this.value;
    }
};

function xPathValue (node, optimized) {
    var ownValue;
    var ownIndex = xPathIndex(node);
    if (ownIndex === -1)
        return null;
    switch (node.nodeType) {
    case Node.ELEMENT_NODE:
        if (optimized && node.getAttribute('id'))
            return new DOMNodePathStep('//*[@id="' + node.getAttribute('id') + '"]',true);
        ownValue = node.localName;
        break;
    case Node.ATTRIBUTE_NODE:
        ownValue = '@' + node.nodeName;
        break;
    case Node.TEXT_NODE:
    case Node.CDATA_SECTION_NODE:
        ownValue = 'text()';
        break;
    case Node.PROCESSING_INSTRUCTION_NODE:
        ownValue = 'processing-instruction()';
        break;
    case Node.COMMENT_NODE:
        ownValue = 'comment()';
        break;
    case Node.DOCUMENT_NODE:
        ownValue = '';
        break;
    default:
        ownValue = '';
        break;
    }
    if (ownIndex > 0)
        ownValue += '[' + ownIndex + ']';
    return new DOMNodePathStep(ownValue,node.nodeType === Node.DOCUMENT_NODE);
}

function getXPath(element) {
    if (element.nodeType === Node.DOCUMENT_NODE)
        return '/';
    var steps = [];
    var contextNode = element;
    while (contextNode) {
        var step = xPathValue(contextNode, true);
        if (!step)
            break;
        steps.push(step);
        if (step.optimized)
            break;
        contextNode = contextNode.parentNode;
    }
    steps.reverse();
    return (steps.length && steps[0].optimized ? '' : '/') + steps.join('/');
}


function xPathIndex (node) {
    function areNodesSimilar(left, right) {
        if (left === right)
            return true;
        if (left.nodeType === Node.ELEMENT_NODE && right.nodeType === Node.ELEMENT_NODE)
            return left.localName === right.localName;
        if (left.nodeType === right.nodeType)
            return true;
        var leftType = left.nodeType === Node.CDATA_SECTION_NODE ? Node.TEXT_NODE : left.nodeType;
        var rightType = right.nodeType === Node.CDATA_SECTION_NODE ? Node.TEXT_NODE : right.nodeType;
        return leftType === rightType;
    }
    var siblings = node.parentNode ? node.parentNode.children : null;
    if (!siblings)
        return 0;
    var hasSameNamedElements;
    for (var i = 0; i < siblings.length; ++i) {
        if (areNodesSimilar(node, siblings[i]) && siblings[i] !== node) {
            hasSameNamedElements = true;
            break;
        }
    }
    if (!hasSameNamedElements)
        return 0;
    var ownIndex = 1;
    for (var i = 0; i < siblings.length; ++i) {
        if (areNodesSimilar(node, siblings[i])) {
            if (siblings[i] === node)
                return ownIndex;
            ++ownIndex;
        }
    }
    return -1;
}

function setSelectedElement(selected) {
    if (selected) {
        var xpath = getXPath(selected);
        var html = selected.outerHTML;
        // send html to devtools page
        // console.log("Send message of selected html");
        window.postMessage({
            command: "html",
            data: {
                html: html,
                xpath: xpath
                // style: styles,
                // linkArray: linkArray
            },
            source: "starlight-injected"
        }, '*');
    }
}

function sendStyles() {
    console.log("Send styles to the background");
    let styles = [];
    let styleTags = document.getElementsByTagName("style");
    for (let i = 0; i < styleTags.length; ++i) {
        styles.push(styleTags[i].outerHTML);
    };
    let links = [];
    let linkTags = document.getElementsByTagName("link");
    for (let i = 0; i < linkTags.length; ++i) {
        // filter <link rel="stylesheet" ...>
        let attr = linkTags[i].getAttribute("rel");
        if (attr && attr === "stylesheet") {
            links.push(linkTags[i].outerHTML);
        }
    }

    window.postMessage({
        command: "style",
        data: {
            style: styles,
            link: links
        },
        source: "starlight-injected"
    }, '*');
}
sendStyles();