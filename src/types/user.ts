export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface TUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

