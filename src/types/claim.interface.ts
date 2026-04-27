import { IPaginatedResponse } from "./item.interface";

export enum ClaimStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

export interface IClaim {
  id: string;
  message: string;
  foundItemId: string;
  lostItemId?: string;
  claimedBy: string;
  images: string[];
  reviewedBy?: string;
  reviewComment?: string;
  reviewDate?: string;
  status: ClaimStatus;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type IClaimPaginated = IPaginatedResponse<IClaim>;
