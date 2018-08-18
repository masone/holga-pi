// GPIO 15: violet
// GND: white

const Gpio = require('onoff').Gpio
const _ = require('lodash')

// ready/ok: solid
// working/uploading: rapid blink
// blocking error: slow blink
// failure: slow blink 2-3 times
const led = new Gpio(15, 'low', {activeLow: true})

const ready = () => {
  on()
}
const failure = () => {
  const intervals = error()
  setTimeout(() => {
    intervals.forEach(interval => clearInterval(interval))
  }, 5000)
}
const working = () => {
  const delay = 100
  const intOff = setInterval(() => {
    off()
  }, delay)
  const intOn = setInterval(() => {
    setTimeout(() => {
      on()
    }, delay / 2)
  }, delay)
  return [intOff, intOn]
}
const stopWorking = (intervals) => {
  intervals.forEach(interval => clearInterval(interval))
}
const error = () => {
  const delay = 1400
  const intOff = setInterval(() => {
    off()
  }, delay)
  const intOn = setInterval(() => {
    setTimeout(() => {
      on()
    }, delay / 2)
  }, delay)
  return [intOff, intOn]
}

const on = () => {
  led.writeSync(1)
}
const off = () => {
  led.writeSync(0)
}

process.on('exit', (code) => {
  led.unexport()
})

module.exports = {ready, error, working, stopWorking, failure}
