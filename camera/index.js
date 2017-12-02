const RaspiCam = require('raspicam')
const Gpio = require('onoff').Gpio
const path = require('path')
const cloudinary = require('cloudinary')
const _ = require('lodash')

//raspistill --timelapse 1 -o tmp/img_%04d.jpg --latest tmp/img_latest.jpg --timeout 0

const output = path.resolve('./tmp/holga.jpg');
const camera = new RaspiCam({
  rotation: 270, contrast: 0, saturation: 0,
  nopreview: true, vstab: false, timeout: 0,
  mode: 'timelapse', output, timelapse: 0.5,
  // width: 1296, height: 972, quality: 80, encoding: 'jpg'
});

  camera.on('read', (err, timestamp, filename) => {
	      if (err) return console.log('Error', err);
	      console.log('snapped', timestamp, filename);
  });

  camera.on('stop', () => {
    console.log('camera stopped')
  });

  camera.on('exit', () => {
	      console.log('camera exited')
	    });


camera.start();

const button = new Gpio(4, 'in', 'rising', {activeLow: true});
const trigger = _.debounce(() => {
  // solid green
  console.log('triggering...')
  ledSuccess()
  upload();
}, 1500, {leading: true, trailing: false});

const led = new Gpio(15, 'out')
ledOk()

console.log('listening...')
button.watch(function (err, value) {
  if (err) {
    ledBlockingError()
    return console.log(err);
  }
  trigger();
});

const upload = () => {
  console.log('uploading...');
  ledWorking()
  cloudinary.uploader.upload(output, function (result) {
    console.log(result);
    if(result.error){
      return ledFailure()
    }
    ledSuccess()
    console.log('uploaded');
  });
};

// ready/ok: solid
// ok (trigger): off short once
// working (uploading): rapid blink
// blocking error: slow blink
// upload failed: off long twice
const ledReady = () => {
  led.writeSync(1)
}
const ledSuccess = () => {

}
const ledFailure = () => {

}
const ledWorking = () => {

}

const ledBlockingError = () => {
  // led.writeSync(1)
}
