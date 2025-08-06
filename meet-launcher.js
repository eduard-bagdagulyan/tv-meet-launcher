const {chromium} = require('playwright');

const USER_DATA_DIR = './google-profile';

async function launchMeet(url) {
    const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
        headless: false,
        args: [
            '--start-maximized',
            '--kiosk',
            '--use-fake-ui-for-media-stream',
            '--no-sandbox',
            '--disable-dev-shm-usage',
        ]
    });

    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the page to fully render
    await page.waitForTimeout(8000);

    try {
        const joinNowBtn = await page.locator('text="Join now"').first();
        if (await joinNowBtn.isVisible()) {
            await joinNowBtn.click();
            console.log('✅ Joined the meeting via "Join now"');
            return;
        }
    } catch (_) {
    }

    try {
        const askToJoinBtn = await page.locator('text="Ask to join"').first();
        if (await askToJoinBtn.isVisible()) {
            await askToJoinBtn.click();
            console.log('✅ Clicked "Ask to join" – waiting for approval');
            return;
        }
    } catch (_) {
    }

    console.error('❌ Neither "Join now" nor "Ask to join" was found.');
}

module.exports = {launchMeet};