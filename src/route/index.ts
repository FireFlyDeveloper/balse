import { readFile } from "fs/promises";
import Database from "../database/database";
import { Role } from "../models/types";

export default abstract class Router {
  public dir: string = "./src/html";
  public db: Database = new Database();
  public rf = readFile;

  public capitalizeWords(text: string): string {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  public isAdmin(session: any): boolean {
    return session.get("loggedIn") && session.get("role") === Role.Admin;
  }

  public isTeacher(session: any): boolean {
    return session.get("loggedIn") && session.get("role") === Role.Teacher;
  }

  public isStudent(session: any): boolean {
    return session.get("loggedIn") && session.get("role") === Role.Student;
  }
}
