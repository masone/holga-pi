const Gpio = require('onoff').Gpio
const _ = require('lodash')

// ready/ok: solid
// ok (trigger): off short once
// working (uploading): rapid blink
// blocking error: slow blink
// upload failed: off long twice
const led = new Gpio(15, 'out')

const ready = () => {
  console.log('led ready')
  on()
}
const failure = () => {
  console.log('led failure')
  // const intervals = error()
  // setTimeout(() => {
  //   intervals.forEach(interval => clearInterval(interval))
  // }, 1200)
}
const working = () => {
  console.log('led working')
  // return setInterval(() => {
  //   off()
  //   setInterval(() => {
  //     on()
  //   }, 100)
  // }, 100)
}
const stopWorking = (working) => {
  console.log('led stop working')
  // clearInterval(working)
}
const error = () => {
  console.log('led error')
  // const delay = 1600
  // const intOff = setInterval(() => {
  //   off()
  // }, delay)
  // const intOn = setInterval(() => {
  //   setTimeout(() => {
  //     on()
  //   }, delay/2)
  // }, delay)
  //
  // return [intOff, intOn]
}

const on = () => {
  console.log('led on')
  led.writeSync(1)
}
const off = () => {
  console.log('led off')
  led.writeSync(0)
}

module.exports = {ready, error, working, stopWorking, failure}
