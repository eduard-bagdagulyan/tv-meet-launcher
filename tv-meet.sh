#!/bin/bash

#waiting for WiFi to connect
sleep 10s

# CONFIGURATION
APP_DIR="/home/psycho/tv-meet-launcher"             # Replace with your actual project path
QR_FILE="$APP_DIR/public/qr.png"
PORT=8080

# 1. Get local IP (for QR code)
IP=$(hostname -I | awk '{print $1}')
CONTROL_URL="https://$IP:$PORT"

# 2. Generate QR code
echo "🔧 Generating QR code for $CONTROL_URL"
qrencode -o "$QR_FILE" -s 10 "$CONTROL_URL"

# 3. Start the Node.js server
echo "🚀 Starting Node.js server..."
cd "$APP_DIR"
node server.js