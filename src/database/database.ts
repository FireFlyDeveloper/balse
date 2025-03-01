import { getXataClient } from "./xata";

export default class Database {
  private client: any;

  constructor() {
    this.client = getXataClient();
  }

  /** USERS **/
  async getUserById(id: string) {
    return await this.client.db.Users.read(id);
  }

  async createUser(data: any) {
    return await this.client.db.Users.create(`${data.username}`, data);
  }

  /** TEACHERS **/
  async getAllTeachers() {
    return await this.client.db.Teachers.getAll();
  }

  async assignTeacherToSubject(
    teacherId: string,
    subjectId: string,
    sectionId: string,
  ) {
    return await this.client.db.Teacher_Subjects.create({
      teacher_id: teacherId,
      subject_id: subjectId,
      section_id: sectionId,
    });
  }

  /** STUDENTS **/
  async getAllStudents() {
    return await this.client.db.Students.getAll();
  }

  async enrollStudent(studentId: string, subjectId: string, teacherId: string) {
    return await this.client.db.Student_Subjects.create({
      student_id: studentId,
      subject_id: subjectId,
      teacher_id: teacherId,
    });
  }

  /** SUBJECTS **/
  async getAllSubjects() {
    return await this.client.db.Subjects.getAll();
  }

  async addSubject(name: string, description: string) {
    return await this.client.db.Subjects.create({ name, description });
  }

  /** SECTIONS **/
  async getAllSections() {
    return await this.client.db.Sections.getAll();
  }

  async addSection(name: string, yearLevel: number) {
    return await this.client.db.Sections.create({
      name,
      year_level: yearLevel,
    });
  }

  /** GRADES **/
  async addGrade(
    studentId: string,
    subjectId: string,
    teacherId: string,
    grade: number,
  ) {
    return await this.client.db.Grades.create({
      student_id: studentId,
      subject_id: subjectId,
      teacher_id: teacherId,
      grade,
    });
  }

  async getStudentGrades(studentId: string) {
    return await this.client.db.Grades.filter({
      student_id: studentId,
    }).getAll();
  }

  async calculateStudentAverage(studentId: string) {
    const grades = await this.getStudentGrades(studentId);
    const avg =
      grades.reduce((sum: number, record: any) => sum + record.grade, 0) /
      grades.length;
    return await this.client.db.Student_Averages.create({
      student_id: studentId,
      average_grade: avg,
    });
  }
}
