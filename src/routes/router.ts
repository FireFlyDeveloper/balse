import { Hono } from "hono";
import LoginAdmin from "./login_root";
import RootAdmin from "./root_admin";

const router = new Hono();

router.get("login-root", (c) => LoginAdmin.login(c));
router.post("login-root", (c) => LoginAdmin.apiLogin(c));
router.get("root", (c) => RootAdmin.root(c));
router.post("instructors", (c) => RootAdmin.getInstructors(c));

export default router;
