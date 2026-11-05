import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { Utils } from "../utils/utils";
<<<<<<< HEAD
import { NodeMailer } from "../utils/nodeMailer";
=======
>>>>>>> 142b726cc035f284d068126c921ed97e60655483

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
<<<<<<< HEAD
      res.status(201).json(safeUser);
=======
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
>>>>>>> 142b726cc035f284d068126c921ed97e60655483
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
