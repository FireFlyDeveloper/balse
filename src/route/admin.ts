import { Context } from "hono";
import Router from ".";

class Admin extends Router {
  /** TEACHERS **/
  async getAllTeachers(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllTeachers();

      const teachers = data.map((teacher: any) => ({
        id: teacher.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        middle_name: teacher.middle_name,
        email: teacher.email,
        department: teacher.department_id,
      }));

      return c.json({ loggedIn: true, data: teachers });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createTeacher(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id, ...data } = await c.req.json();
      const teacher = await this.db.createTeacher(id, data);

      return c.json({ loggedIn: true, data: teacher });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** STUDENTS **/
  async getAllStudents(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllStudents();

      const students = data.map((student: any) => ({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name,
        email: student.email,
        date_of_birth: student.date_of_birth,
        enrollment_date: student.enrollment_date,
        class_id: student.class_id,
      }));

      return c.json({ loggedIn: true, data: students });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createStudent(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id, ...data } = await c.req.json();
      const student = await this.db.createStudent(id, data);

      return c.json({ loggedIn: true, data: student });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** COURSES **/
  async getAllCourses(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllCourses();

      const courses = data.map((course: any) => ({
        id: course.id,
        course_name: course.course_name,
        department_id: course.department_id,
        teacher_id: course.teacher_id,
      }));

      return c.json({ loggedIn: true, data: courses });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createCourse(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id, name, departmentId } = await c.req.json();
      const course = await this.db.addCourse(id, name, departmentId);

      return c.json({ loggedIn: true, data: course });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** DEPARTMENTS **/
  async getAllDepartments(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllDepartments();

      const departments = data.map((department: any) => ({
        id: department.id,
        department_name: department.department_name,
      }));

      return c.json({ loggedIn: true, data: departments });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createDepartment(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id, name } = await c.req.json();
      const department = await this.db.addDepartment(id, name);

      return c.json({ loggedIn: true, data: department });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** CLASSES **/
  async getAllClasses(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const data = await this.db.getAllClasses();

      const classes = data.map((class_: any) => ({
        id: class_.id,
        class_name: class_.class_name,
        department_id: class_.department_id,
      }));

      return c.json({ loggedIn: true, data: classes });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async createClass(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isAdmin(session)) {
        return c.json({ loggedIn: false });
      }

      const { id, name, departmentId } = await c.req.json();
      const class_ = await this.db.addClass(id, name, departmentId);

      return c.json({ loggedIn: true, data: class_ });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}

export default new Admin();
