export type SessionDataTypes = {
  id: string;
  loggedIn: boolean;
  role: "student" | "admin" | "root" | null;
};

export const Role = {
  Student: "student",
  Admin: "admin",
  Root: "root",
};
