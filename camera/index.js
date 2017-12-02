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
  const working = ledWorking()
  cloudinary.uploader.upload(output, function (result) {
    console.log(result);
    if(result.error){
      ledStopWorking(working)
      return ledFailure()
    }
    ledStopWorking(working)
    ledReady()
    console.log('uploaded');
  });
};

// ready/ok: solid
// ok (trigger): off short once
// working (uploading): rapid blink
// blocking error: slow blink
// upload failed: off long twice
const ledReady = () => {
  ledOn()
}
const ledFailure = () => {
  const intervals = ledError()
  setTimeout(() => {
    intervals.forEach(interval => clearInterval(interval))
  }, 1200)
}
const ledWorking = () => {
  return setInterval(() => {
    ledOff()
    setInterval(() => {
      ledOn()
    }, 100)
  }, 100)
}
const ledStopWorking = (working) => {
  clearInterval(working)
}
const ledError = () => {
  let intOff, intOn
  intOff = setInterval(() => {
    ledOff()
    intOn = setInterval(() => {
      ledOn()
    }, 500)
  }, 500)
  return [intOff, intOn]
}

const ledOn = () => {
  console.log('led on')
  led.writeSync(1)
}
const ledOff = () => {
  console.log('led off')
  led.writeSync(0)
}
