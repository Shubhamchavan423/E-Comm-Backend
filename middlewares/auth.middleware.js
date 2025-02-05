

//creating middleware to check request body is proper and correct
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const auth_config = require('../configs/auth.config')


const verifySignupBody = async (req ,res, next)=>{
    try{
        //check for name
        if(!req.body.name){
            return res.status(400).send({
                message : 'failed ! name was not provied in request'
            })
        }
        //check for email
        if(!req.body.email){
            return res.status(400).send({
                message : 'failed ! email was not provied in request'
            })
        }
        //check for userId
        if(!req.body.userId){
            return res.status(400).send({
                message : 'failed ! userId was not provied in request'
            })
        }
        //check for user is present or not 
        const user = await userModel.findOne({userId: req.body.userId})
        if(user){
            return res.status(400).send({
                message : 'failed ! user was not provied in request'
            })
        }
        next();
    }catch(err){
        console.log('error while verifying body');
        res.status(500).send({
            message : 'Error while validating the request body'
        })
        
    }
}

const signInBody = async (req, res, next)=>{
    if(!req.body.userId){
        return res.status(500).send({
            message : 'UserId is not provided'
        })
    }
    if(!req.body.password){
        return res.status(500).send({
            message : 'Password is not provided'
        })
    }
    next();
}

const verifyingToken =(req, res, next )=>{
    // check if the token is availble or not 
    const token = req.headers['x-access-token']

    if(!token){
        return res.status(403).send({
            message : "NO token found : UnAutherized"
        })
    }
    //if its the valid token 
    jwt.verify(token, auth_config.secret, async (err ,decoded)=>{
        if(err){
            return res.status(401).send({
                message :"UnAutherized !"
            })
        }
        const user = await userModel.findOne({userId : decoded.id})
        if(!user){
            return res.status(400).send({
                message : "UnAutherized ! this user is not exist for this token"
            })
        }
    })

    //then move to the next step
    req.user =user
    next();
}

const isAdminCheck =(req, res, next)=>{
    const user =req.user
    if(user && user.usertype=='ADMIN'){
        next()
    }else{
        return res.status(403).send({
            message :'Only ADMIN users are allowed to access this endpoint'
        })
    }

}

module.exports = {
    
    verifySignupBody ,signInBody, verifyingToken ,isAdminCheck
}