import { Request, Response } from "express";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Config } from "../entities/Config";
import { About } from "../entities/About";

const logError = (error: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${error}\n`;
    fs.appendFileSync(path.join(process.cwd(), "email-errors.log"), logMessage);
};

export class ContactController {
    static sendEmail = async (req: Request, res: Response) => {
        const { name, email, subject, message } = req.body;

        if (!(name && email && subject && message)) {
            return res.status(400).send({ message: "All fields are required" });
        }

        try {
            // Fetch configuration from database (fallback)
            const configRepository = AppDataSource.getMongoRepository(Config);
            const configs = await configRepository.find();
            const configMap: Record<string, string> = {};
            configs.forEach(c => configMap[c.key] = c.value);

            // Fetch Admin Profile (Secondary fallback for email)
            const aboutRepository = AppDataSource.getMongoRepository(About);
            const about = await aboutRepository.findOne({ where: {} });

            // 1. Determine Target Email (Priority: ENV > PORTFOLIO PROFILE > DB CONFIG)
            const targetEmail = process.env.CONTACT_RECEIVER_EMAIL || about?.email || configMap.CONTACT_RECEIVER_EMAIL;
            console.log(`[Email Service] Target Receiver: ${targetEmail}`);

            if (!targetEmail) {
                logError("Admin receiver email not configured in .env, profile, or settings.");
                return res.status(500).send({ message: "Receiver email not configured. Please set CONTACT_RECEIVER_EMAIL in your .env or update your profile." });
            }

            // 2. Setup SMTP Config (Priority: ENV > DB CONFIG)
            const smtpHost = process.env.SMTP_HOST || configMap.SMTP_HOST || 'smtp.gmail.com';
            const smtpPort = Number(process.env.SMTP_PORT) || Number(configMap.SMTP_PORT) || 587;
            const smtpUser = process.env.SMTP_USER || configMap.SMTP_USER;
            const smtpPass = (process.env.SMTP_PASS || configMap.SMTP_PASS)?.replace(/\s/g, '');

            if (!smtpUser || !smtpPass) {
                console.warn(`[Email Service] Missing SMTP credentials! User: ${smtpUser}`);
                logError(`SMTP credentials missing in .env and database.`);
                return res.status(500).send({ message: "SMTP credentials (USER/PASS) are missing in .env or Admin Settings." });
            }

            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465 || configMap.SMTP_SECURE === "true",
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });

            // Verify connection
            console.log(`[Email Service] Verifying SMTP connection...`);
            try {
                await transporter.verify();
                console.log(`[Email Service] SMTP verification SUCCESS.`);
            } catch (vErr: any) {
                console.error(`[Email Service] SMTP verification FAILED:`, vErr.message);
                logError(`SMTP Connection Verification Failed: ${vErr.message}`);
                return res.status(500).send({ message: "Failed to send message. Please try again later or contact the administrator." });
            }

            // 3. Send email 
            const mailOptions = {
                from: `"${name} (${email})" <${smtpUser}>`,
                to: targetEmail,
                replyTo: email,
                subject: `Portfolio Inquiry: ${subject}`,
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                html: `
                    <div style="font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15); border: 1px solid #e2e8f0;">
                        <!-- Premium Header -->
                        <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 60px 30px; text-align: center; color: #ffffff;">
                             <div style="margin-bottom: 20px; font-size: 40px;">📩</div>
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">New Message Received</h1>
                            <p style="margin: 10px 0 0; opacity: 0.9; font-size: 15px; font-weight: 500;">Sent via your Portfolio Contact Form</p>
                        </div>
                        
                        <!-- Main Body -->
                        <div style="padding: 40px; background-color: #ffffff;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding-bottom: 30px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9;">
                                            <tr>
                                                <td style="padding: 25px;">
                                                    <h3 style="margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 700;">Sender Details</h3>
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; width: 100px; font-weight: 600;">NAME:</td>
                                                            <td style="padding-bottom: 8px; font-size: 15px; color: #1e293b; font-weight: 700;">${name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size: 14px; color: #64748b; font-weight: 600;">EMAIL:</td>
                                                            <td style="font-size: 15px; font-weight: 700;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 30px;">
                                        <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 700;">Subject Line</h3>
                                        <p style="margin: 0; font-size: 18px; color: #1e293b; font-weight: 700; line-height: 1.4;">${subject}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 40px;">
                                        <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 700;">Full Message</h3>
                                        <div style="background-color: #ffffff; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; border-left: 5px solid #4f46e5; font-size: 16px; color: #334155; line-height: 1.7; white-space: pre-line;">
                                            ${message.trim()}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a href="mailto:${email}" style="background: #4f46e5; color: #ffffff; padding: 18px 45px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3); text-transform: uppercase;">
                                            Reply to Sender
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                Portfolio Communication Hub<br>
                                <span style="opacity: 0.7; font-weight: 500;">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
                            </p>
                        </div>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            res.send({ message: "Email sent successfully" });
        } catch (error: any) {
            logError(`Critical Email sending failed: ${error.message}`);
            res.status(500).send({
                message: "Failed to send email. Check your SMTP settings (Password/Host).",
                error: error.message
            });
        }
    };
}
