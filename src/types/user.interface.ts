export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarURL?: string;
  panelType: string;
  isActive: boolean;
  isDeleted: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserPaginated {
  items: IUser[];
  pagination: {
    total: number;
    current: number;
    next: number;
    previous: number;
  };
}
