const express = require('express');
const {launchPersistentContext, waitAndClickJoinButton} = require('./persistent-browser');

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => console.log(req.method, req.url, 'request received') || next());

let browserContext = null;
let page = null;

(async () => {
    ({ context: browserContext, page } = await launchPersistentContext());
    await page.goto(`http://localhost:${port}/idle.html`);
})();

// Helper to parse URL or meet code
function parseMeetInput(input) {
    const meetCodeRegex = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/i;

    if (input.startsWith('https://meet.google.com/')) {
        return input;
    } else if (meetCodeRegex.test(input)) {
        return `https://meet.google.com/${input}`;
    } else {
        return null;
    }
}

app.post('/join', async (req, res) => {
    const userInput = req.body.url;
    const meetUrl = parseMeetInput(userInput);

    if (!meetUrl) {
        return res.send('❌ Invalid Google Meet URL or Code');
    }

    try {
        await page.goto(meetUrl);

        const joined = await waitAndClickJoinButton(page);
        if (!joined) {
            return res.send('❌ Failed to join meeting');
        }

        res.send('✅ Meeting launched and joined on TV');
    } catch (err) {
        console.error('Error joining meeting:', err);
        res.send('❌ Failed to join meeting');
    }
});

app.get('/reset', async (req, res) => {
    try {
        const leaveBtn = await page.locator('[aria-label="Leave call"]').first();
        if (await leaveBtn.isVisible()) {
            await leaveBtn.click();
            console.log('✅ Clicked "Leave call"');
            await page.waitForTimeout(500);
        } else {
            console.warn('⚠️ Leave button not found');
        }
        await page.goto(`http://localhost:${port}/idle.html`);
        res.send('✅ TV reset to idle screen');
    } catch (err) {
        console.warn('⚠️ Failed to leave call or go to idle:', err);
        res.send('❌ Failed to reset');
    }
});

app.listen(port, () => {
    console.log(`TV Meet Controller running on http://localhost:${port}`);
});