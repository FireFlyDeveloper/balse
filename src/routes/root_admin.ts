import { Context } from "hono";
import { readFile } from "fs/promises";
import database from "../database/database";

class RootAdmin {
  private directory: string = "./src/html";
  private db = database;

  async root(c: Context): Promise<any> {
    try {
      const session = c.get("session");
      if (session.get("loggedIn") && session.get("role") === "root") {
        return c.redirect("/root");
      }
      const html = await readFile(`${this.directory}/root_admin.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getInstructors(c: Context): Promise<any> {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") != "root") {
        return c.json({ loggedIn: false });
      }

      const instructors = await this.db.getRootInstructors();

      const data = instructors.map((instructor: any) => {
        return {
          first_name: instructor.first_name,
          last_name: instructor.last_name,
          middle_name: instructor.middle_name,
        };
      });

      return c.json({
        loggedIn: true,
        data: data,
      });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}

export default new RootAdmin();
