const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('Start page with login form')
})

module.exports = router