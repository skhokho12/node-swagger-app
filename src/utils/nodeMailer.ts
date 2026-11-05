import nodemailer from "nodemailer";
import { getEnvironment } from "../environment";

export class NodeMailer {
  static initiateTransport() {
    const gmailUser = process.env.GMAIL_USER ?? getEnvironment().gmailAuth?.user;
    const gmailPass =
      process.env.GMAIL_APP_PASSWORD ?? getEnvironment().gmailAuth?.pass;
    const sendgridApiKey =
      process.env.SENDGRID_API_KEY ?? getEnvironment().sendgridAuth?.pass;

    if (gmailUser && gmailPass) {
      return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    }

    if (sendgridApiKey) {
      return nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth: {
          user: "apikey",
          pass: sendgridApiKey,
        },
      });
    }

    throw new Error(
      "No email provider configured. Set GMAIL_USER and GMAIL_APP_PASSWORD or SENDGRID_API_KEY in your environment.",
    );
  }

  static async sendMail(data: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<any> {
    const transporter = NodeMailer.initiateTransport();
    const from =
      process.env.EMAIL_FROM ??
      process.env.GMAIL_USER ??
      "no-reply@example.com";

    return transporter.sendMail({
      from: from,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
  }
}