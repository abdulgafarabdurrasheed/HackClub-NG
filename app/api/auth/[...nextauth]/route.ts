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
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
    };
  },
};

const handler = NextAuth({
  providers: [
    HackClubProvider,
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
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
