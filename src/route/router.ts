import { Hono } from "hono";
import login from "./login";
import admin from "./admin";

const router = new Hono();

// Student Login
router.get("login", (c) => login.students_login(c));
router.post("login", (c) => login.students_api(c));

// Teacher Login
router.get("login-teacher", (c) => login.teachers_login(c));
router.post("login-teacher", (c) => login.teachers_api(c));

// Admin Login
router.get("login-admin", (c) => login.admin_login(c));
router.post("login-admin", (c) => login.admin_api(c));

// ############## Admin Routes ############## //
router.get("teachers", (c) => admin.getAllTeachers(c));
router.post("teachers", (c) => admin.createTeacher(c));

// Student Routes
router.get("students", (c) => admin.getAllStudents(c));
router.post("students", (c) => admin.createStudent(c));

// Course Routes
router.get("courses", (c) => admin.getAllCourses(c));
router.post("courses", (c) => admin.createCourse(c));

// Department Routes
router.get("departments", (c) => admin.getAllDepartments(c));
router.post("departments", (c) => admin.createDepartment(c));

// Class Routes
router.get("classes", (c) => admin.getAllClasses(c));
router.post("classes", (c) => admin.createClass(c));

export default router;
