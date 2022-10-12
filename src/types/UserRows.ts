import { User } from "./User";

export type UserRows = {
  count: number;
  rows: User[];
  pageSize: number;
  page: number;
};
