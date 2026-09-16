import { initCalculator } from './calculator.js';
import { initCalculatorGuide } from './calculator-guide.js';

function initMobileNav() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('site-nav');

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('hidden') === false;
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
}

function initFaq() {
    document.querySelectorAll('[data-faq-item]').forEach((item) => {
        const button = item.querySelector('[data-faq-button]');
        const answer = item.querySelector('[data-faq-answer]');

        if (!button || !answer) {
            return;
        }

        button.addEventListener('click', () => {
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('[data-faq-item]').forEach((other) => {
                other.querySelector('[data-faq-button]')?.setAttribute('aria-expanded', 'false');
                other.querySelector('[data-faq-answer]')?.classList.add('hidden');
                other.querySelector('[data-faq-icon]')?.classList.remove('rotate-180');
            });

            if (!isOpen) {
                button.setAttribute('aria-expanded', 'true');
                answer.classList.remove('hidden');
                item.querySelector('[data-faq-icon]')?.classList.add('rotate-180');
            }
        });
    });
}

function initContactForm() {
    const form = document.querySelector('#contact form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.reset();
        alert('Заявка отправлена. Мы свяжемся с вами в рабочее время.');
    });
}

export function initApp() {
    initMobileNav();
    initFaq();
    initCalculator();
    initCalculatorGuide();
    initContactForm();
}

export function initialize() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
        return;
    }

    initApp();
}
