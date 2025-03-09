import { Context } from "hono";
import Router from ".";
import nodemailer, { SendMailOptions } from "nodemailer";

class Admin extends Router {
  // Page
  async admin(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.redirect("/login-admin");
      }

      const html = await this.rf(`${this.dir}/admin_dashboard.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async department(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.redirect("/login-admin");
      }

      const html = await this.rf(`${this.dir}/admin_department.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async student(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.redirect("/login-admin");
      }

      const html = await this.rf(`${this.dir}/admin_student.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async teacher(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.redirect("/login-admin");
      }

      const html = await this.rf(`${this.dir}/admin_teacher.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async class(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.redirect("/login-admin");
      }

      const html = await this.rf(`${this.dir}/admin_class.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** TEACHERS **/
  async getAllTeachers(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllTeachers();

      const teachers = data.map((teacher: any) => ({
        id: teacher.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        middle_name: teacher.middle_name,
        email: teacher.email,
        department_id: teacher.department_id,
      }));

      return c.json({ loggedIn: true, data: teachers });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createTeacher(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { first_name, middle_name, last_name, departmentId, email } =
        await c.req.json();

      const name_ = this.textToNumbers(
        `${first_name}${middle_name}${last_name}`
          .replace(/\s/g, "")
          .toLowerCase(),
      );

      const id = `${departmentId}${name_}`;

      const password = await this.hashPassword(
        `${this.capitalizeWords(first_name)}${this.capitalizeWords(last_name)}123`,
      );

      const data = {
        first_name,
        middle_name,
        last_name,
        department_id: departmentId,
        password_hash: password,
        email,
      };

      const teacher = await this.db.createTeacher(id, data);

      const mailOptions: SendMailOptions = {
        from: `"Balayan SHS - No Reply" <${process.env.EMAIL}>`,
        to: email,
        subject: "Your Teacher Account Credentials",
        text: `Dear ${this.capitalizeWords(first_name)} ${this.capitalizeWords(
          last_name,
        )},\n\nWelcome to Balayan SHS - Teacher Portal! Your teacher account has been successfully created. Below are your login credentials:\n\nTeacher User ID: ${id}\nPassword: ${this.capitalizeWords(
          first_name,
        )}${this.capitalizeWords(last_name)}123\n\nPlease log in to the portal using the link below and change your password immediately for security reasons.\n\nLogin Link: https://balse-portal.fireflylab.top/login-teacher.\n\nBest regards,\nBalayan SHS Admin Team`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Teacher Account Credentials</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f7fafc;
                color: #2d3748;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
              }
              .header {
                background-color: #2b6cb0;
                color: #ffffff;
                padding: 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                padding: 20px;
              }
              .content h2 {
                font-size: 20px;
                margin-bottom: 16px;
                color: #2b6cb0;
              }
              .content p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 16px;
              }
              .credentials {
                background-color: #edf2f7;
                padding: 16px;
                border-radius: 4px;
                margin-bottom: 20px;
              }
              .credentials p {
                margin: 0;
                font-size: 14px;
              }
              .footer {
                text-align: center;
                padding: 16px;
                background-color: #2b6cb0;
                color: #ffffff;
                font-size: 14px;
              }
              .footer a {
                color: #ffffff;
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Balayan SHS - Teacher Account</h1>
              </div>
              <div class="content">
                <h2>Welcome, ${this.capitalizeWords(first_name)} ${this.capitalizeWords(
                  last_name,
                )}!</h2>
                <p>Your teacher account has been successfully created. Below are your login credentials:</p>
                <div class="credentials">
                  <p><strong>Teacher ID:</strong> ${id}</p>
                  <p><strong>Password:</strong> ${this.capitalizeWords(
                    first_name,
                  )}${this.capitalizeWords(last_name)}123</p>
                </div>
                <p>Please log in to the portal using the link below and change your password immediately for security reasons.</p>
                <p><a href="https://balse-portal.fireflylab.top/login-teacher" style="color: #2b6cb0; text-decoration: none;">Login to Balayan SHS Portal</a></p>
                <p>If you have any questions or need assistance, please contact the admin team.</p>
              </div>
              <div class="footer">
                <p>Best regards,<br>Balayan SHS Admin Team</p>
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

      return c.json({ loggedIn: true, data: teacher });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getTeachersDepartment(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const department = await this.db.getDepartmentById(id);
      const teachersDepartment = await this.db.getTeachersDepartment(id);

      const teachers = teachersDepartment.map((teacher: any) => ({
        id: teacher.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        middle_name: teacher.middle_name,
        email: teacher.email,
      }));

      const data = { department_name: department.department_name, teachers };

      return c.json({ loggedIn: true, data: data });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getTeacherInfoById(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const teacher = await this.db.getTeacherById(id);

      const data = {
        id: teacher.id,
        first_name: teacher.first_name,
        middle_name: teacher.middle_name,
        last_name: teacher.last_name,
        department_id: teacher.department_id.id,
        department_name: teacher.department_id.department_name,
      };

      return c.json({ loggedIn: true, data: data });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async updateTeacher(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const {
        id,
        first_name,
        middle_name,
        last_name,
        department_id,
        department_name,
      } = await c.req.json();

      const data = {
        first_name,
        middle_name,
        last_name,
        department_id,
        department_name,
      };

      await this.db.updateTeacher(id, data);

      return c.json({ loggedIn: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** STUDENTS **/
  async getAllStudents(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllStudents();

      const students = data.map((student: any) => ({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name,
        email: student.email,
        date_of_birth: student.date_of_birth,
        enrollment_date: student.enrollment_date,
        class_id: student.class_id,
      }));

      return c.json({ loggedIn: true, data: students });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createStudent(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const {
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        lrn,
        class_id,
      } = await c.req.json();

      const password = await this.hashPassword(
        `${this.capitalizeWords(first_name)}${this.capitalizeWords(last_name)}123`,
      );

      const enrollment_date = new Date().toISOString();

      const data = {
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        password_hash: password,
        enrollment_date,
        class_id,
      };

      const student = await this.db.createStudent(lrn, data);

      return c.json({ loggedIn: true, data: student });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getStudentInfoById(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const student = await this.db.getStudentById(id);

      const data = {
        id: student.id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        date_of_birth: student.date_of_birth,
        enrollment_date: student.enrollment_date,
        department_id: student.class_id.department_id.id,
        class_name: student.class_id.class_name,
      };

      return c.json({ loggedIn: true, data: data });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getStudentsClass(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const data = await this.db.getStudentClass(id);

      const students = data.map((student: any) => ({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name,
        email: student.email,
        date_of_birth: student.date_of_birth,
        enrollment_date: student.enrollment_date,
        class_id: student.class_id,
      }));

      return c.json({ loggedIn: true, data: students });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** COURSES **/
  async getAllCourses(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllCourses();

      const courses = data.map((course: any) => ({
        id: course.id,
        course_name: course.course_name,
        department_id: course.department_id,
        teacher_id: course.teacher_id,
      }));

      return c.json({ loggedIn: true, data: courses });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createCourse(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { name, departmentId, teacher_id } = await c.req.json();

      const name_ = this.textToNumbers(`${name}`);
      const id = `${departmentId}${name_}`;

      const course = await this.db.addCourse(
        id,
        name,
        departmentId,
        teacher_id,
      );

      return c.json({ loggedIn: true, data: course });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getCourseDepartment(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const course = await this.db.getCourseDepartment(id);

      return c.json({ loggedIn: true, data: course });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getCourseTeacher(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const course = await this.db.getCourseTeacher(id);

      return c.json({ loggedIn: true, data: course });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** DEPARTMENTS **/
  async getAllDepartments(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllDepartments();

      const departments = data.map((department: any) => ({
        id: department.id,
        department_name: department.department_name,
      }));

      return c.json({ loggedIn: true, data: departments });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createDepartment(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { name } = await c.req.json();

      const id = this.textToNumbers(name.replace(/\s/g, "").toLowerCase());

      const department = await this.db.addDepartment(id, name);

      return c.json({ loggedIn: true, data: department });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** CLASSES **/
  async getAllClasses(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllClasses();

      const classes = data.map((class_: any) => ({
        id: class_.id,
        class_name: class_.class_name,
        department_id: class_.department_id,
      }));

      return c.json({ loggedIn: true, data: classes });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createClass(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { name, departmentId } = await c.req.json();

      const name_ = this.textToNumbers(name.replace(/\s/g, "").toLowerCase());
      const id = `${departmentId}${name_}`;

      const class_ = await this.db.addClass(id, name, departmentId);

      return c.json({ loggedIn: true, data: class_ });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getClassesDepartment(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const class_ = await this.db.getClassDepartment(id);

      return c.json({ loggedIn: true, data: class_ });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /*** ENROLL ***/
  async enrollStudent(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { studentId, courseId } = await c.req.json();

      const id = `${studentId}${courseId}`;

      const enrolled = await this.db.enrollStudent(id, studentId, courseId);

      return c.json({ loggedIn: true, data: enrolled });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getEnrollCourse(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const courses = await this.db.getEnrolledByStudentId(id);

      return c.json({ loggedIn: true, data: courses });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async deleteCourse(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const enroll = await this.db.getEnrollmentsByCourse(id);

      const data = enroll.map((id: any) => {
        return `${id.id}`;
      });

      await this.db.deleteCourse(id);
      await this.db.deleteEnrollments(data);

      return c.json({ loggedIn: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async deleteEnrollment(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      await this.db.deleteEnrollment(id);

      return c.json({ loggedIn: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}

export default new Admin();
