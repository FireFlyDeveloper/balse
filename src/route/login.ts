import { Role } from "../models/types";
import { Context } from "hono";
import Router from ".";

class Login extends Router {
  async student_login(c: Context) {
    try {
      const session = c.get("session");
      if (!session.get("loggedIn") || session.get("role") !== Role.Student) {
        return c.redirect("/login");
      }

      const html = await this.rf(`${this.dir}/student_login.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async admin_login(c: Context) {
    try {
      const session = c.get("session");
      if (!session.get("loggedIn") || session.get("role") !== Role.Admin) {
        return c.redirect("/login-admin");
      }

      const html = await this.rf(`${this.dir}/admin_login.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async root_login(c: Context) {
    try {
      const session = c.get("session");
      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.redirect("/login-root");
      }

      const html = await this.rf(`${this.dir}/root_login.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async student_api(c: Context) {
    try {
      const body = await c.req.json();
      const { id, password } = body;

      if (!id || !password) {
        return c.json(
          { success: false, message: "Username and password are required" },
          400,
        );
      }

      const user = await this.db.getUserById(`${id}`);

      if (user && password === user.password) {
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

      const user = await this.db.getUserById(`${id}`);

      if (user && password === user.password) {
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

  async root_api(c: Context) {
    try {
      const body = await c.req.json();
      const { id, password } = body;

      if (!id || !password) {
        return c.json(
          { success: false, message: "Username and password are required" },
          400,
        );
      }

      const user = await this.db.getUserById(`${id}`);

      if (user && password === user.password) {
        const session = c.get("session");
        session.set("id", id);
        session.set("loggedIn", true);
        session.set("role", Role.Root);
        return c.redirect("/root");
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
