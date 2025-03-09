import { Context } from "hono";
import Router from ".";

class Teacher extends Router {
  async teacher(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.redirect("/login-teacher");
      }

      const html = await this.rf(
        `${this.dir}/teachers_dashboard.html`,
        "utf-8",
      );
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async info(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.redirect("/login-teacher");
      }

      const html = await this.rf(`${this.dir}/teachers_info.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async student(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.redirect("/login-teacher");
      }

      const html = await this.rf(`${this.dir}/teachers_student.html`, "utf-8");
      return c.html(html);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** COURSES **/
  async getCourses(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const course = await this.db.getCourseTeacher(id);

      return c.json({ loggedIn: true, data: course });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getCoursesStudentId(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const courses = await this.db.getEnrollmentsByStudent(id);

      const data = courses.map((course: any) => {
        return {
          course_id: course.course_id.id,
          course_name: course.course_id.course_name,
        };
      });

      return c.json({ loggedIn: true, data: data });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** TEACHER ***/
  async getTeacherById(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const course = await this.db.getTeacherById(id);

      return c.json({ loggedIn: true, data: course });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** CLASSES ***/
  async getClassesDepartment(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const class_ = await this.db.getClassDepartment(id);

      return c.json({ loggedIn: true, data: class_ });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  /** STUDENTS ***/
  async getClassesStudents(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const data = await this.db.getStudentClass(id);

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

  async getStudentInfoById(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
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

  /*** GRADES ***/
  async getStudentGrades(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const student = await this.db.getGradesByStudent(id);

      return c.json({ loggedIn: true, data: student });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async addGrades(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { studentId, courseId, grade, grading_period } = await c.req.json();

      const id = `${courseId}${studentId}`;

      const student = await this.db.addGrade(
        id,
        studentId,
        courseId,
        grade,
        grading_period,
      );

      return c.json({ loggedIn: true, data: student });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async getGradesStudentId(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id } = await c.req.json();

      const courses = await this.db.getGradesByStudent(id);

      const data = courses.map((course: any) => {
        return {
          id: course.id,
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

  async updateGrades(c: Context) {
    try {
      const session = c.get("session");

      if (!this.isTeacher(session)) {
        return c.json({ loggedIn: false });
      }

      const { id, data } = await c.req.json();

      await this.db.updateGrade(id, data);

      return c.json({ loggedIn: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}

export default new Teacher();
