import { Role } from "../models/types";
import { Context } from "hono";
import Router from ".";

class Root extends Router {
  async get_all_teachers(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const teachers = await this.db.getAllTeachers();

      return c.json({ loggedIn: true, data: teachers });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async get_all_students(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const students = await this.db.getAllStudents();

      return c.json({ loggedIn: true, data: students });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async get_all_subjects(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const subjects = await this.db.getAllSubjects();

      return c.json({ loggedIn: true, data: subjects });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async get_all_sections(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const sections = await this.db.getAllSections();

      return c.json({ loggedIn: true, data: sections });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async create_user(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const body = await c.req.json();
      const { id, password, role } = body;

      const data = {
        username: id,
        password,
        role: role == Role.Admin ? Role.Admin : Role.Student,
      };

      await this.db.createUser(data);

      return c.json({ success: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async assign_teacher_to_subject(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const body = await c.req.json();
      const { teacherId, subjectId, sectionId } = body;

      await this.db.assignTeacherToSubject(teacherId, subjectId, sectionId);

      return c.json({ success: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async enroll_student(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const body = await c.req.json();
      const { studentId, subjectId, teacherId } = body;

      await this.db.enrollStudent(studentId, subjectId, teacherId);

      return c.json({ success: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async add_subject(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const body = await c.req.json();
      const { name, description } = body;

      await this.db.addSubject(name, description);

      return c.json({ success: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  async add_section(c: Context) {
    try {
      const session = c.get("session");

      if (!session.get("loggedIn") || session.get("role") !== Role.Root) {
        return c.json({ loggedIn: false });
      }

      const body = await c.req.json();
      const { name, yearLevel } = body;

      await this.db.addSection(name, yearLevel);

      return c.json({ success: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  // To do Grades
}

export default new Root();
