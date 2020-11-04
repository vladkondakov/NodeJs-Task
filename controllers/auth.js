const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { validationResult } = require('express-validator')
const Employee = require('../models/employee')

const lowDb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = lowDb(new FileSync('rdb.json'))

const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400), json({
                errors: errors.array(),
                message: 'Wrong login or password'
            })
        }

        const { login, password } = req.body
        const employee = Employee.getByLogin(login)
        
        if(!employee) {
            return res.status(400).json({ message: 'No such employee' })
        }
        
        if(!(await bcrypt.compare(password, employee.password))) {
            return res.status(400).json({ message: 'Wrong password' })
        }
        
        const token = jwt.sign(
            { login },
            config.get('jwtSecret'),
            { expiresIn: config.get('tokenTime') }    
        )
        
        const refreshToken = jwt.sign(
            { login },
            config.get('jwtSecretRefresh'),
            { expiresIn: config.get('refreshTokenTime') }
        )
        
        db.get('refreshTokens').push(refreshToken).write()
        
        res.json({
            status: "Logged in",
            token,
            refreshToken
        })

    } catch (e) {
        res.status(500).json({
            message: 'Something is wrong, try again'
        })
    }
} 

const generateNewToken = (req, res) => {
    const refreshToken = req.body.token

    if(!refreshToken) {
        return res.status(403).json({ message: "Refresh Token hasn't been given" })
    }
    
    let refreshTokens = db.get('refreshTokens').value()

    if(!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ message: "Refresh token doesn't exist" })
    }
    
    jwt.verify(refreshToken, config.jwtSecretRefresh, (err, login) => {
        if(err) {
            return res.status(403).json({ message: "can't verify refresh token" })
        }

        const token = jwt.sign(
            { login },
            config.get('jwtSecret'),
            { expiresIn: config.get('tokenTime') }    
        )

        res.json({ token })
    })
}

const logout = (req, res) => {
    // pull? Read about it, but now it works, fine
    db.get('refreshTokens').pull(req.body.token).write()
    res.json({ status: "Logged out" })
}

module.exports = {
    login,
    generateNewToken,
    logout
}