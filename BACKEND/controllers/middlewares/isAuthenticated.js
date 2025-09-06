import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header (Authorization: Bearer <token>)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // remove "Bearer"
  
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // Verify token
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.id = decode.id;   // ✅ Make userId accessible in controllers
    req.user = decode;    // Save full user payload if needed

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
