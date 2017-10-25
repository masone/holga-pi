const RaspiCam = require('raspicam');
const Gpio = require('onoff').Gpio;
const path = require('path');

const output = path.resolve('./tmp/holgapi%d.jpg');
const camera = new RaspiCam({mode: 'photo', output});
const pin = 7;


button = new Gpio(7, 'in');

button.watch(function(err, value) {
  if(err) throw err;
  console.log('read value', value)
});

// gpio.open(pin, 'input pulldown', function(err) {
//   if(err) throw err;
//   console.log('gpio ready');
//
//   setInterval(() => {
//     gpio.read(pin, function(err, value) {
//       if(err) console.log("gpio error", err);
//       console.log('read value', value)
//     });
//   }, 0);
// });


// camera.start();
// camera.on("read", (err, timestamp, filename) => {
//   if(err) console.log("Error", err);
//
//   console.log('stuff', timestamp, filename);
// });
//
// RaspiCam.stop();
//
