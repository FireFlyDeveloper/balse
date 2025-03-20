import { SendMailOptions } from "nodemailer";
import Router from ".";
import { Context } from "hono";
import { Role } from "../models/types";

class ForgotPassword extends Router {
  // Render forgot password page for students
  async students_forgot(c: Context) {
    try {
      const html = await this.rf(
        `${this.dir}/student_forgotPassword.html`,
        "utf-8",
      );
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async teacher_forgot(c: Context) {
    try {
      const html = await this.rf(
        `${this.dir}/teacher_forgotPassword.html`,
        "utf-8",
      );
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async admin_forgot(c: Context) {
    try {
      const html = await this.rf(
        `${this.dir}/teacher_forgotPassword.html`,
        "utf-8",
      );
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  // Render token verification page
  async token_forgot(c: Context) {
    try {
      const html = await this.rf(
        `${this.dir}/forgotPasswordToken.html`,
        "utf-8",
      );
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  // Handle password reset token verification and password update
  async token(c: Context) {
    try {
      const { token, newPassword } = await c.req.json();

      // Validate inputs
      if (!token || !newPassword) {
        return c.json({ error: "Token and new password are required" }, 400);
      }

      const session = c.get("session");
      const token_id = session.get("token_id");
      const _token = session.get("resetToken");
      const role = session.get("role");

      // Verify token
      if (token !== _token) {
        return c.json({ error: "Invalid or expired token" }, 400);
      }

      // Hash the new password
      const password = await this.hashPassword(newPassword);

      // Update password based on role
      switch (role) {
        case Role.Student:
          await this.db.updateStudent(token_id, { password_hash: password });
          break;
        case Role.Teacher:
          await this.db.updateTeacher(token_id, { password_hash: password });
          break;
        case Role.Admin:
          await this.db.updateAdmin(token_id, { password_hash: password });
          break;
        default:
          return c.json({ error: "Invalid role" }, 400);
      }

      // Clear session data
      session.forgot("resetToken");
      session.forgot("token_id");
      session.forgot("role");

      return c.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  // Send password reset email for students
  async student_api(c: Context) {
    try {
      const { id } = await c.req.json();

      // Validate input
      if (!id) {
        return c.json({ error: "Student ID is required" }, 400);
      }

      // Fetch student data
      const student = await this.db.getStudentById(id);
      if (!student) {
        return c.json({ error: "Student not found" }, 404);
      }

      // Generate reset token
      const resetToken = this.generateToken();

      // Set session data
      const session = c.get("session");

      if (session.get("resetToken")) {
        session.forgot("resetToken");
        session.forgot("token_id");
        session.forgot("role");
      }

      session.set("resetToken", resetToken);
      session.set("token_id", id);
      session.set("role", Role.Student);

      // Send reset email
      await this.sendResetEmail(
        student.email,
        student.first_name,
        student.last_name,
        resetToken,
        "Student",
      );

      return c.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  // Send password reset email for teachers
  async teacher_api(c: Context) {
    try {
      const { id } = await c.req.json();

      // Validate input
      if (!id) {
        return c.json({ error: "Teacher ID is required" }, 400);
      }

      // Fetch teacher data
      const teacher = await this.db.getTeacherById(id);
      if (!teacher) {
        return c.json({ error: "Teacher not found" }, 404);
      }

      // Generate reset token
      const resetToken = this.generateToken();

      // Set session data
      const session = c.get("session");
      if (session.get("resetToken")) {
        session.forgot("resetToken");
        session.forgot("token_id");
        session.forgot("role");
      }

      session.set("resetToken", resetToken);
      session.set("token_id", id);
      session.set("role", Role.Teacher);

      // Send reset email
      await this.sendResetEmail(
        teacher.email,
        teacher.first_name,
        teacher.last_name,
        resetToken,
        "Teacher",
      );

      return c.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  // Send password reset email for admins
  async admin_api(c: Context) {
    try {
      const { id } = await c.req.json();

      // Validate input
      if (!id) {
        return c.json({ error: "Admin ID is required" }, 400);
      }

      // Fetch admin data
      const admin = await this.db.getAdminById(id);
      if (!admin) {
        return c.json({ error: "Admin not found" }, 404);
      }

      // Generate reset token
      const resetToken = this.generateToken();

      // Set session data
      const session = c.get("session");
      session.set("resetToken", resetToken);
      session.set("token_id", id);
      session.set("role", Role.Admin);

      // Send reset email
      await this.sendResetEmail(
        admin.email,
        admin.first_name,
        admin.last_name,
        resetToken,
        "Admin",
      );

      return c.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  // Reusable function to send reset emails
  private async sendResetEmail(
    email: string,
    first_name: string,
    last_name: string,
    resetToken: string,
    role: string,
  ) {
    const resetLink = `https://balse-portal.onrender.com/reset-password/${resetToken}`;

    const mailOptions: SendMailOptions = {
      from: `"Balayan SHS - No Reply" <${process.env.EMAIL}>`,
      to: email,
      subject: `Password Reset Request - ${role} Portal`,
      text: `Dear ${this.capitalizeWords(first_name)} ${this.capitalizeWords(
        last_name,
      )},\n\nYou have requested to reset your password for your Balayan SHS - ${role} Portal account. Please click the link below to reset your password:\n\nReset Password Link: ${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nBalayan SHS Admin Team`,
      html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset Request</title>
                    <style>
                        /* Add your CSS styles here */
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Balayan SHS - Password Reset</h1>
                        </div>
                        <div class="content">
                            <h2>Dear ${this.capitalizeWords(first_name)} ${this.capitalizeWords(last_name)},</h2>
                            <p>You have requested to reset your password for your Balayan SHS - ${role} Portal account. Please click the link below to reset your password:</p>
                            <div class="reset-link">
                                <a href="${resetLink}">Reset Password</a>
                            </div>
                            <p>If you did not request this, please ignore this email.</p>
                            <p>Best regards,<br>Balayan SHS Admin Team</p>
                        </div>
                        <div class="footer">
                            <p><a href="https://www.facebook.com/DepEdTayoBSHS342209">Balayan SHS</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    };

    this.mailer
      .sendMail(mailOptions)
      .then(() => console.log("Email sent successfully"))
      .catch((error) => console.error("Failed to send email:", error));
  }
}

export default new ForgotPassword();
