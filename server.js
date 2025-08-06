const express = require('express');
const {exec} = require('child_process');
const { launchMeet } = require('./meet-launcher');

const app = express();
const port = 8080;
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use((req, res, next) => console.log(req.method, req.url, 'request received') || next())

let activeContext = null;  // browser context reference
let activePage = null;     // page reference

// Start a Google Meet session
app.post('/join', async (req, res) => {
    const meetUrl = req.body.url;
    if (!meetUrl || !meetUrl.startsWith('https://meet.google.com/')) {
        return res.send('❌ Invalid Google Meet URL');
    }

    // Kill previous meeting browser if needed
    exec('killall chrome');

    // Launch the new meeting using Playwright
    try {
        const result = await launchMeet(meetUrl);
        activeContext = result.browser;
        activePage = result.page;
        res.send('✅ Meeting launched and joined on TV');
    } catch (err) {
        console.error('Error joining meeting:', err);
        res.send('❌ Failed to join meeting');
    }
});

// Reset to idle screen
app.get('/reset', async (req, res) => {
    try {
        if (activePage) {
            const leaveBtn = await activePage.locator('[aria-label="Leave call"]').first();
            if (await leaveBtn.isVisible()) {
                await leaveBtn.click();
                console.log('✅ Clicked "Leave call"');
                await activePage.waitForTimeout(2000);
            } else {
                console.warn('⚠️ Leave button not found');
            }
        }

        if (activeContext) {
            await activeContext.close();
            console.log('🧼 Browser context closed');
        }
    } catch (err) {
        console.warn('⚠️ Failed to leave call or close browser:', err);
    }

    // Clear references
    activePage = null;
    activeContext = null;

    exec('killall chrome');
    exec(`chromium --kiosk "http://localhost:${port}/idle.html"`);
    res.send('✅ TV reset to idle screen');
});

app.listen(port, () => {
    console.log(`TV Meet Controller running on http://localhost:${port}`);
});