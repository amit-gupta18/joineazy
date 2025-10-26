import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

// first page when the user register the user registeration page . 
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role , name } = req.body;
    console.log("control reached in registerUser", email, password, role, name);
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: "email, password, role, name required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        passwordHash: hashed,
        name: name,
        role: role
      },
    });

    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    // generate the jwt token over here
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    return res.status(201).json({ id: user.id, email: user.email, role: user.role, token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("control reached in loginUser", email, password);
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id , name: user.name }, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ id: user.id, email: user.email, role: user.role, token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};4
