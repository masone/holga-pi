// GPIO 4: yellow
// 3.3v: brown
// GND: black
const Gpio = require('onoff').Gpio
const _ = require('lodash')

const led = require('./lib/led')
const flash = require('./lib/flash')
const camera = require('./lib/camera')

const button = new Gpio(4, 'in', 'rising', {activeLow: true})
const trigger = _.debounce(() => {
  console.log('triggering...')
  flash.trigger()
  camera.trigger()
}, 1500, {leading: true, trailing: false})

button.watch(function (err, value) {
  if (err) {
    led.error()
    return console.log(err)
  }
  trigger()
})

flash.off()
led.ready()
console.log('initialized...')
