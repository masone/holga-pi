// GPIO 12: green
// GND: 14

var flash = require('rpi-ws281x-native')

var numLeds = 12
flash.init(numLeds)

var leds = new Uint32Array(numLeds)
leds.fill(0xffffff)

const on = () => {
  flash.render(leds)
  flash.setBrightness(0xffffff)
}
const off = () => {
  flash.setBrightness(0x000000)
}

const trigger = (time=1000) => {
  on()
  setTimeout(off, time)
}

off()

process.on("exit", function(){
  flash.reset()
})

module.exports = {trigger}
