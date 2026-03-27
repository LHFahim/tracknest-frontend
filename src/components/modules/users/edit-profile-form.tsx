"use client";

import { updateMyProfile } from "@/actions/users.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function EditProfileForm({
  initialName,
  initialPhone,
  initialImage,
}: {
  initialName?: string | null;
  initialPhone?: string | null;
  initialImage?: string | null;
}) {
  const [name, setName] = useState(initialName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [image, setImage] = useState(initialImage ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload: {
      name?: string;
      phone?: string | null;
      image?: string | null;
    } = {};

    if (name.trim()) payload.name = name.trim();
    payload.phone = phone.trim() === "" ? null : phone.trim();
    payload.image = image.trim() === "" ? null : image.trim();

    const toastId = toast.loading("Updating profile...");
    setIsSubmitting(true);

    try {
      const res = await updateMyProfile(payload);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Profile updated successfully", { id: toastId });
    } catch (err) {
      toast.error("Something Went Wrong", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
        <CardFooter className="mt-5">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
