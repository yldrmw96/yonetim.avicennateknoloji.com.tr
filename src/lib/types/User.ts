export interface User {
  id: number;
  email: string;
  first_name?: string;
  middle_name?: string;
  family_name?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}