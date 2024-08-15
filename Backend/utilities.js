const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]; 
    const token = authHeader && authHeader.split(" ")[1]; // Split by a space to get the token

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(403); // Changed status to 403 for invalid token
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
};
