"use server";

import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveClub(clubId: string) {
  // TODO: Verify the user is a super_admin via NextAuth session

  try {
    await db.update(clubs).set({ isApproved: true }).where(eq(clubs.id, clubId));
    revalidatePath("/[locale]/admin", "page");
    revalidatePath("/[locale]/directory", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve club:", error);
    return { success: false, error: "Database error" };
  }
}

export async function deleteClub(clubId: string) {
  // TODO: Verify the user is a super_admin via NextAuth session

  try {
    await db.delete(clubs).where(eq(clubs.id, clubId));
    revalidatePath("/[locale]/admin", "page");
    revalidatePath("/[locale]/directory", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete club:", error);
    return { success: false, error: "Database error" };
  }
}
