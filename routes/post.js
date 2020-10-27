var express = require('express');
var router = express.Router();

const Post = require('../models/Post')

const {tokenCheck} = require('../util/utility')


router.get('/', (req, res) => {

})

router.post('/add', async (req, res) => {
    //check token
    const {body, token} = req.body
    const check = tokenCheck(token)
    if(check !== 'Invalid'){
        // console.log(check)
        const newPost = new Post({
            body,
            user: check.id,
            username: check.username,
            createdAt: new Date().toISOString()
        })
        await newPost.save()
        return res.json({
            ...newPost._doc
        })
    }else if(check === 'Invalid'){
        return res.json({
            message: 'Action Not Allowed',
        }).status(400)
    }

})

router.post('/delete', async(req, res) => {
    // console.log('oya')
    const {postId, token} = req.body
    //validate user
    const check = tokenCheck(token)
    console.log(check)
    if(check !== "Invalid"){
        //check if posts exists
        const post = await Post.findById(postId)
        //check if the token matches the username of that post
        if(post && check.username === post.username){
            // console.log('Ma delete e kpa')
            await post.deleteOne()
            res.json({
                message: 'Post successfully deleted',
            }).status(200)
        } else{
            res.json({
                message: 'Post does not exist'
            }).status(200)
        }
    }else{
        res.json({
            message: "Forbiden"
        }).status(403)
    }



})

router.post('/add_comment', async (req, res) => {
    const {token, body, postId} = req.body
    //validate the token
    const check = tokenCheck(token)
    //if the token is valid
    if(check !== 'Invalid'){
        //check if the post exists
        const post = await Post.findById(postId)
        //if post exists
        if(post){
            //add comment
            post.comments.unshift({
                body,
                username: check.username,
                createdAt: new Date().toISOString()
            })

            await post.save()
            res.json({
                message: "Comment has been added",
                ...post.comments
            }).status(200)
            return post
        }else{
            return res.json({
                message: "Post doesn't Exist"
            })
        }
    }else{
        return res.json({
            message: 'Forbidden'
        }).status(403)
    }

})

router.post('/delete_comment', async(req, res) => {
    const {token, postId, commentId} = req.body
    //validate the token
    const check = tokenCheck(token)
    //if the token is valid
    if(check !== 'Invalid'){
        //check if the post Exist
        const post = await Post.findById(postId)
        //if posts exists
        if(post){
            //get the index of the comment
            const commentIndex = post.comments.findIndex(c => c.id === commentId)
            //if token matches the username of the comment
            if(post.comments[commentIndex] && post.comments[commentIndex].username === check.username){
                post.comments.splice(commentIndex, 1)
                await post.save()
                return res.json({
                    message: "Comment deleted",
                    ...post.comments
                }).status(200)
            }else{
                return res.json({
                    message: "Action is not Permitted"
                })
            }
        }else{
            return res.json({
                message: "Post does not exist"
            })
        }
    }
})

module.exports = router