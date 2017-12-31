const RaspiCam = require('raspicam')
const Gpio = require('onoff').Gpio
const path = require('path')
const cloudinary = require('cloudinary')
const _ = require('lodash')

// ready/ok: solid
// ok (trigger): off short once
// working (uploading): rapid blink
// blocking error: slow blink
// upload failed: off long twice
const led = new Gpio(15, 'out')

const ledReady = () => {
  console.log('led ready')
	ledOn()
}
const ledFailure = () => {
	console.log('led failure')
  const intervals = ledError()
  setTimeout(() => {
    intervals.forEach(interval => clearInterval(interval))
  }, 1200)
}
const ledWorking = () => {
	console.log('led workoing')
  return setInterval(() => {
    ledOff()
    setInterval(() => {
      ledOn()
    }, 100)
  }, 100)
}
const ledStopWorking = (working) => {
	console.log('led stop working')
  clearInterval(working)
}
const ledError = () => {
	console.log('led error')
  const delay = 1600
  const intOff = setInterval(() => {
    ledOff()
  }, delay)
  const intOn = setInterval(() => {
    setTimeout(() => {
      ledOn()
    }, delay/2)
  }, delay)

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

const output = path.resolve('./tmp/holga.jpg');

//raspistill --timelapse 1 -o tmp/img_%04d.jpg --latest tmp/img_latest.jpg --timeout 0
const camera = new RaspiCam({
  rotation: 270, contrast: 0, saturation: 0,
  nopreview: true, vstab: false, timeout: 0,
  mode: 'timelapse', output, timelapse: 0.5,
  // width: 1296, height: 972, quality: 80, encoding: 'jpg'
});

camera.on('start', () => {
console.log('cam start')
	ledReady()
})
camera.on('read', (err, timestamp, filename) => {
  if (err) {
    ledError()
    return console.log('Error', err);
  }
  console.log('snapped', timestamp, filename);
});

camera.on('stop', () => {
  console.log('camera stopped')
});

camera.on('exit', () => {
	ledError()
  console.log('camera exited')
});


camera.start();

const button = new Gpio(4, 'in', 'rising', {activeLow: true});
const trigger = _.debounce(() => {
  console.log('triggering...')
  ledReady()
  upload();
}, 1500, {leading: true, trailing: false});

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
    if (result.error) {
      ledStopWorking(working)
      return ledFailure()
    }
    ledStopWorking(working)
    ledReady()
    console.log('uploaded');
  });
};

