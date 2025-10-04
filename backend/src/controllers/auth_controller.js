import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { upsertStreamUser } from '../library/stream.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function signup(req, res) {
  const {fullName, email, password} = req.body;

  try {
    if(!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if(password.length < 6){
      return res.status(400).json({error: "Password length must be 6 characters"})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const indx = Math.floor(Math.random()*100)+1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${indx}.png`;   // find some other websites or apis for random user avatars

    const newUser =  await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar
    })

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user upserted successfully ${newUser.fullName}`);
    } catch (error) {
      console.error("Error upserting Stream user:", error); 
    }

     // Define the welcome email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Welcome to the CloseCall!',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #333;">Hello, ${newUser.fullName}!</h2>
          <p>Thank you for registering on CloseCall. We're excited to have you on board!</p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending welcome email:', error);
      } else {
        console.log('Welcome email sent:', info.response);
      }
    });

    const token  = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY, {
      expiresIn: "1d"
    })

    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production" // Use secure cookies in production
    })
    res.status(201).json({success: true, user: newUser});

  } catch (error) {
    console.log("Error in Signup Controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try{
    const {email, password} = req.body;

    if(!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if(password.length < 6){
      return res.status(400).json({error: "Password length must be 6 characters"})
    }

    const user = await User.findOne({email});
    if(!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const isPassword = await user.MatchPassword(password);
    if(!isPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token  = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY, {
      expiresIn: "1d"
    })

    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production" // Use secure cookies in production
    })
    res.status(200).json({success: true, user});

  }catch (error) {
    console.log("Error in Login Controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
}
   
export async function onboard(req, res) {
  const userId = req.user._id;
  const { fullName, bio, location } = req.body;

  try {
    if (!userId || !fullName || !bio || !location) {
      return res.status(400).json({
        error: "All fields are required",
        missingFields : [
          !fullName && "fullName",
          !bio && "bio",
          !location && "location"
        ].filter(Boolean),
       });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (error) {
      console.error("Error upserting Stream user:", error);
    }

    res.status(200).json({ success: true, message: "Onboarding completed successfully", updatedUser });
  } catch (error) {
    console.log("Error in Onboarding Controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}