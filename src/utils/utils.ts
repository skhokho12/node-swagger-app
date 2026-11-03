export class Utils {
  static generateVerificationToken(digit: number = 6): string {
    const digits = "0123456789";
    let token = "";

    for (let i = 0; i < digit; i++) {
      token += digits[Math.floor(Math.random() * digits.length)];
    }

    return token;
  }
}