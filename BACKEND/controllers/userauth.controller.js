const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Registration Function:
const registerUser = async(req, res) => {
    const {email, name, password} = req.body;
    try {
        const user = await User.create({
            email: email,
            name: name,
            password: password
        });
        res.status(201).json({message: "Sucessfully Registered"});
    } catch (error) {
        let errMessages = { email: '', name: '', password: ''}
        if (error.code && error.code === 11000) {
            errMessages.email = "Email is already taken."
            return res.status(400).json({message: errMessages});
        };
        if (error.name === "ValidationError") {
            Object.values(error.errors).forEach(({properties}) => {
                errMessages[properties.path] = properties.message;
            });
            return res.status(400).json({message: errMessages})
        } res.status(500).json({message: "Something went wrong."});
    };
};

// Login Function:
const loginUser = async(req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.status(201).json({token: token});
    } catch (error) {
        res.status(401).json({message: error.message});
    };
};

// Token Generation Function:
const tokenValidityDuration = 3 * 24 * 60 * 60;
const createToken = (uid) => {
    return jwt.sign({ uid }, process.env.JWT_KEY, {
        expiresIn: tokenValidityDuration
    });
};

module.exports = {
    registerUser,
    loginUser
};