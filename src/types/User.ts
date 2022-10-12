export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  role: "Admin" | "User";
  avatar: string | "";
  password: string | null;
};
