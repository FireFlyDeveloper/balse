export type SessionDataTypes = {
  id: string;
  loggedIn: boolean;
  role: "student" | "admin" | "root" | null;
};
