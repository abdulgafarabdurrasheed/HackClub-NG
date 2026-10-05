import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "hackclub",
      name: "Hack Club",
      type: "oauth",
      wellKnown: "https://auth.hackclub.com/.well-known/openid-configuration",
      clientId: process.env.HACKCLUB_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.HACKCLUB_CLIENT_SECRET || "mock-secret",
      authorization: {
        params: { scope: "openid email name profile verification_status slack_id" },
      },
      profile(profile: any) {
        return {
          id: profile.slack_id || profile.sub || profile.id || profile.email || String(Math.random()),
          name: profile.name || profile.username || "Hack Club Member",
          email: profile.email || "unknown@hackclub.com",
        };
      },
    }
  ],
  pages: {
    signIn: '/en/auth', 
  },
};
