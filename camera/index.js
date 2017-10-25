const RaspiCam = require("raspicam");
const path = require('path');

const output = path.resolve('./tmp');
const camera = new RaspiCam({mode: 'photo', output});

camera.start();
camera.on("read", (err, timestamp, filename) => {
  if(err) console.log("Error", err);
  
  console.log('stuff', timestamp, filename);
});
