export const RolesEnum = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  USER: "USER",
} as const;

export type Role = (typeof RolesEnum)[keyof typeof RolesEnum];
