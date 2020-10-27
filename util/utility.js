const { response } = require('express');
const jwt = require('jsonwebtoken')




const checkAuth = {
    tokenCheck: function(a) {
        try{
            const user = jwt.verify(a, 'pass')
        // if(user){
            return user
        // }//else return 'Invalid'
    }catch(err){
        // console.log(err)
        return 'Invalid'
    }
    }
};

module.exports = checkAuth;