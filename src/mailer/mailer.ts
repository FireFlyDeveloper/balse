import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

class GoogleSMTP {
  private transporter: Transporter;

  constructor() {
    if (!process.env.EMAIL || !process.env.PASSWORD)
      throw new Error(
        "Gmail credentials are not set in environment variables.",
      );
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }

  public async sendMail(mailOptions: SendMailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }
  }
}

const googleSMTP = new GoogleSMTP();

const mailOptions: SendMailOptions = {
  from: `"No Reply" <${process.env.EMAIL}>`,
  to: "saludeskimdev@gmail.com",
  subject: "Hello from Google SMTP",
  text: "This is a test email sent using Google SMTP.",
  html: "<b>This is a test email sent using Google SMTP.</b>",
};

googleSMTP
  .sendMail(mailOptions)
  .then(() => console.log("Email sent successfully"))
  .catch((error) => console.error("Failed to send email:", error));
