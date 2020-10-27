const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()


//dB
require("./models/mongoose")

//routes
const posts = require('./routes/post')
const login = require('./routes/login')
const register = require('./routes/register')
const likes = require('./routes/like')



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//routes
app.use('/posts', posts)
app.use('/login', login)
app.use('/register', register)
app.use('/like', likes)





app.listen(9999, ()=> console.log('server runing at 9999'))