'use strict';

(function () {
    const promises = new Map();

    function loadScript(src, id) {
        if (id && document.getElementById(id)) return Promise.resolve();
        if (promises.has(src)) return promises.get(src);
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            if (id) script.id = id;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Không thể tải thư viện: ${src}`));
            document.head.appendChild(script);
        });
        promises.set(src, promise);
        return promise;
    }

    async function loadXLSX() {
        if (window.XLSX) return window.XLSX;
        window.showToast?.('Đang chuẩn bị công cụ Excel…', 'info');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'xlsx-lazy-script');
        if (!window.XLSX) throw new Error('Thư viện Excel chưa sẵn sàng. Hãy kiểm tra kết nối mạng và thử lại.');
        return window.XLSX;
    }

    function containsMath(text) {
        const value = String(text || '');
        return /\$[^$]+\$|\\\(|\\\[|\\frac|\\sqrt|\\begin\{|\\sum|\\int|\\alpha|\\beta/i.test(value);
    }

    async function loadMathJax() {
        if (window.MathJax?.typesetPromise) return window.MathJax;
        window.MathJax = window.MathJax || {
            tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            svg: { scale: 1.02, fontCache: 'global' },
            options: { enableMenu: false }
        };
        await loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js', 'MathJax-script');
        if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
        return window.MathJax;
    }

    async function typeset(target) {
        if (!target) return;
        const text = target.textContent || target.innerHTML || '';
        if (!containsMath(text)) return;
        try {
            const math = await loadMathJax();
            if (math.typesetClear) math.typesetClear([target]);
            await math.typesetPromise([target]);
        } catch (error) {
            console.warn('MathJax lazy-load failed:', error);
        }
    }

    window.EdTechLibraries = { loadScript, loadXLSX, loadMathJax, containsMath, typeset };
})();
