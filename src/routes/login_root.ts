import { Context } from "hono";
import { readFile } from "fs/promises";
import database from "../database/database";

class LoginAdmin {
  private directory: string = "./src/html";
  private db = database;

  async login(c: Context): Promise<any> {
    try {
      const session = c.get("session");
      if (session.get("loggedIn") && session.get("role") === "root") {
        return c.redirect("/root");
      }
      const html = await readFile(`${this.directory}/root_login.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async apiLogin(c: Context): Promise<any> {
    try {
      const body = await c.req.json();
      const { id, password } = body;

      console.log(body);

      if (!id || !password) {
        return c.json(
          { success: false, message: "Username and password are required" },
          400,
        );
      }

      const admin = await this.db.getRootAdmin(`${id}`);
      if (admin && password === admin.password) {
        const session = c.get("session");
        session.set("id", id);
        session.set("loggedIn", true);
        session.set("role", "root");
        return c.redirect("/root");
      }
      return c.json(
        { success: false, message: "Invalid username or password" },
        401,
      );
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" });
    }
  }
}

export default new LoginAdmin();
