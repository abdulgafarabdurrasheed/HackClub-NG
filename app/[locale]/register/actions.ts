"use server";

import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";

export async function submitClubApplication(formData: FormData) {
  try {
    const clubName = formData.get("clubName") as string;
    const schoolName = formData.get("schoolName") as string;
    const schoolType = formData.get("schoolType") as "high_school" | "university";
    const state = formData.get("state") as string;
    const city = formData.get("city") as string;
    const meetingInfo = formData.get("meetingInfo") as string;
    const bio = formData.get("bio") as string;

    if (!clubName || !schoolName || !state || !city) {
      return { success: false, error: "Missing required fields" };
    }

    // Insert into PostgreSQL using Drizzle
    await db.insert(clubs).values({
      name: clubName,
      schoolName: schoolName,
      schoolType: schoolType,
      state: state,
      city: city,
      meetingInfo: meetingInfo,
      bio: bio,
      isApproved: false, // Requires admin approval
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to insert club:", error);
    return { success: false, error: "Database error occurred" };
  }
}
