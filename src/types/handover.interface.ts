export interface IHandover {
  id: string;
  foundItem: string;       // MongoDB ObjectId ref to FoundItemEntity
  receivedByUser: string;  // MongoDB ObjectId ref to UserEntity (owner/claimant)
  handedOverBy: string;    // MongoDB ObjectId ref to UserEntity (staff)
  verificationMethod?: string;
  note?: string;
  handedOverAt: string;    // ISO date string
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHandoverPaginated {
  items: IHandover[];
  pagination: {
    total: number;
    current: number;
    next: number;
    previous: number;
  };
}
