const RaspiCam = require('raspicam')

const led = require('./led')

const start = (output) => {
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
}

module.exports = {start}
