import { getXataClient } from "./xata";

export default class Database {
  private client: any;

  constructor() {
    this.client = getXataClient();
  }

  /** STUDENTS **/
  async createStudent(id: string, data: any) {
    return await this.client.db.Students.create(id, data);
  }

  async getAllStudents() {
    return await this.client.db.Students.getAll();
  }

  /** TEACHERS **/
  async createTeacher(id: string, data: any) {
    return await this.client.db.Teachers.create(id, data);
  }

  async getAllTeachers() {
    return await this.client.db.Teachers.getAll();
  }

  /** COURSES **/
  async addCourse(id: string, name: string, departmentId: string) {
    return await this.client.db.Courses.create(id, {
      course_name: name,
      department_id: departmentId
    });
  }

  /** DEPARTMENTS **/
  async addDepartment(id: string, name: string) {
    return await this.client.db.Departments.create(id, {
      department_name: name
    });
  }

  /** CLASSES **/
  async addClass(id: string, name: string, departmentId: string) {
    return await this.client.db.Classes.create(id, {
      class_name: name,
      department_id: departmentId
    });
  }

  /** ENROLLMENTS **/
  async enrollStudent(id: string, studentId: string, courseId: string) {
    return await this.client.db.Enrollments.create(id, {
      student_id: studentId,
      course_id: courseId,
      enrollment_date: new Date().toISOString()
    });
  }

  /** GRADES **/
  async addGrade(id: string, studentId: string, courseId: string, grade: number, gradingPeriod: string) {
    return await this.client.db.Grades.create(id, {
      student_id: studentId,
      course_id: courseId,
      grade,
      grading_period: gradingPeriod,
      date_recorded: new Date().toISOString()
    });
  }

  /** ADMINISTRATORS **/
  async createAdmin(id: string, data: any) {
    return await this.client.db.Admins.create(id, data);
  }

  /** UTILITY METHODS **/
  async calculateStudentAverage(studentId: string) {
    const grades = await this.client.db.Grades
      .filter({ student_id: studentId })
      .getAll();
      
    const total = grades.reduce((sum: number, grade: any) => sum + grade.grade, 0);
    return total / grades.length;
  }
}