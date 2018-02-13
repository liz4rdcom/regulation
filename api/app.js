const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')

const app = express()

const organizations = require('./routes/organizations')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static('../public/dist'))

app.use(organizations.baseUrl, organizations.router)

app.use((response, req, res, next) => {
  // TODO logs
  if (response.error) {
    console.error(response.error)
    let statusCode = response.error.statusCode || 500
    let errorMessage = response.error.message || 'დაფიქსირდა შეცდომა'
    return res.status(statusCode).send({ message: errorMessage, error: response.error })
  }
  res.send(response.result)
})

app.get('*', (req, res) => res.redirect('/'))

app.listen(config.get('port'), () => console.log('started'))
