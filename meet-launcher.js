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
            '--disable-extensions',
            '--disable-infobars',
            '--disable-notifications',
        ],
        viewport: null
    });

    const page = await browser.newPage();
    await page.goto(url);

    const joined = await waitAndClickJoinButton(page);
    if (!joined) {
        console.error('❌ Could not join the meeting — no join button appeared');
    }

    return { browser, page };
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

        await page.waitForTimeout(500); // check again in 0.5s
    }

    console.warn('⚠️ Timed out waiting for Join button');
    return false;
}

module.exports = {launchMeet};