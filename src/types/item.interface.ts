export interface GPSLocation {
  latitude: number;
  longitude: number;
}

// ─── Lost Item ────────────────────────────────────────────────────────────────

export enum LostItemStatus {
  OPEN = "OPEN",
  CLAIM_REQUESTED = "CLAIM_REQUESTED",
  CLAIM_APPROVED = "CLAIM_APPROVED",
  CLAIM_REJECTED = "CLAIM_REJECTED",
  CLOSED = "CLOSED",
}

export interface ILostItem {
  id: string;
  title: string;
  description: string;
  locationLost?: string;
  gpsLocation?: GPSLocation;
  category: string; // MongoDB ObjectId ref to CategoryEntity
  brand?: string;
  color?: string;
  dateLost: string; // ISO 8601 date string from backend (@IsDateString)
  status: LostItemStatus;
  imageURL?: string;
  createdBy: string; // MongoDB ObjectId ref to UserEntity
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Found Item ───────────────────────────────────────────────────────────────

export enum FoundItemStatus {
  REPORTED = "REPORTED",
  IN_CUSTODY = "IN_CUSTODY",
  READY_FOR_HANDOVER = "READY_FOR_HANDOVER",
  RETURNED = "RETURNED",
  UNCLAIMED = "UNCLAIMED",
  DISPOSED = "DISPOSED",
}

export enum CustodyType {
  USER = "USER",
  OFFICE = "OFFICE",
}

export interface IFoundItem {
  id: string;
  title: string;
  description: string;
  category: string; // MongoDB ObjectId ref to CategoryEntity
  brand?: string;
  color?: string;
  dateFound: string; // ISO 8601 date string from backend (@IsDateString)
  locationFound?: string;
  gpsLocation?: GPSLocation;
  custodyType: CustodyType;
  status: FoundItemStatus;
  images: string[];
  identifyingDetails?: string;
  foundBy: string; // MongoDB ObjectId ref to UserEntity
  isPublic: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface IPagination {
  total: number;
  current: number;
  next: number;
  previous: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  pagination: IPagination;
}

/** Type guard — distinguishes lost from found items at runtime */
export function isLostItem(item: ILostItem | IFoundItem): item is ILostItem {
  return "dateLost" in item;
}
