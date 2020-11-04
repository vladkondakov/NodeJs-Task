const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth-route')
const employeesRoute = require('./routes/employees')
const startRoute = require('./routes/start-page')
const bearerToken = require('express-bearer-token')
const app = express()

app.use(bearerToken())
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
app.use('/', startRoute) 
app.use('/auth', authRoute)
app.use('/employees', employeesRoute)

const PORT = config.get('port') || 8000

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.info(`App has been started on port ${PORT}...`)
        })
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()