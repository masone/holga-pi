// GPIO 15: violet
// GND: white

// ready/ok: solid
// working/uploading: rapid blink
// blocking error: slow blink
// failure: slow blink 2-3 times

const Gpio = require('onoff').Gpio

const led = new Gpio(15, 'low', {activeLow: true})
let activeIntervals = []
let activeTimeouts = []

const ready = () => {
  on()
}
const failure = () => {
  error()
  setTimeout(() => {
    stopBlinking()
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

  activeIntervals.push(intOff)
  activeIntervals.push(intOn)
}
const stopBlinking = () => {
  activeIntervals.forEach(interval => clearInterval(interval))
  activeIntervals = []
  activeTimeouts.forEach(timeout => clearTimeout(timeout))
  activeTimeouts = []
}
const error = () => {
  const delay = 1400
  const intOff = setInterval(() => {
    off()
  }, delay)
  const intOn = setInterval(() => {
    const intOnOff = setTimeout(() => {
      on()
    }, delay / 2)

    activeTimeouts.push(intOnOff)
  }, delay)

  activeIntervals.push(intOn)
  activeIntervals.push(intOff)
}

const on = () => {
  led.writeSync(1)
}
const off = () => {
  led.writeSync(0)
}
const disable = () => {
  led.unexport()
}
process.on('exit', disable)
process.on('SIGINT', disable)

module.exports = {ready, error, working, stopBlinking, failure}
