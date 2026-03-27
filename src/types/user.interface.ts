export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;

  role: any;
  status: any;
  phone?: string | null;

  createdAt: Date;
  updatedAt: Date;
}
