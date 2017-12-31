const RaspiCam = require('raspicam')
const Gpio = require('onoff').Gpio
const path = require('path')
const cloudinary = require('cloudinary')
const _ = require('lodash')

const output = path.resolve('./tmp/holga.jpg');

const camera = new RaspiCam({
  rotation: 270, contrast: 0, saturation: 0,
  nopreview: true, vstab: false, timeout: 0,
  mode: 'timelapse', output, timelapse: 0.5,
  // width: 1296, height: 972, quality: 80, encoding: 'jpg'
});

camera.on('start', () => {
console.log('cam start')
	led.ready()
})
camera.on('read', (err, timestamp, filename) => {
  if (err) {
    led.error()
    return console.log('Error', err);
  }
  console.log('snapped', timestamp, filename);
});

camera.on('stop', () => {
  console.log('camera stopped')
});

camera.on('exit', () => {
	led.error()
  console.log('camera exited')
});


camera.start();

const button = new Gpio(4, 'in', 'rising', {activeLow: true});
const trigger = _.debounce(() => {
  console.log('triggering...')
  led.ready()
  upload();
}, 1500, {leading: true, trailing: false});

console.log('listening...')
button.watch(function (err, value) {
  if (err) {
    led.error() // todo: blocking error
    return console.log(err);
  }
  trigger();
});

const upload = () => {
  console.log('uploading...');
  const working = led.working()
  cloudinary.uploader.upload(output, function (result) {
    console.log(result);
    if (result.error) {
      led.stopWorking(working)
      return led.failure()
    }
    led.stopWorking(working)
    led.ready()
    console.log('uploaded');
  });
};

