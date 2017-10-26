# holga-pi

- Gpio layout https://pinout.xyz
- Library for the switch https://www.npmjs.com/package/onoff
- Library for the camera https://github.com/troyth/node-raspicam
- Image upload / storage https://cloudinary.com/documentation/image_upload_api_reference
- Image api https://cloudinary.com/documentation/admin_api#browse_resources
- Image filters https://cloudinary.com/documentation/image_transformations

# How to
- Install latest node version on pi http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/#install-node 
- Enable the camera `sudo raspi-config`
- Start camera daemon on server `export CLOUDINARY_URL=cloudinary://... node index.js`
