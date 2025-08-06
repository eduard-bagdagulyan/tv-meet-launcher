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
    // await page.waitForTimeout(8000);

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
        const joinNowBtn = await page.locator('text="Join now"').first();
        if (await joinNowBtn.isVisible()) {
            await joinNowBtn.click();
            console.log('✅ Joined via "Join now"');
        } else {
            const askToJoinBtn = await page.locator('text="Ask to join"').first();
            if (await askToJoinBtn.isVisible()) {
                await askToJoinBtn.click();
                console.log('✅ Clicked "Ask to join"');
            } else {
                console.warn('⚠️ No Join button found');
            }
        }
    } catch (err) {
        console.warn('⚠️ Could not click Join button:', err);
    }

    return { browser, page };
}

module.exports = {launchMeet};