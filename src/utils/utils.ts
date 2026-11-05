export class Utils {
  static generateVerificationToken(digit: number = 6): string {
    const digits = "0123456789";
    let token = "";

    for (let i = 0; i < digit; i++) {
      token += digits[Math.floor(Math.random() * digits.length)];
    }

    return token;
  }

  static generateOtpExpiry(minutes: number = 10): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  static isOtpExpired(expiresAt?: Date | string): boolean {
    if (!expiresAt) return true;
    return new Date(expiresAt).getTime() <= Date.now();
  }
}