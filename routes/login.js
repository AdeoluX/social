var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
//schema
const User = require('../models/User')

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, "pass", {expiresIn: "1h"})
}


router.post('/', async(req, res) => {
    const {email, password} = req.body
    if(email && password){
        //check if email exists
        const mail = await User.findOne({email})
        console.log(mail)
        if(mail){
            //compare passwords
            const match = await bcrypt.compare(password, mail.password)
            if(match){
                const token = generateToken(mail)
                return res.json({
                    ...mail._doc,
                    id: mail.id,
                    token
                })
            }
        }
    }


})

module.exports = router