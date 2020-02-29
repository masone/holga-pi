// GPIO 12: green
// GND: 14

const flash = require('rpi-ws281x-native')

const numLeds = 12
const leds = new Uint32Array(numLeds)
leds.fill(0xffffff)
flash.init(numLeds)

const on = () => {
  flash.setBrightness(0xffffff)
  flash.render(leds)
}

const off = () => {
  flash.setBrightness(0x000000)
  flash.render(leds)
}

const trigger = (time = 1000) => {
  on()
  setTimeout(off, time)
}

const disable = () => {
  off()
  flash.reset()
}

process.on('exit', disable)
process.on('SIGINT', disable)

module.exports = {trigger, off}
