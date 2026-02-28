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
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  // NEW FIELDS
  provinceCode: string | null;
  provinceName: string | null;
  districtCode: string | null;
  districtName: string | null;
  createdAt: string;
  updatedAt: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  fullName: string;
  password: string;
  phone: string;
  address: string;
  role?: UserRole;
  adminCode?: string;
}

export interface UpdatePayload {
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isActive?: boolean;
  // NEW FIELDS
  provinceCode?: string | null;
  districtCode?: string | null;
}
