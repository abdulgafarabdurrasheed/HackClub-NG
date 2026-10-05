"use server";

import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { geocodeAddress, calculateDistance } from "@/lib/geocoding";

export type SearchResult = {
  id: string;
  name: string;
  schoolName: string;
  schoolType: string;
  address: string | null;
  meetingInfo: string | null;
  bio: string | null;
  distanceKm: number;
};

export async function searchNearestClubs(query: string) {
  if (!query) return { success: false, error: "Empty query" };

  try {
    // 1. Geocode the user's search query
    const userCoords = await geocodeAddress(query);
    if (!userCoords) {
      return { success: false, error: "Could not locate that address." };
    }

    // 2. Fetch all approved clubs from the database
    const allClubs = await db.select().from(clubs).where(eq(clubs.isApproved, true));

    // 3. Calculate Haversine distance for each club
    const clubsWithDistance: SearchResult[] = allClubs
      .filter(c => c.latitude !== null && c.longitude !== null)
      .map(c => ({
        id: c.id,
        name: c.name,
        schoolName: c.schoolName,
        schoolType: c.schoolType,
        address: c.address,
        meetingInfo: c.meetingInfo,
        bio: c.bio,
        distanceKm: calculateDistance(
          userCoords.lat, 
          userCoords.lng, 
          c.latitude as number, 
          c.longitude as number
        )
      }));

    // 4. Sort by closest distance
    clubsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    return { 
      success: true, 
      userCoords,
      results: clubsWithDistance 
    };

  } catch (error) {
    console.error("Search failed:", error);
    return { success: false, error: "An error occurred during search." };
  }
}
