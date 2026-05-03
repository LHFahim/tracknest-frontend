"use server";

import { userService } from "@/services/user.service";

export async function updateMyProfile(payload: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarURL?: string;
}) {
  return userService.updateMyProfile(payload);
}
