import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  name?: string;
}

export class Utils {
  static getJwtSecret(): string {
    return process.env.JWT_SECRET || "swaggycloneapp-secret-key";
  }

  static generateToken(payload: Omit<TokenPayload, "iat" | "exp">): string {
    const token = jwt.sign(payload, this.getJwtSecret(), { expiresIn: "7d" });
    console.log("Generated JWT token:", token);
    return token;
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.getJwtSecret()) as TokenPayload;
  }

  static generateVerificationToken(digit: number = 6): string {
    const digits = "0123456789";
    let token = "";

    for (let i = 0; i < digit; i++) {
      token += digits[Math.floor(Math.random() * digits.length)];
    }

    return token;
  }
}
