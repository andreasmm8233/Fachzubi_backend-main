interface EmailOptions {
    to?: string;
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
}
declare class EmailService {
    private transporter;
    private fromEmail;
    constructor(fromEmail?: string);
    init(): Promise<void>;
    updateFromEmail(fromEmail: string): Promise<void>;
    sendEmail(options: EmailOptions): Promise<any>;
    verifyConnection(): Promise<void>;
}
declare const emailService: EmailService;
export default emailService;
