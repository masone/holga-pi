const express = require('express')
const app = express()
const cloudinary = require('cloudinary')
const port = process.env.PORT || 5000;
const filter = 'red_rock' // audrey, ukulele, quartz

app.get('/', function (req, res) {
  cloudinary.v2.api.resources({resource_type: 'image', max_results: 1, direction: 'desc'}, (err, result) => {
    if(err) return console.log(err)
    console.log(result.resources)
    const urls = result.resources.map((resource) => generateUrl(resource))

    res.send(`<img src="${urls[0]}" style="height: 100%;"/>`)
  })
  console.log(cloudinary)
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})

const generateUrl = (resource) => {
  return `http://res.cloudinary.com/dzushlk1c/image/upload/c_crop,e_art:${filter},g_center,h_1944,w_1944/v${resource.version}/${resource.public_id}.jpg`
}
