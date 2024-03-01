import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import prismadb from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";

/**
 * handlers, auth, signIn, signOut are methods which
 * can be exported.
 */
export const {
  handlers: { GET, POST },
  auth, // This has session info
  signIn, // This use to signin the user
  signOut, // This is use to signout the user globally
} = NextAuth({
  pages: {
    // Automatically redirect to set signin page
    signIn: "/auth/login",
    // Automatically redirect to set Error page
    error: "auth/login",
  },
  events: {
    // This event will run whenever the user signup or create
    // new account
    async linkAccount({ user, account }) {
      console.log("🔗Account is Going to Linked🔗");

      await prismadb.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email Verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);
      // Prevent signin email without email verification
      if (!existingUser?.emailVerified) return false;

      //TODO: Add 2FA check
      return true;
    },
    async session({ token, session }) {
      /** Here we are extending session object by
       * including token.sub field to ensure that
       * our session have id field which is not
       * available in session object by default
       */
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        /**
         *  Here we are extending types in type folder
         * if we want to add custom field then we need
         * to types for in the type folder
         */
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      // console.log({ token });
      /**This is the actual JWT token created
       * at the time of login
       */

      // This means user is not loggedIn
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;

      return token;
    },
  },
  // ORM Adapters
  adapter: PrismaAdapter(prismadb),
  // We are using JWT token for credential Authentication
  session: { strategy: "jwt" },
  ...authConfig,
});
