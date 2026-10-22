"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { schoolRecommendations } from "@/lib/db/schema";
import { nigeriaStates } from "@/lib/nigeria-states";

const roles = new Set([
  "student",
  "teacher",
  "parent_or_guardian",
  "alumni",
  "community_member",
  "other",
]);

export async function recommendSchool(formData: FormData) {
  if (String(formData.get("website") ?? "").trim()) redirect("/recommend-school?sent=1");

  const schoolName = String(formData.get("schoolName") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const schoolType = String(formData.get("schoolType") ?? "secondary").trim();
  const recommenderRole = String(formData.get("recommenderRole") ?? "").trim();
  const why = String(formData.get("why") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "")
    .trim()
    .toLowerCase();
  const wantsVisit = formData.get("wantsVisit") === "on";
  const consentToContact = formData.get("consentToContact") === "on";

  const invalid =
    schoolName.length < 3 ||
    schoolName.length > 160 ||
    !nigeriaStates.includes(state as (typeof nigeriaStates)[number]) ||
    city.length < 2 ||
    city.length > 120 ||
    !["secondary", "community", "other"].includes(schoolType) ||
    !roles.has(recommenderRole) ||
    why.length < 8 ||
    why.length > 1200 ||
    contactName.length > 120 ||
    contactEmail.length > 254 ||
    (contactEmail !== "" &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) || !consentToContact));

  if (invalid) redirect("/recommend-school?error=details");
  if (!db) redirect("/recommend-school?error=setup");

  try {
    await db.insert(schoolRecommendations).values({
      schoolName,
      state,
      city,
      schoolType,
      recommenderRole,
      why,
      wantsVisit,
      contactName: consentToContact ? contactName || null : null,
      contactEmail: contactEmail || null,
      consentToContact,
    });
  } catch {
    redirect("/recommend-school?error=save");
  }

  redirect("/recommend-school?sent=1");
}
