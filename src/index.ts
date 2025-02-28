import { Context, Hono } from "hono";
import { Session, sessionMiddleware, CookieStore } from "hono-sessions";
import { SessionDataTypes } from "./models/types";
import router from "./routes/router";

const app = new Hono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

const store = new CookieStore();

app.use(
  "*",
  sessionMiddleware({
    store,
    encryptionKey: process.env.ENCRYPTION_KEY,
    expireAfterSeconds: 300,
    cookieOptions: {
      sameSite: "Lax",
      path: "/",
      httpOnly: true,
    },
  }),
);

app.route("/", router);

app.post("/logout", async (c: Context) => {
  const session = c.get("session");
  session.forget("id");
  session.forget("loggedIn");
  session.forget("role");
  return c.redirect("/login");
});

app.get("/", (c: Context) => {
  return c.redirect("/login");
});

export default {
  port: 3001,
  fetch: app.fetch,
};
