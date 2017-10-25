const express = require('express')
const app = express()
const cloudinary = require('cloudinary')

app.get('/', function (req, res) {
  cloudinary.v2.api.resource({type: 'upload', max_results: 36}, (err, result) => {
    if(err) return console.log(err)
    console.log(result)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
