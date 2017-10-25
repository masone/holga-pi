const RaspiCam = require('raspicam');
const Gpio = require('onoff').Gpio;
const path = require('path');
const cloudinary = require('cloudinary');
const _ = require('lodash');

const output = path.resolve(`./tmp/holga.jpg`);

const button = new Gpio(4, 'in', 'rising', {activeLow: true});
const trigger = _.debounce(() => {
  console.log('triggering...')
  snap();
}, 1500, {leading: true, trailing: false});

console.log('listening...');
button.watch(function (err, value) {
  if (err) return console.log(err);
  trigger();
});

const snap = () => {
  const timestamp = Math.floor(new Date() / 1000);
  const output = path.resolve(`./tmp/holga-${timestamp}.jpg`);
  const camera = new RaspiCam({
	  rotation: 270, contrast: 0, saturation: 0,
	  nopreview: true, vstab: false,  
	  mode: 'photo', width: 1296, height: 972, quality: 80, encoding: 'jpg', output
  });
  console.log('snapping...');
  camera.on('read', (err) => {
    if (err) return console.log('Error', err);
    console.log('snapped', output);
    upload(output);
  });
  camera.start();
};

const upload = (file) => {
  console.log('uploading...');
  cloudinary.uploader.upload(file, function (result) {
    console.log(result);
    console.log('uploaded', file);
  });
};
