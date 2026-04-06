export type ItemStatus = "LOST" | "FOUND" | "CLAIMED";

export type ItemCategory =
  | "ELECTRONICS"
  | "CLOTHING"
  | "ACCESSORIES"
  | "DOCUMENTS"
  | "KEYS"
  | "BAGS"
  | "OTHER";

export interface IItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  image?: string | null;
  reportedBy: string;
  reporterName?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
