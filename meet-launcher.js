const {chromium} = require('playwright');

async function launchMeet(url) {
    const browser = await chromium.launch({
        headless: false,
        args: [
            '--kiosk',
            '--use-fake-ui-for-media-stream',
            '--no-sandbox',
            '--disable-dev-shm-usage',
        ]
    });

    const context = await browser.newContext({
        permissions: ['microphone', 'camera'],
    });

    const page = await context.newPage();
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