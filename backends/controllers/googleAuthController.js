import { OAuth2Client } from "google-auth-library";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const client = new OAuth2Client();

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

export const googleLogin = async (req, res) => {
  const { token, mode } = req.body;

  if (!token) {
    return res.json({ success: false, message: "No token provided" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await userModel.findOne({ email });

    // ✅ REGISTER MODE
    if (mode === "register") {
      if (user) {
        return res.json({
          success: false,
          message: "You are already registered. Please login instead.",
        });
      }

      const randomPassword = Math.random().toString(36).slice(-16);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await new userModel({
        name,
        email,
        password: hashedPassword,
      }).save();

      const appToken = createToken(user._id);
      return res.json({
        success: true,
        token: appToken,
        message: "Registered successfully!",
        user: { name: user.name, email: user.email },
      });
    }

    // ✅ LOGIN MODE
    if (mode === "login") {
      if (!user) {
        return res.json({
          success: false,
          message: "You are not registered. Please register first.",
        });
      }

      const appToken = createToken(user._id);
      return res.json({
        success: true,
        token: appToken,
        message: "Login successful!",
        user: { name: user.name, email: user.email },
      });
    }

    return res.json({ success: false, message: "Invalid mode" });
  } catch (error) {
    console.log("Google auth error:", error);
    res.json({ success: false, message: "Google authentication failed" });
  }
};





