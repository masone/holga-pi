const RaspiCam = require('raspicam');
const Gpio = require('onoff').Gpio;
const path = require('path');
const _ = require('lodash');

const output = path.resolve('./tmp/holgapi%d.jpg');
const camera = new RaspiCam({mode: 'photo', output});

button = new Gpio(4, 'in', 'rising', {activeLow: true});
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
  camera.start();
  camera.on('read', (err, timestamp, filename) => {
    if (err) console.log('Error', err);
    console.log('snapped', filename);
    camera.stop();
  });
};
