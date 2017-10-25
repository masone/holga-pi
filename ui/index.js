const express = require('express')
const app = express()
const cloudinary = require('cloudinary')

app.get('/', function (req, res) {
  cloudinary.v2.api.resources({resource_type: 'image', max_results: 36}, (err, result) => {
    if(err) return console.log(err)
    console.log(result.resources)
    const urls = result.resources.map((resource) => generateUrl(resource))

    res.send(`<img src="${urls[0]}" style="height: 100%;"/>`)
  })
  console.log(cloudinary)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

const generateUrl = (resource) => {
  return `http://res.cloudinary.com/dzushlk1c/image/upload/c_crop,e_art:audrey,g_center,h_1944,w_1944/v${resource.version}/${resource.public_id}.jpg`
}
