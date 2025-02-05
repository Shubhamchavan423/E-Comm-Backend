const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { secret } = require('../configs/auth.config');

exports.signup = async (req, res) => {
    try {
        // 1. Read the request body
        const { name, userId, email, password, usertype = "CUSTOMER" } = req.body;

        // 2. Validate required fields
        if (!name || !userId || !email || !password) {
            return res.status(400).send({ message: "All fields are required!" });
        }

        // 3. Check if user already exists
        const existingUser = await userModel.findOne({ userId });
        if (existingUser) {
            return res.status(400).send({ message: "User ID already taken!" });
        }

        // 4. Hash the password and create the user
        const hashedPassword = bcrypt.hashSync(password, 8);
        const user_created = await userModel.create({
            name,
            userId,
            email,
            usertype,
            password: hashedPassword
        });

        const user_created1 ={
            name :user_created.name,
            userId : user_created.userId,
            email : user_created.email,
            usertype : user_created.usertype,
            // password: hashedPassword
        }


        res.status(201).send({ message: "User registered successfully!", user: user_created1 });

    } catch (err) {
        console.error("Error while registering the user:", err);
        res.status(500).send({ message: "Some error occurred while registering the user" });
    }
};


exports.signin = async (req, res)=>{
    //check if the user id is present in the system
    const user = await userModel.findOne({userId :req.body.userId})

    if(user==null){
        return res.status(400).send({
            message: 'user id is not valid '
        })
    }
    //check if the password is correct
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)

    if(!isPasswordValid){
        return res.status(401).send({
            message : 'Wrong password ! Enter valid password'
        })
    }

    //using JWT we will create the access token with a given TTL(time to leave) and return
    const token = jwt.sign({id : user.userId},secret,{ // on which field ,some secrete word/code, expiring token time
        expiresIn :120 //second
    })

    return res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        usertype : user.usertype,
        accessToken : token

    })
}