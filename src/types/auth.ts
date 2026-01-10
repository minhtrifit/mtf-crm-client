export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserType {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
