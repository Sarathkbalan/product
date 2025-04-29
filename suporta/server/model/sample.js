import { Schema, model } from "mongoose";

const userSchema = new Schema({
  Name: { type: String, required: true, minlength: 3 },
  Email: { type: String, required: true, unique: true, lowercase: true },
  Password: { type: String, required: true },
  UserID: { type: String, required: true, unique: true },
  UserType: { type: String, enum: ['Admin', 'User'], required: true }
}, {
  timestamps: true 
});

const sample = model("users", userSchema);

export { sample };
