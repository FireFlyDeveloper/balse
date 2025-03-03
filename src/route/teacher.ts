import { Context } from "hono";
import Router from ".";

class Teacher extends Router {
  async teacher(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.redirect("/login-teacher");
      }

      const html = await this.rf(
        `${this.dir}/teachers_dashboard.html`,
        "utf-8",
      );
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async class(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.redirect("/login-teacher");
      }

      const html = await this.rf(`${this.dir}/teachers_class.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async student(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.redirect("/login-teacher");
      }

      const html = await this.rf(`${this.dir}/teachers_student.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** COURSES **/
  async getCourses(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
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

  /** TEACHER ***/
  async getTeacherById(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const course = await this.db.getTeacherById(id);

      return c.json({ loggedIn: true, data: course });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** CLASSES ***/
  async getClassesDepartment(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
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

  /** STUDENTS ***/
  async getClassesStudents(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
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
}

export default new Teacher();
