// Core utility functions

export function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.textContent) {
        element.textContent = options.textContent;
    }
    
    if (options.className) {
        element.className = options.className;
    }
    
    if (options.styles) {
        Object.assign(element.style, options.styles);
    }
    
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    return element;
}

export function logMessage(message) {
    console.log(`[Web Studio] ${message}`);
}