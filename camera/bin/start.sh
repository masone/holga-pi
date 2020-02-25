#!/usr/bin/env bash
iwgetid -r

if [ $? -eq 0 ]; then
  printf 'Connected to existing WiFi\n'
else
  printf 'Starting WiFi Connect\n'
  wifi-connect --portal-ssid=HolgaPi
fi

cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
sudo -E node ../index.js
