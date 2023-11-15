const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { salvarSeguro, listarSeguros } = require('./seguro-service')
const webpush = require('web-push')

const vapidKeys = {
    publicKey: 'BE7LanpdIIw1niCSqHZOzPv2dfbZlHW_hEi7rciPpuOjnfvoFJp2tk1QZUXmILVhBh3VvnHIdI9HdaCtnuN8T8M',
    privateKey: 'Dl6ipVfm-xEy3YI88ixf6gPhYVEnwSlKgDRFvyNG16o'
}

webpush.setVapidDetails('teste@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey)

const app = express()
app.use(bodyParser.json())
app.use(cors({origin: true, credentials: true}))

app.route('/api/seguros').post(salvarSeguro)
app.route('/api/seguros').get(listarSeguros)


const HOST = 'localhost'
const PORT = 9000
// respond with "hello world" when a GET request is made to the homepage
const httpServer = app.listen(PORT, HOST, () => {
    console.log(`Servidor funcionando em http://${HOST}:${PORT}`)
})