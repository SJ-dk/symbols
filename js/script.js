document.addEventListener('DOMContentLoaded', () => {
    // Load JSON
    fetch('json/data.json')
        .then(response => response.json())
        .then(data => {
            initialize(data.texts, data.buttonLabels, data.symbolCopy, data.latexCopy);
        })
        .catch(error => console.error('Error loading data:', error));
});

function initialize(texts, buttonLabels, symbolCopy, latexCopy) {

    document.addEventListener('click', (event) => {
        const gridItem = event.target.closest('.grid-item');
        if (!gridItem) return;

        const activeStyle = document.querySelector('.toggle-style-button.active').getAttribute('data-style');
        const topic = gridItem.closest('.grid-container').getAttribute('data-topic');
        const index = Array.from(gridItem.parentNode.children).indexOf(gridItem);
        let textToCopy;
        if (activeStyle === 'inline') {
            textToCopy = symbolCopy[topic][index];
        } else {
            textToCopy = latexCopy[topic][index].replace(/\\\\/g, '\\');
        }
        navigator.clipboard.writeText(textToCopy).then(() => {
            showCopiedAnimation(gridItem);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    // Render math
    renderMathInElement(document.body, {
        delimiters: [
            {left: "\\(", right: "\\)", display: false},
            {left: "\\[", right: "\\]", display: true}
        ]
    });


    const toggleButtons = document.querySelectorAll('.toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            showContent(button.getAttribute('data-topic'), button, texts, buttonLabels);
        });
    });


    const toggleStyleButtons = document.querySelectorAll('.toggle-style-button');
    toggleStyleButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleStyleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });


    const defaultTopic = document.querySelector('.toggle.active').getAttribute('data-topic');
    const defaultButton = document.querySelector('.toggle.active');
    showContent(defaultTopic, defaultButton, texts, buttonLabels);
}

function showContent(topic, element, texts, buttonLabels) {
    const content = document.getElementById('content');
    let html = '';

    if (texts[topic]) {
        html = `
            <div class="grid-container" data-topic="${topic}">
                ${texts[topic].map((text, index) => `
                    <div class="grid-item" title="Click to copy">
                        <div class="text">${text}</div>
                        <button class="Btn">${buttonLabels[topic] ? buttonLabels[topic][index] : text}</button>
                    </div>
                `).join('')}
            </div>`;
    } else {
        html = '<p>Select a topic from the menu to see more information.</p>';
    }

    content.innerHTML = html;

    renderMathInElement(content, {
        delimiters: [
            {left: "\\(", right: "\\)", display: false},
            {left: "\\[", right: "\\]", display: true}
        ]
    });
    const toggleButtons = document.querySelectorAll('.toggle');
    toggleButtons.forEach(button => button.classList.remove('active'));

    element.classList.add('active');
}

function showCopiedAnimation(element) {
    const button = element.querySelector('.Btn');
    const originalHTML = button.innerHTML;
    button.innerHTML = 'Copied <span class="copied-check">check</span>';
    button.classList.add('copied');
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
    }, 2000);
}

const githubIcon = document.createElement('img');
githubIcon.src = 'assets/github-mark-white.svg';
githubIcon.alt = 'GitHub';
githubIcon.width = 20;
githubIcon.height = 20;
document.body.appendChild(githubIcon);

const githubIconElement = document.createElement('div');
githubIconElement.innerHTML = '<img src="assets/github-mark-white.svg" alt="GitHub" width="20" height="20" />';
document.body.appendChild(githubIconElement);