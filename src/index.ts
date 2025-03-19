import { Context, Hono } from "hono";
import { Session, sessionMiddleware, CookieStore } from "hono-sessions";
import { SessionDataTypes } from "./models/types";
import router from "./route/router";
import { readFile } from "fs/promises";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

const store = new CookieStore();

app.use("/static/*", serveStatic({ root: "./src/" }));
app.use("/favicon.ico", serveStatic({ path: "./src/favicon.ico" }));

app.notFound(async (c: Context) => {
  try {
    const html = await readFile("./src/html/404.html", "utf-8");
    return c.html(html, 404);
  } catch (error) {
    return c.text("404 - Page Not Found", 404);
  }
});

app.use(
  "*",
  sessionMiddleware({
    store,
    encryptionKey: process.env.ENCRYPTION_KEY,
    expireAfterSeconds: 900,
    cookieOptions: {
      sameSite: "Lax",
      path: "/",
      httpOnly: true,
    },
  }),
);

app.post("/logout", async (c: Context) => {
  const session = c.get("session");
  session.forget("id");
  session.forget("loggedIn");
  session.forget("role");
  return c.json({ message: "Logged out successfully" });
});

app.get("/", (c: Context) => {
  return c.redirect("/login");
});

app.route("/", router);

export default {
  port: 3001,
  fetch: app.fetch,
};
