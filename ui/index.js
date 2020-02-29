const express = require('express')
const basicAuth = require('express-basic-auth')
const cloudinary = require('cloudinary')

const app = express()
const port = process.env.PORT || 5000
const filter = 'red_rock' // audrey, ukulele, quartz

if(process.env.AUTH_PASSWORD){
  app.use(basicAuth({
    users: { "holgapi": process.env.AUTH_PASSWORD }
  }))
}

app.get('/', function (_req, res) {
  cloudinary.v2.api.resources({resource_type: 'image', max_results: 1, direction: 'desc'}, (err, result) => {
    if (err) return console.log(err)
    const urls = result.resources.map((resource) => generateUrl(resource))

    res.send(`<img src="${urls[0]}" style="height: 100%;"/>`)
  })
})

app.listen(port, function () {
  console.log(`Started on http://localhost:${port}`)
})

const generateUrl = (resource) => {
  return `http://res.cloudinary.com/lw-gmaps/image/upload/c_crop,e_art:${filter},g_center,h_1944,w_1944/v${resource.version}/${resource.public_id}.jpg`
}
