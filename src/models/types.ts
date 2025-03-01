export type SessionDataTypes = {
  id: string;
  loggedIn: boolean;
  role: "student" | "teacher" | "admin" | null;
};

export const Role = {
  Student: "student",
  Teacher: "teacher",
  Admin: "admin",
};
