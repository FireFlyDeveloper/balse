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

  async getStudentById(studentId: string) {
    return await this.client.db.Students.read(studentId, [
      "email",
      "first_name",
      "middle_name",
      "last_name",
      "date_of_birth",
      "enrollment_date",
      "class_id",
    ]);
  }
  async getStudentPasswordById(studentId: string) {
    return await this.client.db.Students.read(studentId, ["password_hash"]);
  }

  async getAllStudents() {
    return await this.client.db.Students.getAll();
  }

  async updateStudent(studentId: string, data: any) {
    return await this.client.db.Students.update(studentId, data);
  }

  async deleteStudent(studentId: string) {
    return await this.client.db.Students.delete(studentId);
  }

  async getStudentClass(class_id: string) {
    return await this.client.db.Students.filter({
      class_id: class_id,
    }).getAll();
  }

  /** TEACHERS **/
  async createTeacher(id: string, data: any) {
    return await this.client.db.Teachers.create(id, data);
  }

  async getTeacherById(teacherId: string) {
    return await this.client.db.Teachers.read(teacherId, [
      "email",
      "first_name",
      "middle_name",
      "last_name",
      "department_id",
    ]);
  }

  async getTeacherByID(teacherId: string) {
    return await this.client.db.Teachers.read(teacherId);
  }

  async getAllTeachers() {
    return await this.client.db.Teachers.getAll();
  }

  async updateTeacher(teacherId: string, data: any) {
    return await this.client.db.Teachers.update(teacherId, data);
  }

  async deleteTeacher(teacherId: string) {
    return await this.client.db.Teachers.delete(teacherId);
  }

  async getTeachersDepartment(department_id: string) {
    return await this.client.db.Teachers.filter({
      department_id: department_id,
    }).getAll();
  }

  async getTeacherPasswordById(teacherId: string) {
    return await this.client.db.Teachers.read(teacherId, ["password_hash"]);
  }

  /** COURSES **/
  async addCourse(
    id: string,
    name: string,
    departmentId: string,
    teacher_id: string,
  ) {
    return await this.client.db.Courses.create(id, {
      course_name: name,
      department_id: departmentId,
      teacher_id: teacher_id,
    });
  }

  async getCourseById(courseId: string) {
    return await this.client.db.Courses.read(courseId);
  }

  async getAllCourses() {
    return await this.client.db.Courses.getAll();
  }

  async updateCourse(courseId: string, data: any) {
    return await this.client.db.Courses.update(courseId, data);
  }

  async deleteCourse(courseId: string) {
    return await this.client.db.Courses.delete(courseId);
  }

  async getCourseDepartment(department_id: string) {
    return await this.client.db.Courses.filter({
      department_id: department_id,
    }).getAll();
  }

  async getCourseTeacher(teacher_id: string) {
    return await this.client.db.Courses.filter({
      teacher_id: teacher_id,
    }).getAll();
  }

  /** DEPARTMENTS **/
  async addDepartment(id: string, name: string) {
    return await this.client.db.Departments.create(id, {
      department_name: name,
    });
  }

  async getDepartmentById(departmentId: string) {
    return await this.client.db.Departments.read(departmentId);
  }

  async getAllDepartments() {
    return await this.client.db.Departments.getAll();
  }

  async updateDepartment(departmentId: string, data: any) {
    return await this.client.db.Departments.update(departmentId, data);
  }

  async deleteDepartment(departmentId: string) {
    return await this.client.db.Departments.delete(departmentId);
  }

  /** CLASSES **/
  async addClass(id: string, name: string, departmentId: string) {
    return await this.client.db.Classes.create(id, {
      class_name: name,
      department_id: departmentId,
    });
  }

  async getClassById(classId: string) {
    return await this.client.db.Classes.read(classId);
  }

  async getAllClasses() {
    return await this.client.db.Classes.getAll();
  }

  async updateClass(classId: string, data: any) {
    return await this.client.db.Classes.update(classId, data);
  }

  async deleteClass(classId: string) {
    return await this.client.db.Classes.delete(classId);
  }

  async getClassDepartment(department_id: string) {
    return await this.client.db.Classes.select(["class_name", "department_id"])
      .filter({
        department_id: department_id,
      })
      .getAll();
  }

  /** ENROLLMENTS **/
  async enrollStudent(id: string, studentId: string, courseId: string) {
    return await this.client.db.Enrollments.create(id, {
      student_id: studentId,
      course_id: courseId,
      enrollment_date: new Date().toISOString(),
    });
  }

  async getEnrollmentsByStudent(studentId: string) {
    return await this.client.db.Enrollments.select([
      "course_id",
      "course_id.teacher_id",
    ])
      .filter({
        student_id: studentId,
      })
      .getAll();
  }

  async getEnrollmentsByCourse(courseId: string) {
    return await this.client.db.Enrollments.filter({
      course_id: courseId,
    }).getAll();
  }

  async getEnrolledByStudentId(studentId: string) {
    return await this.client.db.Enrollments.select([
      "course_id",
      "enrollment_date",
    ])
      .filter({ student_id: studentId })
      .getAll();
  }

  async deleteEnrollments(enrollmentId: string[]) {
    return await this.client.db.Enrollments.delete(enrollmentId);
  }

  async deleteEnrollment(enrollmentId: string) {
    return await this.client.db.Enrollments.delete(enrollmentId);
  }

  /** GRADES **/
  async addGrade(
    id: string,
    studentId: string,
    courseId: string,
    grade: number,
    gradingPeriod: string,
  ) {
    return await this.client.db.Grades.create(id, {
      student_id: studentId,
      course_id: courseId,
      grade,
      grading_period: gradingPeriod,
      date_recorded: new Date().toISOString(),
    });
  }

  async getGradesByStudent(studentId: string) {
    return await this.client.db.Grades.select([
      "course_id",
      "grade",
      "grading_period",
    ])
      .filter({
        student_id: studentId,
      })
      .getAll();
  }

  async getGradesByCourse(courseId: string) {
    return await this.client.db.Grades.filter({
      course_id: courseId,
    }).getAll();
  }

  async updateGrade(gradeId: string, data: any) {
    return await this.client.db.Grades.update(gradeId, data);
  }

  async deleteGrade(gradeId: string) {
    return await this.client.db.Grades.delete(gradeId);
  }

  /** ADMINISTRATORS **/
  async createAdmin(id: string, data: any) {
    return await this.client.db.Admins.create(id, data);
  }

  async getAdminById(adminId: string) {
    return await this.client.db.Admins.read(adminId);
  }

  async getAllAdmins() {
    return await this.client.db.Admins.getAll();
  }

  async updateAdmin(adminId: string, data: any) {
    return await this.client.db.Admins.update(adminId, data);
  }

  async deleteAdmin(adminId: string) {
    return await this.client.db.Admins.delete(adminId);
  }

  async getAdminPasswordById(adminId: string) {
    return await this.client.db.Admins.read(adminId, ["password_hash"]);
  }

  /** UTILITY METHODS **/
  async calculateStudentAverage(studentId: string) {
    const grades = await this.getGradesByStudent(studentId);
    const total = grades.reduce(
      (sum: number, grade: any) => sum + grade.grade,
      0,
    );
    return total / grades.length;
  }
}
