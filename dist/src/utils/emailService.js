"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
const index_1 = require("../models/index");
class EmailService {
    transporter;
    fromEmail;
    constructor(fromEmail) {
        this.fromEmail = fromEmail ?? "";
    }
    async init() {
        const smtpInfo = await index_1.smtpSettingModel.findOne();
        const options = {
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
        };
        if (smtpInfo?.host &&
            smtpInfo?.userName &&
            smtpInfo?.password &&
            smtpInfo?.port) {
            options.auth.user = smtpInfo.userName;
            options.auth.pass = smtpInfo.password;
            options.host = smtpInfo.host;
            options.port = smtpInfo.port;
        }
        this.transporter = nodemailer_1.default.createTransport({
            ...options,
        });
        if (!this.fromEmail) {
            this.fromEmail = process.env.EMAIL_FROM ?? "";
        }
    }
    async updateFromEmail(fromEmail) {
        this.fromEmail = fromEmail;
    }
    async sendEmail(options) {
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
            logger_1.default.info(`Message sent: ${info.messageId}`);
            return info;
        }
        catch (error) {
            logger_1.default.error("fail to send:", error);
        }
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            logger_1.default.info("Email Service is up and running 🚀🚀🚀");
        }
        catch (error) {
            logger_1.default.error("Email Service is down ☹️: ", error);
        }
    }
}
const emailService = new EmailService();
exports.default = emailService;
//# sourceMappingURL=emailService.js.map