import { Hono } from "hono";
import LoginAdmin from "./login_root";

const router = new Hono();

router.get("login-root", (c) => LoginAdmin.login(c));
router.post("login-root", (c) => LoginAdmin.apiLogin(c));

export default router;
