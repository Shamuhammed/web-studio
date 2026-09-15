// Message Component
import { createElement } from '../../core/utils.js';
import './message.scss';

export function createMessage(text) {
    return createElement('p', {
        textContent: text,
        className: 'message'
    });
}