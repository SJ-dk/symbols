document.addEventListener('DOMContentLoaded', () => {
    // Load data from JSON file
    fetch('../json/data.json')
        .then(response => response.json())
        .then(data => {
            initialize(data.texts, data.buttonLabels);
        })
        .catch(error => console.error('Error loading data:', error));
});

function initialize(texts, buttonLabels) {
    // Handle grid item clicks for copying text
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('grid-item')) {
            const text = event.target.querySelector('.text').textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert(`Copied: ${text}`);
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

    // Handle toggle button clicks for copying content
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('toggle')) {
            const topic = event.target.getAttribute('data-topic');
            const activeStyle = document.querySelector('.toggle-style-button.active').getAttribute('data-style');
            const contentToCopy = activeStyle === 'inline' ? texts[topic].join(' ') : buttonLabels[topic].join(' ');
            navigator.clipboard.writeText(contentToCopy).then(() => {
                alert(`Copied: ${contentToCopy}`);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    });
}

function showContent(topic, element, texts, buttonLabels) {
    const content = document.getElementById('content');
    let html = '';

    if (texts[topic]) {
        html = `
            <div class="grid-container">
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