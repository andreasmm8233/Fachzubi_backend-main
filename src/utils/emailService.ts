import nodemailer, { type SentMessageInfo } from "nodemailer";
import logger from "./logger";
import { smtpSettingModel } from "../models/index";

interface EmailOptions {
  to?: string;
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
}
interface TransportOptions {
  service: string;
  host: string;
  tls: {
    rejectUnauthorized: boolean;
  };
  secure: boolean;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;
  private fromEmail: string;
  constructor(fromEmail?: string) {
    this.fromEmail = fromEmail ?? "";
  }

  async init() {
    const smtpInfo = await smtpSettingModel.findOne();
    const options: TransportOptions = {
      service: smtpInfo?.service ? smtpInfo?.service : "smtp",
      host: smtpInfo?.host
        ? smtpInfo?.host
        : process.env.EMAIL_HOST
          ? process.env.EMAIL_HOST
          : "",
      tls: {
        rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED === "true",
      },
      secure: process.env.EMAIL_SECURE === "true",
      port: smtpInfo?.port
        ? Number(smtpInfo?.port)
        : Number(process.env.EMAIL_PORT),
      auth: {
        user: smtpInfo?.userName
          ? smtpInfo?.userName
          : process.env.EMAIL_USER ?? "",
        pass: smtpInfo?.password
          ? smtpInfo?.password
          : process.env.EMAIL_PASS ?? "",
      },
      // Include encryption if needed
      // encryption: smtpInfo?.encryption || process.env.EMAIL_ENCRYPTION || "",
    };

    if (
      smtpInfo?.host &&
      smtpInfo?.userName &&
      smtpInfo?.password &&
      smtpInfo?.port
    ) {
      options.auth.user = smtpInfo.userName;
      options.auth.pass = smtpInfo.password;
      options.host = smtpInfo.host;
      options.port = smtpInfo.port;
    }
    this.transporter = nodemailer.createTransport({
      ...options,
    });
    if (!this.fromEmail) {
      this.fromEmail = process.env.EMAIL_FROM ?? "";
    }
  }

  async updateFromEmail(fromEmail: string) {
    this.fromEmail = fromEmail;
  }

  async sendEmail(options: EmailOptions) {
    try {
      const { to, subject, text, html, bcc } = options;
      const mailOptions = {
        from: this.fromEmail,
        to,
        bcc,
        subject,
        text,
        html,
      };
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Message sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error("fail to send:", error);
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info("Email Service is up and running 🚀🚀🚀");
    } catch (error) {
      logger.error("Email Service is down ☹️: ", error);
    }
  }
}
const emailService = new EmailService();
export default emailService;
