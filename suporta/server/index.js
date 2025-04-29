import express, { json } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // ✅ import cookie-parser
import { userauth } from './Router/Userauth.js';
import adminauth from './Router/adminauth.js';


dotenv.config();
const app = express();

app.use(json());
app.use(cookieParser()); // ✅ Correct place to use cookie-parser
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true // ✅ allow sending cookies from frontend
}));

app.use("/", userauth);
app.use("/", adminauth);

mongoose.connect("mongodb://localhost:27017/ProductManagement")
.then(() => {
  console.log("MongoDB connected successfully to ProductManagement");
})
.catch((error) => {
  console.error("MongoDB connection failed", error);
});

app.listen(process.env.PORT, function() {
  console.log(`Server is listening at ${process.env.PORT}`);
});
