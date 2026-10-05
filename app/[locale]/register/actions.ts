"use server";

import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";
import { geocodeAddress } from "@/lib/geocoding";

export async function submitClubApplication(formData: FormData) {
  try {
    const clubName = formData.get("clubName") as string;
    const schoolName = formData.get("schoolName") as string;
    const schoolType = formData.get("schoolType") as "high_school" | "university";
    const address = formData.get("address") as string;
    const meetingInfo = formData.get("meetingInfo") as string;
    const bio = formData.get("bio") as string;

    if (!clubName || !schoolName || !address) {
      return { success: false, error: "Missing required fields" };
    }

    // Convert string address to actual coordinates using OpenStreetMap
    const coords = await geocodeAddress(address);
    if (!coords) {
      return { success: false, error: "Could not find that address on the map. Please be more specific." };
    }

    await db.insert(clubs).values({
      name: clubName,
      schoolName: schoolName,
      schoolType: schoolType,
      address: address,
      state: "Nigeria", // Legacy field, keeping for schema compatibility
      city: "Nigeria",  // Legacy field
      latitude: coords.lat,
      longitude: coords.lng,
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
