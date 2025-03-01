import { Hono } from "hono";
import login from "./login";

const router = new Hono();

// Student Login
router.get("login", (c) => login.students_login(c));
router.post("login", (c) => login.students_api(c));

// Admin Login
router.get("login-teacher", (c) => login.teachers_login(c));
router.post("login-teacher", (c) => login.teachers_api(c));

// Root Login
router.get("login-admin", (c) => login.admin_login(c));
router.post("login-admin", (c) => login.admin_api(c));

export default router;
