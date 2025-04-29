import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sample } from "../model/sample.js"; // Assuming this is your user model
import cookieParser from "cookie-parser";

dotenv.config();
const userauth = Router();
userauth.use(cookieParser());

// Helper function to validate email format
const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

// Helper function to generate User-ID (sequential for users)
const generateUserID = async (role) => {
    if (role === "Admin") {
        return "ADMIN01"; // Fixed User-ID for admin
    }
    
    const latestUser = await sample.findOne({ UserType: "User" }).sort({ _id: -1 });
    const latestUserID = latestUser ? latestUser.UserID : "USER000";
    const userNumber = parseInt(latestUserID.slice(4));
    const newUserID = `USER${(userNumber + 1).toString().padStart(3, '0')}`;
    return newUserID;
};

// Signup route
userauth.post("/signup", async (req, res) => {
    try {
        const { password, email, userType, name } = req.body;

        // Validate name (minimum 3 characters)
        if (!name || name.length < 3) {
            return res.status(400).send("Name must be at least 3 characters");
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).send("Invalid email format");
        }

        // Check if email is already registered
        const existingUser = await sample.findOne({ Email: email });
        if (existingUser) {
            return res.status(400).send("Email is already in use");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique User-ID
        const userID = await generateUserID(userType);

        // Create the new user
        const newUser = new sample({
            Name: name,
            Email: email,
            UserType: userType, // 'Admin' or 'User'
            Password: hashedPassword,
            UserID: userID,
        });

        await newUser.save();

        res.status(201).send("Signup successful");
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Login route (using Email now)
// POST request for login
userauth.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await sample.findOne({ Email: email });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        // Compare password with hashed password
        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            return res.status(401).send("Invalid email or password");
        }

        // Create JWT token
        const token = jwt.sign({ email: user.Email, UserType: user.UserType }, process.env.SECRET_KEY);

        // Set token in cookie
        res.cookie("authToken", token, { httpOnly: true });

        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});



// Logout
userauth.get("/logout", (req, res) => {
    res.clearCookie("authToken");
    res.status(200).send("Successfully logged out");
    console.log("Logout successful");
});


export { userauth };
