import { readFile } from "fs/promises";
import Database from "../database/database";

export default abstract class Router {
  public dir: string = "./src/html";
  public db: Database = new Database();
  public rf = readFile;

  public capitalizeWords(text: string): string {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
