document.addEventListener("DOMContentLoaded", function() {
    const TOGGLE_BUTTON_ID = 'bionic-reading-toggle';
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;
    const TEXT_CONTAINERS = ["H3", "H4", "H5", "H6", "P", "DIV"];
    
    const toggleButton = document.getElementById(TOGGLE_BUTTON_ID);

    // Function to make parts of the word bold based on its length
    function makeBold(word) {
        const boldLength = word.length <= 2 ? 1 :
                           word.length <= 4 ? 2 :
                           word.length <= 6 ? 3 :
                           word.length <= 8 ? 4 : 5;
        return `<b class="bionic-reading">${word.substring(0, boldLength)}</b>${word.substring(boldLength)}`;
    }

    // Function to process all text nodes within specified elements
    function processTextNodes(node) {
        if (node.nodeType === TEXT_NODE) {
            const words = node.nodeValue.split(/\b/);
            const newContent = words.map(word => /\w/.test(word) ? makeBold(word) : word).join('');
            const newNode = document.createElement('span');
            newNode.classList.add('bionic-processed');
            newNode.dataset.originalText = node.nodeValue;
            newNode.innerHTML = newContent;
            node.parentNode.replaceChild(newNode, node);
        } else if (node.nodeType === ELEMENT_NODE && !node.classList.contains('bionic-processed')) {
            node.childNodes.forEach(child => processTextNodes(child));
        }
    }

    // Function to restore the original text
    function restoreOriginalText(node) {
        if (node.nodeType === ELEMENT_NODE) {
            const children = Array.from(node.childNodes);
            children.forEach(child => restoreOriginalText(child));
            if (node.tagName === 'SPAN' && node.classList.contains('bionic-processed')) {
                const originalText = node.dataset.originalText;
                const textNode = document.createTextNode(originalText);
                node.parentNode.replaceChild(textNode, node);
            }
        }
    }

    // Function to toggle bionic reading mode
    function toggleBionicReading() {
        const elements = document.querySelectorAll(TEXT_CONTAINERS.join(', '));
        elements.forEach(element => {
            if (element.classList.contains('bionic-processed')) {
                restoreOriginalText(element);
                element.classList.remove('bionic-processed');
            } else {
                processTextNodes(element);
                element.classList.add('bionic-processed');
            }
        });
        toggleButton.classList.toggle('active');
        localStorage.setItem('bionicReadingEnabled', toggleButton.classList.contains('active'));
    }

    // Event listener for the toggle button
    toggleButton.addEventListener('click', toggleBionicReading);

    // Check localStorage for bionic reading preference
    if (localStorage.getItem('bionicReadingEnabled') === 'true') {
        toggleButton.checked = true;
        toggleBionicReading();
    }
});
