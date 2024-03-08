import NextAuth from "next-auth";
import {database} from "@/lib/database";
import {PrismaAdapter} from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import {UserRole} from "@prisma/client";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    update,
} = NextAuth({
    pages: {
        signIn: "/login",
        error: "/error",
    },
    events: {
        async linkAccount({ user }) {
            await database.user.update({
                where: { id: user.id || ""},
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            if (session.user) {
                session.user.name = token.name;
                session.user.surname = token.surname;
                session.user.email = token.email;
                session.user.bio = token.bio;
                session.user.avatar = token.avatar;
                session.user.password = token.password;
                session.user.isOAuth = token.isOAuth as boolean;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await database.user.findUnique({ where: { id: token.sub } });

            if (!existingUser) return token;

            const existingAccount = await database.account.findFirst({
                where: { userId: existingUser.id }
            });

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.surname = existingUser.surname;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.avatar = existingUser.avatar;
            token.id = existingUser.id;
            token.bio = existingUser.bio;
            token.password = existingUser.password;

            return token;
        }
    },
    adapter: PrismaAdapter(database),
    session: { strategy: "jwt" },
    ...authConfig,
});