var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//User db
const User = require('../models/User')

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, "pass", {expiresIn: "1h"})
}

router.post('/', async(req, res) => {
    const {username, email, password, confirmPassword} = req.body;
    if(username && email && password && confirmPassword){
        //find if the email already exists
        const mail = await User.findOne({email})
        // console.log(mail)
        if(!mail){
            // console.log('No mail')
        //check if the username already exists
            const name = await User.findOne({username})
            if(!name){
                // console.log("no name")
                const pass = await bcrypt.hash(password, 12)
                // console.log(pass)
                const newUser = new User({
                    email,
                    username,
                    password: pass,
                    createdAt: new Date().toISOString()
                })

                const response = await newUser.save()
                const token = generateToken(response)
                res.json({
                    message: "success",
                    ...response._doc,
                    id: response.id,
                    token
                }).status(200)

            }else return res.json({
                message: "Username is Taken"
            }).status(200)
        }else {
            return res.json({
            message: "Email already exists"
        })}
    }


})

module.exports = router