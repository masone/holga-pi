const cloudinary = require('cloudinary')

const led = require('./led')

const trigger = (output) => {
  console.log('uploading...')
  led.working()
  cloudinary.uploader.upload(output, function (result) {
    if (process.env.DEBUG) console.log(result)
    if (result.error) {
      led.stopBlinking()
      return led.failure()
    }
    led.stopBlinking()
    led.ready()
    console.log('uploaded')
  })
}

process.on('exit', (code) => {
  button.unexport()
})

module.exports = {trigger}
