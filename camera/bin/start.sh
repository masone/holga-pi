#!/usr/bin/env bash
iwgetid -r

if [ $? -eq 0 ]; then
  printf 'Connected to existing WiFi\n'
else
  printf 'Starting WiFi Connect\n'
  wifi-connect --portal-ssid=HolgaPi
fi

printf 'Starting camera\n'
node /home/pi/holga-pi/camera/index.js > /home/pi/holga-pi.log
