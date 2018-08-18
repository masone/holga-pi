const path = require('path')
const RaspiCam = require('raspicam')

const led = require('./led')
const upload = require('./upload')
const output = path.resolve('./tmp/holga.jpg');

const camera = new RaspiCam({
  rotation: 270, contrast: 0, saturation: 0,
  nopreview: true,
  vstab: false, // video stabilization
  timeout: 1,
  mode: 'photo',
  output // width: 1296, height: 972, quality: 80, encoding: 'jpg'
});

camera.on('read', (err, timestamp, filename) => {
  if (err) {
    led.error()
    return console.log('Error', err);
  }
  console.log('snapped', timestamp, filename);
  upload.trigger(output)
});

camera.on('stop', () => {
  console.log('camera stopped')
});

camera.on('exit', () => {
  led.error()
  console.log('camera exited')
});

const trigger = () => {
  camera.start()
}

module.exports = {trigger}
