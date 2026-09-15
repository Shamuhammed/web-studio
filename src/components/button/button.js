// Button Component
import { createElement } from '../../core/utils.js';
import './button.scss';

export function createButton(text, onClick) {
    const button = createElement('button', {
        textContent: text,
        className: 'btn'
    });
    
    button.addEventListener('click', onClick);
    return button;
}