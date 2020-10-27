var express = require('express');
const Post = require('../models/Post');
var router = express.Router();

const {tokenCheck} = require('../util/utility')

router.post('/', async(req, res) => {
    const {token, postId} = req.body
    //validate the Token
    const check = tokenCheck(token)
    //if token is valid
    if(check !== 'Invalid'){
        //check if the postId exists
        const post = await Post.findById(postId)
        //if post exists
        if(post){
            //check if like already exists
            const like = post.likes.find(l => l.username === check.username)
            if(like){
                //if like exists unlike it
                post.likes = post.likes.filter( l => l.username !== check.username)
                await post.save()
                return res.json({
                    message: "post Unliked",
                    ...post._doc
                }).status(200)
            }else{
                post.likes.push({
                    username: check.username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return res.json({
                    message: "post liked",
                    ...post._doc
                }).status(200)
            }
            // await post.save()
        }else{
            return res.json({
                message: "Post does not exist",
                ...post
            }).status(200)
        }
    }else return res.json({
        message: 'Forbidden',
    }).status(403)

})

module.exports = router