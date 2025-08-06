const express = require('express');
const {exec} = require('child_process');
const { launchMeet } = require('./meet-launcher');

const app = express();
const port = 8080;
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use((req, res, next) => console.log(req.method, req.url, 'request received') || next())

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
        await launchMeet(meetUrl);
        res.send('✅ Meeting launched and joined on TV');
    } catch (err) {
        console.error('Error joining meeting:', err);
        res.send('❌ Failed to join meeting');
    }
});

// Reset to idle screen
app.get('/reset', (req, res) => {
    exec('killall chrome');
    exec(`chromium --kiosk "http://localhost:${port}/idle.html"`);
    res.send('✅ TV reset to idle screen');
});

app.listen(port, () => {
    console.log(`TV Meet Controller running on http://localhost:${port}`);
});