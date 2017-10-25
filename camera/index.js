const RaspiCam = require('raspicam');
const Gpio = require('onoff').Gpio;
const path = require('path');
const cloudinary = require('cloudinary');
const _ = require('lodash');

const output = path.resolve('./tmp/holga.jpg');
const camera = new RaspiCam({
  rotation: 270, contrast: 0, saturation: 0,
  nopreview: true, vstab: false,
	timeout: 0, //framerate: 1,
  mode: 'timelapse', output,
	timelapse: 1
	//pi@raspberrypi:~/holga-pi/camera $ raspistill --timelapse 1 -o tmp/img_%04d.jpg --latest tmp/img_latest.jpg --timeout 0
	////width: 1296, height: 972, quality: 80, encoding: 'jpg', output
});

  camera.on('read', (err, timestamp, filename) => {
	      if (err) return console.log('Error', err);
	      console.log('snapped', timestamp, filename);
  });

  camera.on('stop', () => {
    console.log('stooop')	    
  });

  camera.on('exit', () => {
	      console.log('exiit')
	    });


//setInterval(() => { 
	camera.start();
//}, 1000)

const button = new Gpio(4, 'in', 'rising', {activeLow: true});
const trigger = _.debounce(() => {
  console.log('triggering...')
  upload();
}, 1500, {leading: true, trailing: false});

console.log('listening...');
button.watch(function (err, value) {
  if (err) return console.log(err);
  trigger();
});

const upload = () => {
  console.log('uploading...');
  cloudinary.uploader.upload(output, function (result) {
    console.log(result);
    console.log('uploaded');
  });
};
