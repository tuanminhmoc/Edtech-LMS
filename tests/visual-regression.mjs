import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createReadStream, existsSync } from 'node:fs';
import crypto from 'node:crypto';
import { stressSets, historyFixture } from './fixtures/stress-data.mjs';

const update = process.argv.includes('--update');
const runnerRoot = process.cwd();
const root = path.resolve(process.env.VISUAL_PROJECT_ROOT || runnerRoot);
const baselineDir = path.resolve(process.env.VISUAL_BASELINE_DIR || path.join(runnerRoot, 'tests/visual-baselines'));
const outputDir = path.resolve(process.env.VISUAL_OUTPUT_DIR || path.join(runnerRoot, 'tests/visual-output'));
await fs.mkdir(baselineDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const baseURL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4173/?visualTest=1';

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const filePath = path.join(root, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!filePath.startsWith(root) || !existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
    res.setHeader('Content-Type', mime[path.extname(filePath)] || 'application/octet-stream');
    createReadStream(filePath).pipe(res);
});
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));

const viewports = {
    desktop: { width: 1440, height: 900 },
    laptop: { width: 1366, height: 768 },
    tablet: { width: 768, height: 1024 },
    android: { width: 360, height: 800 },
    iphone: { width: 390, height: 844 }
};

const cases = {
    dashboard: async page => page.evaluate(() => showScreen('dashboard-screen')),
    setup: async page => page.evaluate(() => openPracticeSetup('quiz')),
    quiz: async page => page.evaluate(rows => startQuizMode(rows), stressSets.quiz4),
    'quiz-result': async page => { await page.evaluate(rows => { startQuizMode(rows); gradeQuiz(true); }, stressSets.quiz4); },
    'flashcard-front': async page => page.evaluate(rows => startFlashcardMode(rows), stressSets.flashcardLong),
    'flashcard-back': async page => { await page.evaluate(rows => startFlashcardMode(rows), stressSets.flashcardLong); await page.locator('#fc-card').click(); },
    library: async page => {
        await page.evaluate(async ({ quiz, flash }) => {
            await EdTechDB.saveQuestionSet({ id: 'visual-quiz', name: 'Bộ đề kiểm thử dài tiếng Việt ✨', type: 'quiz', rows: quiz });
            await EdTechDB.saveQuestionSet({ id: 'visual-fc', name: 'Flashcard kiểm thử', type: 'flashcard', rows: flash });
            openQuestionLibrary();
        }, { quiz: stressSets.quiz100, flash: stressSets.flashcardLong });
    },
    creator: async page => page.evaluate(() => openCreator('quiz')),
    history: async page => {
        await page.evaluate(async history => {
            const learning = { history, xp: 46, reviewedCards: 20, flashcards: {} };
            await EdTechDB.setKV('learning', learning);
            localStorage.setItem('edtech_lms_pro_data', JSON.stringify(learning));
        }, historyFixture());
        await page.reload({ waitUntil: 'networkidle' });
        await dismissIntro(page);
        await page.evaluate(() => showHistoryScreen());
    },
    settings: async page => page.evaluate(() => openDataCenter())
};

async function dismissIntro(page) {
    await page.evaluate(() => {
        document.getElementById('brand-intro')?.remove();
        document.documentElement.classList.remove('intro-pending');
        document.body.classList.remove('intro-open');
    });
}

function digest(buffer) { return crypto.createHash('sha256').update(buffer).digest('hex'); }

const launchOptions = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
else if (existsSync('/usr/bin/chromium')) launchOptions.executablePath = '/usr/bin/chromium';
const browser = await chromium.launch(launchOptions);
let failures = 0;
try {
    for (const [viewportName, viewport] of Object.entries(viewports)) {
        for (const [caseName, setup] of Object.entries(cases)) {
            const context = await browser.newContext({ viewport, reducedMotion: 'reduce', colorScheme: 'dark', deviceScaleFactor: 1 });
            const page = await context.newPage();
            await page.addInitScript(() => {
                localStorage.setItem('edtech_lms_pro_theme', 'dark');
                localStorage.setItem('edtech_intro_sound', '0');
            });
            await page.goto(baseURL, { waitUntil: 'networkidle' });
            await dismissIntro(page);
            await setup(page);
            await page.waitForTimeout(250);
            const name = `${viewportName}-${caseName}.png`;
            const currentPath = path.join(outputDir, name);
            const baselinePath = path.join(baselineDir, name);
            const buffer = await page.screenshot({ path: currentPath, fullPage: true, animations: 'disabled' });
            if (update) {
                await fs.writeFile(baselinePath, buffer);
                console.log(`BASELINE ${name}`);
            } else if (!existsSync(baselinePath)) {
                failures += 1;
                console.error(`MISSING BASELINE ${name} — run npm run visual:update first.`);
            } else {
                const baseline = await fs.readFile(baselinePath);
                if (digest(baseline) !== digest(buffer)) { failures += 1; console.error(`CHANGED ${name}`); }
                else console.log(`OK ${name}`);
            }
            await context.close();
        }
    }
} finally {
    await browser.close();
    server.close();
}
if (failures) process.exitCode = 1;
