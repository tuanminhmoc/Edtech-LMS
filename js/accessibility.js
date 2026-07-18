'use strict';

(function () {
    const escapeSelector = value => window.CSS?.escape ? window.CSS.escape(value) : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
    function accessibleName(element) {
        return String(element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent || '').trim();
    }

    function enhance(root = document) {
        root.querySelectorAll('button').forEach(button => {
            if (!accessibleName(button)) {
                const svgUse = button.querySelector('use')?.getAttribute('href') || '';
                button.setAttribute('aria-label', svgUse ? `Nút ${svgUse.replace('#i-', '').replaceAll('-', ' ')}` : 'Nút thao tác');
            }
        });
        root.querySelectorAll('[role="button"]:not([tabindex])').forEach(element => element.tabIndex = 0);
        root.querySelectorAll('img:not([alt])').forEach(image => image.alt = '');
        root.querySelectorAll('input, select, textarea').forEach(control => {
            if (control.getAttribute('aria-label') || control.id && document.querySelector(`label[for="${escapeSelector(control.id)}"]`)) return;
            const placeholder = control.getAttribute('placeholder');
            if (placeholder) control.setAttribute('aria-label', placeholder);
        });
    }

    function focusActiveScreenHeading() {
        const screen = document.querySelector('.app-screen.active');
        if (!screen || ['quiz-app', 'flashcard-app'].includes(screen.id)) return;
        const heading = screen.querySelector('h1, h2, [role="heading"]');
        if (!heading) return;
        heading.tabIndex = -1;
        requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }

    document.addEventListener('keydown', event => {
        const target = event.target.closest?.('[role="button"]');
        if (!target || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        target.click();
    });

    document.addEventListener('DOMContentLoaded', () => {
        enhance();
        document.getElementById('toast-stack')?.setAttribute('aria-atomic', 'true');
        const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => node.nodeType === 1 && enhance(node))));
        observer.observe(document.body, { childList: true, subtree: true });
    });

    window.EdTechAccessibility = { enhance, focusActiveScreenHeading };
})();
