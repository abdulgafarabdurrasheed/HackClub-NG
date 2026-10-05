"use server";

import { db } from "@/lib/db";
import { clubMembers, clubs } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveMember(memberId: string, clubId: string) {
  try {
    // 1. Mark member as approved
    await db.update(clubMembers)
      .set({ status: "approved" })
      .where(eq(clubMembers.id, memberId));

    // 2. Increment the club's memberCount
    await db.update(clubs)
      .set({ memberCount: sql`${clubs.memberCount} + 1` })
      .where(eq(clubs.id, clubId));

    revalidatePath("/[locale]/dashboard", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve member:", error);
    return { success: false, error: "Database error" };
  }
}

export async function rejectMember(memberId: string) {
  try {
    await db.delete(clubMembers).where(eq(clubMembers.id, memberId));
    revalidatePath("/[locale]/dashboard", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject member:", error);
    return { success: false, error: "Database error" };
  }
}
