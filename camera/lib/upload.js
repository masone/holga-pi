const path = require('path')
const Gpio = require('onoff').Gpio
const cloudinary = require('cloudinary')
const _ = require('lodash')

const led = require('./led')

const output = path.resolve('./tmp/holga.jpg');

const button = new Gpio(4, 'in', 'rising', {activeLow: true});
const trigger = _.debounce(() => {
  console.log('triggering...')
  upload();
}, 1500, {leading: true, trailing: false});

console.log('listening...')
button.watch(function (err, value) {
  if (err) {
    led.error()
    return console.log(err);
  }
  trigger();
});

const upload = () => {
  console.log('uploading...');
  const working = led.working()
  cloudinary.uploader.upload(output, function (result) {
    //console.log(result)
    if (result.error) {
      led.stopWorking(working)
      return led.failure()
    }
    led.stopWorking(working)
    led.ready()
    console.log('uploaded');
  });
};

process.on('exit', (code) => {
  button.unexport()
})
