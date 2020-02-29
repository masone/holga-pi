# Digital Holga

The `holga-pi` is a raspberry pi based digital holga. It snaps pictures and uploads them to cloudinary.

Image transformations and art filters are available through their api. Here's a demo: https://holga-pi.herokuapp.com/

## Setup

### Raspberry Pi
I run on a Raspberry pi zero with a [Pisugar battery pack](https://hackaday.io/project/164733-pisugar-battery-for-raspberry-pi-zero).

- Install node on pi zero with https://github.com/sdesalas/node-pi-zero
- Enable ssh https://www.raspberrypi.org/documentation/remote-access/ssh/
- Upload public key `ssh-copy-id pi@raspberrypi.local`
- Login `ssh pi@raspberrypi.local`
- Change default password https://www.raspberrypi.org/documentation/linux/usage/users.md
- Enable the camera in `sudo raspi-config` under Interfacing Options
- Configure `/boot/config.txt`: `start_x=1 gpu_mem=128`
- Change hostname (optional https://www.howtogeek.com/167195/how-to-change-your-raspberry-pi-or-other-linux-devices-hostname/

### Camera script
```
git clone https://github.com/masone/holga-pi.git
cd ~/holga-pi/camera
sudo npm install --unsafe-perm epoll
```

To start the process manually:
```
CLOUDINARY_URL=cloudinary://... sudo node index.js
```

Logs can be found in `tail -f ~/holga-pi.log`

The gpio library requires you to run the process with `sudo` rights.

### Start on reboot
Install https://github.com/resin-io/resin-wifi-connect to create a hotspot creation when network is unavailable. Once the pi has wifi, it will start the camera.

Firstly, configure your `CLOUDINARY_URL` in `holga-pi.service`, then:
```
sudo cp ~/holga-pi/camera/holga-pi.service /etc/systemd/system/holga-pi.service
sudo systemctl enable /etc/systemd/system/holga-pi.service
```

The gpio library and wifi-connect require you to run the process with `root`.

## Notes to self
- Library for the switch https://www.npmjs.com/package/onoff
- Library for the camera https://github.com/troyth/node-raspicam
- Image upload / storage https://cloudinary.com/documentation/image_upload_api_reference
- Image api https://cloudinary.com/documentation/admin_api#browse_resources
- Image filters https://cloudinary.com/documentation/image_transformations
- Update firmware `sudo rpi-update`
- Update raspbian: `sudo apt-get update` `sudo apt-get dist-upgrade`
- Gpio layout (onoff uses BCM pin numbers) https://pinout.xyz
- Test camera with `vcgencmd get_camera`
- Troubleshooting camera module https://elinux.org/Rpi_Camera_Module#Troubleshooting
- Save power https://monkeyinmysoup.gitbooks.io/raspberry-pi/content/5.1-power-consumption.html, underclock `sudo vim /boot/config.txt`: `arm_freq`, disable HDMI `/usr/bin/tvservice -o`
- `sudo -E node ...` is required to pass on the environment variables to the sudo command (`CLOUDINARY_URL`)
- Check status `systemctl status holga-pi`
