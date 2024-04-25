// Middleware for authenticating JSON Web Token:
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({message: "Unauthorized Access: Please login to continue."})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        currentUID = decodedToken.uid;
        next();
    } catch (error) {
        return res.status(403).json({message: "Unauthorized Access: Token value is invalid."})
    };
};

module.exports = { authenticateToken }