"use server";

import { userService } from "@/services/user.service";
import { updateTag } from "next/cache";

export const deleteUser = async (userId: string) => {
  const res = await userService.deleteUser(userId);

  updateTag("users");

  return res;
};

export const updateMyProfile = async (payload: {
  name?: string;
  image?: string | null;
  phone?: string | null;
}) => {
  const res = await userService.updateMyProfile(payload);

  updateTag("users");

  return res;
};
