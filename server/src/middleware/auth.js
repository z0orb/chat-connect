const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => 
{
  try {
    //fetch token jwt nya dari authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) 
    {
      return res.status(401).json({ 
        error: "Token not found"
      });
    }

    //extract dari Bearer <token>
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: "Authorization Bearer format is wrong"
      });
    }

    const [scheme, token] = parts;

    if (scheme !== 'Bearer') 
    {
      return res.status(401).json({ 
        error: "Authorization scheme must be Bearer"
      });
    }

    //mastikan token string, terus di trim (tadi gak di verify string apa ga le, lupa)
    if (typeof token !== 'string' || token.trim() === '') 
    {
      return res.status(401).json({ 
        error: 'Token tidak valid'
      });
    }

    //verify token pakai trim
    const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
    
    req.userId = decoded.userId;
    req.username = decoded.username;
    
    next();
  } 
  
  catch (err) 
  {
    console.error('JWT Error:', err.message);
    
    if (err.name === 'TokenExpiredError') 
    {
      return res.status(401).json({ 
        error: "Token has Expired"
      });
    }

    return res.status(401).json({ 
      error: "Token is not valid or has expired",
      details: err.message 
    });
  }
};

exports.optionalToken = (req, res, next) => 
{
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(' ');
      
      if (parts.length === 2 && parts === 'Bearer') 
    {
        const token = parts;
        
        if (typeof token === 'string' && token.trim() !== '') {
          const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
          req.userId = decoded.userId;
          req.username = decoded.username;
        }
      }
    }

    next();
  } 
  
  catch (err) 
  {
    console.warn('Optional token verification failed:', err.message);
    next();
  }
};
