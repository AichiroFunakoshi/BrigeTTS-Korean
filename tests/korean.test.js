const { test, expect } = require('@playwright/test');

for (const scenario of [
    { source: 'ja', locale: 'ja-JP', button: 'startJapaneseBtn', input: 'こんにちは', output: '안녕하세요', target: 'ko-KR', stop: '停止' },
    { source: 'ko', locale: 'ko-KR', button: 'startKoreanBtn', input: '안녕하세요', output: 'こんにちは', target: 'ja-JP', stop: '정지' }
]) {
    for (const strategy of ['retranslation', 'monotonic']) {
        test(`${scenario.source} conversation uses correct recognition, translation and TTS (${strategy})`, async ({ page }) => {
            const payloads = [];
            await page.route('https://api.openai.com/**', async (route) => {
                if (route.request().method() !== 'POST') {
                    await route.fulfill({ status: 200, body: '' });
                    return;
                }
                payloads.push(route.request().postDataJSON());
                await route.fulfill({
                    contentType: 'text/event-stream',
                    body: `data: ${JSON.stringify({ choices: [{ delta: { content: scenario.output } }] })}\n\ndata: [DONE]\n\n`
                });
            });
            await page.addInitScript(({ strategy }) => {
                localStorage.setItem('translatorKoreanOpenaiKey', 'test-key');
                localStorage.setItem('translatorKoreanTranslationStrategy', strategy);
                class Recognition {
                    start() { window.testRecognition = this; this.onstart(); }
                    stop() { this.onend(); }
                    abort() {}
                }
                window.SpeechRecognition = Recognition;
                window.webkitSpeechRecognition = Recognition;
                window.testUtterances = [];
                window.SpeechSynthesisUtterance = class {
                    constructor(text) { this.text = text; }
                };
                Object.defineProperty(window, 'speechSynthesis', { value: {
                    speaking: false,
                    getVoices: () => [
                        { name: 'Korean test voice', lang: 'ko-KR', localService: true },
                        { name: 'Japanese test voice', lang: 'ja-JP', localService: true }
                    ],
                    cancel() {},
                    speak(utterance) { window.testUtterances.push({ text: utterance.text, lang: utterance.lang, voice: utterance.voice && utterance.voice.lang }); }
                } });
            }, { strategy });
            await page.goto('/');
            await expect(page.locator('#startKoreanBtn')).toHaveText('한국어');
            await page.locator(`#${scenario.button}`).click();
            expect(await page.evaluate(() => window.testRecognition.lang)).toBe(scenario.locale);
            await expect(page.locator('#stopBtnText')).toHaveText(scenario.stop);
            await page.evaluate((input) => {
                const result = [{ transcript: input, confidence: 1 }];
                result.isFinal = true;
                window.testRecognition.onresult({ results: [result], resultIndex: 0 });
            }, scenario.input);
            await expect(page.locator('#translatedText')).toHaveText(scenario.output);
            await page.locator('#stopBtn').click();
            await expect.poll(async () => page.evaluate(() => window.AppSettingsStorage.getConversationLog().length)).toBeGreaterThan(0);
            await page.locator('#translationBox').click();
            await expect.poll(async () => page.evaluate(() => window.testUtterances.filter((u) => u.text))).toContainEqual({ text: scenario.output, lang: scenario.target, voice: scenario.target });
            expect(payloads.length).toBeGreaterThan(0);
            expect(payloads[0].messages[0].content).toContain('日本語と韓国語');
            expect(payloads[0].messages[1].content).toContain(scenario.source === 'ja' ? '韓国語' : '日本語');
            expect(payloads[0].messages[1].content).not.toContain('英語');
            if (scenario.source === 'ko' && strategy === 'retranslation') {
                await page.screenshot({ path: '/Users/inaminetetsuo/BrigeTTS-Korean-local/korean-ui.png', fullPage: true });
            }
        });
    }
}

test('Korean settings and history stay separate from the English app', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
        localStorage.setItem('translatorUserDictionary', JSON.stringify([{ surface: '原本', english: 'Original' }]));
        const storage = window.AppSettingsStorage;
        const before = storage.getUserDictionary();
        storage.setUserDictionary([{ reading: 'さくらえん', surface: 'さくら苑', korean: '사쿠라엔' }]);
        storage.setConversationLog([
            { sourceLanguage: 'ko', original: '안녕하세요', translation: 'こんにちは' },
            { sourceLanguage: 'en', original: 'Hello', translation: 'こんにちは' }
        ]);
        const exported = storage.exportSettings();
        storage.setUserDictionary([]);
        const imported = storage.importSettings(exported);
        const englishImport = storage.importSettings(JSON.stringify({ app: 'BridgeTTS', type: 'settings-export', data: { userDictionary: '[]' } }));
        return { before, imported, englishImport, dictionary: storage.getUserDictionary(), history: storage.getConversationLog(), original: localStorage.getItem('translatorUserDictionary') };
    });
    expect(result.before).toEqual([]);
    expect(result.imported.ok).toBe(true);
    expect(result.englishImport.ok).toBe(false);
    expect(result.dictionary[0].korean).toBe('사쿠라엔');
    expect(result.history).toHaveLength(1);
    expect(result.history[0].sourceLanguage).toBe('ko');
    expect(result.original).toContain('Original');
});

test('Korean service worker preserves other apps caches', async () => {
    const fs = require('fs');
    const vm = require('vm');
    const path = require('path');
    const listeners = {};
    const deleted = [];
    let activation;
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8'), {
        self: { addEventListener(name, callback) { listeners[name] = callback; }, clients: { claim() {} } },
        caches: {
            keys: async () => ['bridge-tts-codex-v28', 'bridge-tts-korean-v0', 'bridge-tts-korean-v1', 'other-app'],
            delete: async (name) => { deleted.push(name); }
        }
    });
    listeners.activate({ waitUntil(promise) { activation = promise; } });
    await activation;
    expect(deleted).toEqual(['bridge-tts-korean-v0']);
});
