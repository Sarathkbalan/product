import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const authenticate = (req, res, next) => {
    const cookie = req.headers.cookie; // Get the cookie from the headers
    if (!cookie) {
        console.log("Please login");
        return res.status(401).send("Please login to continue");
    }

    // Parse cookies
    const cookies = cookieParser.parse(req.headers.cookie);
    const token = cookies.authToken; // Getting the authToken from cookies

    if (!token) {
        return res.status(401).send("Token is missing");
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
        req.user = verified;  // Attach verified user data to request
        console.log("User verified:", req.user);  // Log the user data
        next(); // Proceed to the next middleware/route
    } catch (error) {
        console.log("Invalid Token", error);
        return res.status(401).send("Invalid token");
    }
};

export default authenticate;
