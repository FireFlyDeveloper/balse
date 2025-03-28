import { readFile } from "fs/promises";
import Database from "../database/database";
import { Role } from "../models/types";
import bcrypt from "bcrypt";
import GoogleSMTP from "../mailer/mailer";
import { randomBytes } from "crypto";

export default abstract class Router {
  public dir: string = "./src/html";
  public db: Database = new Database();
  public rf = readFile;
  public mailer: GoogleSMTP = new GoogleSMTP();

  private saltRounds: number = 10;

  public capitalizeWords(text: string): string {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
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

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  public textToNumbers(text: string): string {
    return text
      .toLowerCase()
      .split("")
      .map((c) => c.charCodeAt(0) - 96)
      .join("");
  }

  generateToken(length: number = 32): string {
    return randomBytes(length).toString("hex");
  }
}
