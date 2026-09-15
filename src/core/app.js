// App initialization and main logic

import { logMessage } from './utils.js';
import { createButton } from '../components/button/button.js';
import { createMessage } from '../components/message/message.js';

export function initApp() {
    logMessage('App initialized successfully!');
    
    const app = document.getElementById('app');
    if (!app) {
        logMessage('Error: App container not found');
        return;
    }
    
    const button = createButton('Click me!', () => {
        const message = createMessage('Button clicked! 🎉');
        app.appendChild(message);
    });
    
    app.appendChild(button);
}

export function initialize() {
    document.addEventListener('DOMContentLoaded', initApp);
}