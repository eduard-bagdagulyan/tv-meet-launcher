# TV Google Meet Launcher

A lightweight solution for turning a smart display (e.g. TV connected to a mini PC or Raspberry Pi) into a dedicated Google Meet screen. Easily send a Meet link or code via mobile and launch the meeting automatically in full-screen kiosk mode.

## ✨ Features

- Launch Google Meet links remotely via QR code
- Accept both full URLs and short meeting codes
- Automatically joins or requests to join
- Full-screen kiosk mode with microphone & camera access
- Graceful disconnection with one click
- Persistent browser session (auto login)
- Works on Ubuntu 24.04 LTS

## 🖥️ Setup Instructions

### 1. Clone the Repository

### 2. Install Dependencies
`sudo apt update`\
`sudo apt install -y nodejs npm git curl`\
`npm run setup`

### 3. Make The Launcher Executable
`chmod +x tv-meet.sh`

## 🚀 Running the App
`./tv-meet.sh`