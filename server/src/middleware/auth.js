const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) =>
{
    try
    {
        const token = req.headers.authorization?.split(' ')

        if (!token)
        {
            return res.status(401).json({ error: "Token not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.username = decoded.username;

        next();
    }

    catch (err)
    {
        return res.status(401).json({
            error: "Token is invalid or has expired",
            details: err.message
        });
    }
};