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
        const joinBtn = await page.locator('text="Join now"').first();
        await joinBtn.click();
        console.log('✅ Joined the meeting!');
    } catch (err) {
        console.error('❌ Failed to click Join now:', err);
    }
}

module.exports = {launchMeet};