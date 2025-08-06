const {chromium} = require('playwright');

const USER_DATA_DIR = './google-profile';

async function showIdleScreen() {
    const context = await chromium.launchPersistentContext(USER_DATA_DIR,{
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

    const page = await context.newPage();
    await page.goto('http://localhost:8080/idle.html');
}

module.exports = {showIdleScreen};