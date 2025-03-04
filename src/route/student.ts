import { Context } from "hono";
import Router from ".";

class Student extends Router {
  async student(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isStudent(session)) {
        return c.redirect("/login");
      }

      const html = await this.rf(`${this.dir}/student_dashboard.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /*** STUDENTS ***/
  async getStudentById(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isStudent(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const student = await this.db.getStudentById(id);

      const data = {
        id: student.id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        date_of_birth: student.date_of_birth,
        enrollment_date: student.enrollment_date,
        department_id: student.class_id.department_id.id,
        class_name: student.class_id.class_name,
      };

      return c.json({ loggedIn: true, data: data });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /*** ENROLLMENTS ***/
  async getEnrolledCourse(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isStudent(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const courses = await this.db.getEnrollmentsByStudent(id);

      const data = courses.map((course: any) => {
        return {
          coures_id: course.course_id.id,
          course_name: course.course_id.course_name,
        };
      });

      return c.json({ loggedIn: true, data: data });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /*** GRADES ***/
  async getStudentGrades(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isStudent(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const courses = await this.db.getGradesByStudent(id);

      const data = courses.map((course: any) => {
        return {
          grade: course.grade,
          grading_period: course.grading_period,
          coures_id: course.course_id.id,
          course_name: course.course_id.course_name,
        };
      });

      return c.json({ loggedIn: true, data: data });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}

export default new Student();
