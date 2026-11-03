import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { Utils } from "../utils/utils";

export class UserController {
  public register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    console.log("→ register hit");
    console.log("HEADERS:", req.headers);
    console.log("BODY:", req.body);

    try {
      const { name, email, password } = req.body ?? {};
      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        res.status(409).json({ error: "User already exists" });
        return;
      }

      const verificationToken = Utils.generateVerificationToken();
      console.log("Generated verification token:", verificationToken);

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name ?? "User",
        email: normalizedEmail,
        password: hash,
        verificationToken,
        verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
      });

      const { password: _pw, ...safeUser } = user.toObject();
      const token = Utils.generateToken({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      });

      res.status(201).json({
        ...safeUser,
        verificationToken,
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = Utils.generateToken({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      });

      console.log("Login token:", token);

      res.status(200).json({
        message: "Logged in",
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (error) {
      next(error);
    }
  };

  public verify = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, verificationToken } = req.body ?? {};
      if (!email || !verificationToken) {
        res
          .status(400)
          .json({ error: "email and verification token are required" });
        return;
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (user.verificationToken !== verificationToken) {
        res.status(401).json({ error: "Invalid verification token" });
        return;
      }

      if (
        !user.verificationTokenExpires ||
        new Date(user.verificationTokenExpires).getTime() < Date.now()
      ) {
        res.status(401).json({ error: "Verification token has expired" });
        return;
      }

      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      user.emailVerified = true;
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  };
}
