const cloudinary = require('cloudinary')

const led = require('./led')

const trigger = (output) => {
  console.log('uploading...')
  const working = led.working()
  cloudinary.uploader.upload(output, function (result) {
    if (process.env.DEBUG) console.log(result)
    if (result.error) {
      led.stopWorking(working)
      return led.failure()
    }
    led.stopWorking(working)
    led.ready()
    console.log('uploaded')
  })
}

process.on('exit', (code) => {
  button.unexport()
})

module.exports = {trigger}
