import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { Utils } from "../utils/utils";
import { NodeMailer } from "../utils/nodeMailer";

export class UserController {
  public register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
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
      const verificationTokenExpires = Utils.generateOtpExpiry(10);

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name ?? "User",
        email: normalizedEmail,
        password: hash,
        verificationToken,
        verificationTokenExpires,
      });

      try {
        await NodeMailer.sendMail({
          to: user.email,
          subject: "Verify your email address",
          text: `Your verification code is: ${verificationToken}`,
          html: `<p>Welcome! Please verify your email by using this code: <strong>${verificationToken}</strong></p>`,
        });
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        res.status(500).json({
          error: "Failed to send verification email. Check your Gmail app password and email settings.",
        });
        return;
      }

      const { password: _pw, ...safeUser } = user.toObject();
      res.status(201).json(safeUser);
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

      res.status(200).json({
        message: "Logged in",
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (error) {
      next(error);
    }
  };
}