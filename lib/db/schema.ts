import { pgTable, text, timestamp, boolean, uuid, integer, pgEnum, real } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["member", "club_leader", "state_admin", "super_admin"]);
export const memberStatusEnum = pgEnum("member_status", ["pending", "approved"]);
export const schoolTypeEnum = pgEnum("school_type", ["high_school", "university"]);
export const clubFocusEnum = pgEnum("club_focus", ["hardware", "software", "both", "other"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  hcUsername: text("hc_username"),
  role: roleEnum("role").default("member").notNull(),
  state: text("state"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clubs = pgTable("clubs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  schoolName: text("school_name").notNull(),
  schoolType: schoolTypeEnum("school_type").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  bio: text("bio"),
  meetingInfo: text("meeting_info"),
  publicEmail: text("public_email"),
  clubFocus: clubFocusEnum("club_focus").default("software").notNull(),
  memberCount: integer("member_count").default(0),
  isApproved: boolean("is_approved").default(false).notNull(),
  leaderId: uuid("leader_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clubMembers = pgTable("club_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  clubId: uuid("club_id").references(() => clubs.id).notNull(),
  status: memberStatusEnum("status").default("pending").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});
