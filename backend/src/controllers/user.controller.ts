import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

// first page when the user register the user registeration page . 
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, educationlevel } = req.body;

    if (!email || !password || !educationlevel) {
      return res.status(400).json({ error: "email, password, educationLevel required" });
    }

    // const existing = await prisma.user.findUnique({ where: { email } });
    // if (existing) {
    //   return res.status(409).json({ error: "User already exists" });
    // }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashed,
        educationlevel: educationlevel
      },
    });


    // generate the jwt token over here
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    return res.status(201).json({ id: user.id, email: user.email, educationLevel: user.educationlevel, token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};