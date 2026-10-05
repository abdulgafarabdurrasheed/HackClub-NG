"use server";

import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";

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

    // TODO: Use OpenStreetMap/Google Maps API to geocode the `address` into lat/long here.
    // const { lat, lng, state, city } = await geocodeAddress(address);
    // For now, we mock the geographic breakdown:
    const mockLat = 6.5244; 
    const mockLng = 3.3792;
    const mockState = "Lagos";
    const mockCity = "Lagos";

    await db.insert(clubs).values({
      name: clubName,
      schoolName: schoolName,
      schoolType: schoolType,
      address: address,
      state: mockState,
      city: mockCity,
      latitude: mockLat,
      longitude: mockLng,
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
