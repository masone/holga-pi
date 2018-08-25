# Digital holga

The `holga-pi` is a raspberry pi based digital holga. It snaps pictures and uploads them to cloudinary. 
Image transformations and art filters are available through their api. Here's a demo: https://holga-pi.herokuapp.com/

## Setup
- Enable ssh https://www.raspberrypi.org/documentation/remote-access/ssh/
- Upload public key `ssh-copy-id pi@raspberrypi.local`
- Login `ssh pi@raspberrypi.local`
- Change default password https://www.raspberrypi.org/documentation/linux/usage/users.md
- Enable the camera in `sudo raspi-config` under Interfacing Options
- Configure `/boot/config.txt`: `start_x=1 gpu_mem=128`
- Install latest node version on pi http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/#install-node
- Change hostname (optional https://www.howtogeek.com/167195/how-to-change-your-raspberry-pi-or-other-linux-devices-hostname/
- Install https://github.com/resin-io/resin-wifi-connect
- Run wifi-connect on startup `crontab -e`: `@reboot sudo wifi-connect > ~/wifi.log`

- `git clone https://github.com/masone/holga-pi.git`
- Start holgapi daemon `@reboot export CLOUDINARY_URL=cloudinary://... sudo -E node index.js` (needs to be started with sudo because of the led driver)
- `sudo npm install --unsafe-perm epoll`
- `cd ~/holga-pi/camera && npm install`


## Dependencies
- Library for the switch https://www.npmjs.com/package/onoff
- Library for the camera https://github.com/troyth/node-raspicam
- Image upload / storage https://cloudinary.com/documentation/image_upload_api_reference
- Image api https://cloudinary.com/documentation/admin_api#browse_resources
- Image filters https://cloudinary.com/documentation/image_transformations

# Knowledge
- Update firmware `sudo rpi-update`
- Update raspbian: `sudo apt-get update` `sudo apt-get dist-upgrade`
- Gpio layout (onoff uses BCM pin numbers) https://pinout.xyz
- Test camera with `vcgencmd get_camera`
- Troubleshooting camera module https://elinux.org/Rpi_Camera_Module#Troubleshooting
- Safe power https://monkeyinmysoup.gitbooks.io/raspberry-pi/content/5.1-power-consumption.html, underclock `sudo vim /boot/config.txt`: `arm_freq`


