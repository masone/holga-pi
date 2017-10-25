const RaspiCam = require('raspicam');
const Gpio = require('onoff').Gpio;
const path = require('path');
const cloudinary = require('cloudinary');
const _ = require('lodash');

const output = path.resolve(`./tmp/holga.jpg`);
const camera = new RaspiCam({
  rotation: 270, contrast: 30, saturation: 30,
  mode: 'photo', width: 2592, height: 1944, quality: 100, encoding: 'jpg', output
});

const button = new Gpio(4, 'in', 'rising', {activeLow: true});
const trigger = _.debounce(() => {
  snap();
}, 1000);

console.log('listening...');
button.watch(function (err, value) {
  if (err) return console.log('Error watching button', err);
  trigger();
});

const snap = () => {
  console.log('snapping...');
  const timestamp = Math.floor(new Date() / 1000);
  const output = path.resolve(`./tmp/holga-${timestamp}.jpg`);
  camera.set('output', output);
  camera.start();
  camera.on('read', (err) => {
    if (err) return console.log('Error reading from camera', err);
    console.log('snapped', output);
    camera.stop();
    upload(output);
  });
};

const upload = (file) => {
  console.log('uploading...');
  cloudinary.uploader.upload(file, function (result) {
    console.log(result);
    console.log('uploaded', file);
  });
};
