import type { Request, Response, NextFunction, RequestHandler } from "express";
import { body, validationResult } from "express-validator";

const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export class UserValidators {
  static signup(): RequestHandler[] {
    return [
      body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
      body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
      validate,
    ];
  }

  static login(): RequestHandler[] {
    return [
      body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
      body("password").trim().notEmpty().withMessage("Password is required"),
      validate,
    ];
  }

  static verifyUserEmail(): RequestHandler[] {
    return [
      body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
      body("verificationToken")
        .trim()
        .notEmpty()
        .withMessage("Verification token is required"),
      validate,
    ];
  }
}
