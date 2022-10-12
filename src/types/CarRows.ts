import { Car } from "./Car";

export type CarRows = {
  count: number;
  rows: Car[];
  pageSize: number;
  page: number;
};
