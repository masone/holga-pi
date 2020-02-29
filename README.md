# Digital Holga

The `holga-pi` is a raspberry pi based digital holga. It snaps pictures and uploads them via wifi. Also includes a simple webapp to display images in realtime.

![](holga-pi.jpg?raw=true)

## Hardware

### Parts
- [Raspberry Pi Camera Board v2](https://www.adafruit.com/product/3099)
- [Raspberry Pi Zero](https://www.adafruit.com/product/3400)
- [Raspberry Pi Zero v1.3 Camera Cable](https://www.adafruit.com/product/3157)
- [Pisugar battery pack](https://hackaday.io/project/164733-pisugar-battery-for-raspberry-pi-zero)
- MicroSDHC card, some cables, a LED
- [Flash-Bang SW602](https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20200229014252&SearchText=Flash-Bang+SW602)

### Wiring

I connected the pi to the original camera shutter, which works fine. My LED is placed in the viewfinder. The flash is mounted in the original position and wired up to the light sensitivity switch above the lens. The flash is powered by a separate battery to not drain the one of the pi.

- Camera shutter
  - Pin 7 - GPIO https://pinout.xyz/pinout/pin7_gpio4#
  - Pin 1 - 3.3v https://pinout.xyz/pinout/pin1_3v3_power#
  - Ground https://pinout.xyz/pinout/ground#
- Status LED
  - Pin 17 - 3.3v https://pinout.xyz/pinout/pin17_3v3_power#
  - Pin 10 - https://pinout.xyz/pinout/pin10_gpio15#
- Flash
  - Pin 12 - PWM https://pinout.xyz/pinout/pin12_gpio18#
  - 5v / Ground

For inspiration, check the `images` folder.

## Setup

### Raspberry Pi
- Install Raspbian (stretch)
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
CLOUDINARY_URL=cloudinary://... sudo -E node index.js
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

### Webapp
The camera uploads images to cloudinary, which can be displayed on the web.

```
git clone https://github.com/masone/holga-pi.git
cd ~/holga-pi/ui
npm install
node index.js
```

For available image filters, see https://cloudinary.com/documentation/image_transformations

## LED Behavior
- Solid: Ready
- Fast blink: Processing or uploading a snapshoat
- Slow blink: Snapping or uploading failed

## Notes to self
- Library for the switch https://www.npmjs.com/package/onoff
- Library for the camera https://github.com/troyth/node-raspicam
- Image upload / storage https://cloudinary.com/documentation/image_upload_api_reference
- Image api https://cloudinary.com/documentation/admin_api#browse_resources
- Update firmware `sudo rpi-update`
- Update raspbian: `sudo apt-get update` `sudo apt-get dist-upgrade`
- Test camera with `vcgencmd get_camera`
- Troubleshooting camera module https://elinux.org/Rpi_Camera_Module#Troubleshooting
- Save power https://monkeyinmysoup.gitbooks.io/raspberry-pi/content/5.1-power-consumption.html, underclock `sudo vim /boot/config.txt`: `arm_freq`, disable HDMI `/usr/bin/tvservice -o`
- `sudo -E node ...` is required to pass on the environment variables to the sudo command (`CLOUDINARY_URL`)
- Check status `systemctl status holga-pi`
