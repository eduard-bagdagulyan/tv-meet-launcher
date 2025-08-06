const { chromium } = require('playwright');

const USER_DATA_DIR = './google-profile';

async function launchPersistentContext() {
    const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
        headless: false,
        args: [
            '--start-maximized',
            '--kiosk',
            '--use-fake-ui-for-media-stream',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-infobars',
            '--disable-notifications',
        ],
        viewport: null,
        ignoreDefaultArgs: ['--enable-automation']
    });

    const page = await context.newPage();
    return { context, page };
}

async function waitAndClickJoinButton(page, timeoutMs = 30000) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        const joinNowBtn = page.locator('text="Join now"').first();
        if (await joinNowBtn.isVisible()) {
            await joinNowBtn.click();
            console.log('✅ Joined the meeting via "Join now"');
            return true;
        }

        const askToJoinBtn = page.locator('text="Ask to join"').first();
        if (await askToJoinBtn.isVisible()) {
            await askToJoinBtn.click();
            console.log('✅ Clicked "Ask to join" — waiting for host approval');
            return true;
        }

        await page.waitForTimeout(100);
    }

    console.warn('⚠️ Timed out waiting for Join button');
    return false;
}

module.exports = { launchPersistentContext, waitAndClickJoinButton };