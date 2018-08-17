# Digital holga

The `holga-pi` is a raspberry pi based digital holga. It snaps pictures and uploads them to cloudinary. 
Image transformations and art filters are available through their api. Here's a demo: https://holga-pi.herokuapp.com/

ssh pi@holgapi.local

## Resources
- Install latest node version on pi http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/#install-node
- Gpio layout (onoff uses BCM pin numbers) https://pinout.xyz
- Library for the switch https://www.npmjs.com/package/onoff
- Library for the camera https://github.com/troyth/node-raspicam
- Image upload / storage https://cloudinary.com/documentation/image_upload_api_reference
- Image api https://cloudinary.com/documentation/admin_api#browse_resources
- Image filters https://cloudinary.com/documentation/image_transformations
- Change hostname https://www.howtogeek.com/167195/how-to-change-your-raspberry-pi-or-other-linux-devices-hostname/
- Troubleshooting camera module https://elinux.org/Rpi_Camera_Module#Troubleshooting

## How to 
- Update firmware `sudo rpi-update`
- Enable the camera `sudo raspi-config`
- Start camera daemon on server `export CLOUDINARY_URL=cloudinary://... sudo -E node index.js`
- Process needs to be started with sudo because of the led driver
- Test camera `vcgencmd get_camera`
- Manual snapshots `raspistill --timelapse 1 -o tmp/img_%04d.jpg --latest tmp/img_latest.jpg --timeout 0`
- Enable cam on start `/boot/config.txt` `start_x=1 gpu_mem=128`
- Automatically start camera process `crontab -e`


## TODO
- try onoff debounce https://github.com/fivdi/onoff/blob/abb73e57dcf348899b299f0daec861cac5afad43/onoff.js#L51
