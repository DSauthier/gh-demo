#!/bin/bash
# reset-demo.sh - Reset demo app to golden image state on Amazon Linux

# Stop the app (customize for your process manager)
# Example for PM2:
# pm2 stop all
# Or, if using systemd:
# sudo systemctl stop myapp.service

# Remove the demo database
rm -f shop-demo.db

# Reset codebase to golden image
# (Assumes 'golden-image' branch or tag exists and is up to date)
git fetch origin
git checkout golden-image -- .

# Install dependencies
npm install

# Start the app (customize for your process manager)
# Example for PM2:
# pm2 start all
# Or, if using systemd:
# sudo systemctl start myapp.service
# Or, to run in background:
# nohup npm start &

echo "Demo environment reset to golden image."
