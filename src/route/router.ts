import { Hono } from "hono";
import login from "./login";

const router = new Hono();

// Student Login
router.get("login", (c) => login.student_login(c));
router.post("login", (c) => login.student_api(c));

// Admin Login
router.get("login-admin", (c) => login.admin_login(c));
router.post("login-admin", (c) => login.admin_api(c));

// Root Login
router.get("login-root", (c) => login.root_login(c));
router.post("login-root", (c) => login.root_api(c));

export default router;
