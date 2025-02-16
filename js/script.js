document.addEventListener('DOMContentLoaded', () => {
    // Load data from JSON file
    fetch('../json/data.json')
        .then(response => response.json())
        .then(data => {
            initialize(data.texts, data.buttonLabels, data.symbolCopy, data.latexCopy);
        })
        .catch(error => console.error('Error loading data:', error));
});

function initialize(texts, buttonLabels, symbolCopy, latexCopy) {
    // Handle grid item clicks for copying text
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('grid-item')) {
            const activeStyle = document.querySelector('.toggle-style-button.active').getAttribute('data-style');
            const topic = event.target.closest('.grid-container').getAttribute('data-topic');
            const index = Array.from(event.target.parentNode.children).indexOf(event.target);
            let textToCopy;
            if (activeStyle === 'inline') {
                textToCopy = symbolCopy[topic][index];
            } else {
                textToCopy = latexCopy[topic][index].replace(/\\\\/g, '\\');
            }
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopiedAnimation(event.target);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    });

    // Render math expressions
    renderMathInElement(document.body, {
        delimiters: [
            {left: "\\(", right: "\\)", display: false},
            {left: "\\[", right: "\\]", display: true}
        ]
    });

    // Handle toggle button clicks for showing content
    const toggleButtons = document.querySelectorAll('.toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            showContent(button.getAttribute('data-topic'), button, texts, buttonLabels);
        });
    });

    // Handle toggle-style-button clicks for setting active style
    const toggleStyleButtons = document.querySelectorAll('.toggle-style-button');
    toggleStyleButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleStyleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Trigger default content display
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

    // Render math expressions in the new content
    renderMathInElement(content, {
        delimiters: [
            {left: "\\(", right: "\\)", display: false},
            {left: "\\[", right: "\\]", display: true}
        ]
    });

    // Remove 'active' class from all toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle');
    toggleButtons.forEach(button => button.classList.remove('active'));

    // Add 'active' class to the clicked toggle button
    element.classList.add('active');
}

function showCopiedAnimation(element) {
    const button = element.querySelector('.Btn');
    const originalText = button.textContent;
    button.textContent = 'Copied';
    button.classList.add('copied');
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 2000);
}