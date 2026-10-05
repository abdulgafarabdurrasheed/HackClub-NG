import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

const HackClubProvider = {
  id: "hackclub",
  name: "Hack Club",
  type: "oauth" as const,
  clientId: process.env.HACKCLUB_CLIENT_ID || "mock-client-id",
  clientSecret: process.env.HACKCLUB_CLIENT_SECRET || "mock-secret",
  authorization: "https://auth.hackclub.com/oauth/authorize?scope=openid+email+name+profile+verification_status+slack_id",
  token: "https://auth.hackclub.com/oauth/token",
  userinfo: "https://auth.hackclub.com/oauth/userinfo",
  profile(profile: any) {
    console.log("Hack Club Auth Profile Payload:", profile);
    return {
      id: profile.slack_id || profile.id || profile.email || String(Math.random()),
      name: profile.name || profile.username || "Hack Club Member",
      email: profile.email || "unknown@hackclub.com",
    };
  },
};

const handler = NextAuth({
  providers: [
    HackClubProvider,
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    /* EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }), */
  ],
  pages: {
    signIn: '/en/auth', 
  },
  callbacks: {
    async session({ session, token, user }) {
      return session;
    }
  }
});

export { handler as GET, handler as POST };
