export const RolesEnum = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  NORMAL_USER: "NORMAL_USER", // matches backend PanelType.NORMAL_USER
} as const;

export type Role = (typeof RolesEnum)[keyof typeof RolesEnum];
