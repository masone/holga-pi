const RaspiCam = require('raspicam');
const Gpio = require('onoff').Gpio;
const path = require('path');
const _ = require('lodash');

const output = path.resolve(`./tmp/holga.jpg`);
const camera = new RaspiCam({
	rotation: 270, contrast: 30, saturation: 30,
	mode: 'photo', width: 2592, height: 1944, quality: 100, encoding: 'jpg', output});

const button = new Gpio(4, 'in', 'rising', {activeLow: true});
const trigger = _.debounce(() => {
  console.log('throttled')
  snap();
}, 1000);

console.log('listening...');
button.watch(function (err, value) {
  if (err) console.log(err);
  trigger();
});

const snap = () => {
  const timestamp = Math.floor(new Date() / 1000);	
  const output = path.resolve(`./tmp/holga-${timestamp}.jpg`);
  camera.set('output', output);
  camera.start();
  camera.on('read', (err, timestamp, filename) => {
    if (err) console.log('Error', err);
    console.log('snapped', filename);
    camera.stop();
  });
};
