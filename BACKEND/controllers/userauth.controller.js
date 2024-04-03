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
        console.error(error);
        res.status(400);
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
        console.error(error);
        res.status(401);
    };
};

// Token Generation Function:
const tokenValidityDuration = 3 * 24 * 60 * 60;
const createToken = (uid) => {
    return jwt.sign({ uid }, process.env.JWT_KEY, {
        expiresIn: tokenValidityDuration
    });
};

// Handle Registration Errors:
const registrationErrorHandler = (err) => {
    console.log(err.message);
}

module.exports = {
    registerUser,
    loginUser
};