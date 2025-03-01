import { Role } from "../models/types";
import { Context } from "hono";
import Router from ".";

class Login extends Router {
  async students_login(c: Context) {
    try {
      const session = c.get("session");

      if (this.isStudent(session)) {
        return c.redirect("/student");
      }

      const html = await this.rf(`${this.dir}/student_login.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async teachers_login(c: Context) {
    try {
      const session = c.get("session");

      if (this.isTeacher(session)) {
        return c.redirect("/teacher");
      }

      const html = await this.rf(`${this.dir}/teachers_login.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async admin_login(c: Context) {
    try {
      const session = c.get("session");

      if (this.isAdmin(session)) {
        return c.redirect("/admin");
      }

      const html = await this.rf(`${this.dir}/admin_login.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async students_api(c: Context) {
    try {
      const body = await c.req.json();
      const { id, password } = body;

      if (!id || !password) {
        return c.json(
          { success: false, message: "Username and password are required" },
          400,
        );
      }

      const user = await this.db.getStudentById(`${id}`);

      if (user && await this.verifyPassword(password, user.password_hash)) {
        const session = c.get("session");
        session.set("id", id);
        session.set("loggedIn", true);
        session.set("role", Role.Student);
        return c.redirect("/student");
      }

      return c.json(
        { success: false, message: "Invalid username or password" },
        401,
      );
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async teachers_api(c: Context) {
    try {
      const body = await c.req.json();
      const { id, password } = body;

      if (!id || !password) {
        return c.json(
          { success: false, message: "Username and password are required" },
          400,
        );
      }

      const user = await this.db.getTeacherById(`${id}`);

      if (user && await this.verifyPassword(password, user.password_hash)) {
        const session = c.get("session");
        session.set("id", id);
        session.set("loggedIn", true);
        session.set("role", Role.Teacher);
        return c.redirect("/teacher");
      }

      return c.json(
        { success: false, message: "Invalid username or password" },
        401,
      );
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async admin_api(c: Context) {
    try {
      const body = await c.req.json();
      const { id, password } = body;

      if (!id || !password) {
        return c.json(
          { success: false, message: "Username and password are required" },
          400,
        );
      }

      const user = await this.db.getAdminById(`${id}`);

      if (user && await this.verifyPassword(password, user.password_hash)) {
        const session = c.get("session");
        session.set("id", id);
        session.set("loggedIn", true);
        session.set("role", Role.Admin);
        return c.redirect("/admin");
      }

      return c.json(
        { success: false, message: "Invalid username or password" },
        401,
      );
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}

export default new Login();
