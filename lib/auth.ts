// // lib/auth.ts
// import NextAuth, { NextAuthOptions } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),

//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//           include: { role: true },
//         });

//         if (!user || !user.password) return null;

//         const valid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!valid) return null;

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role.name,
          
//         } as any;
//       },
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   session: {
//     strategy: "database",
//   },

//   pages: {
//     signIn: "/login",
//   },

//   callbacks: {
//   async jwt({ token, user }) {
//     // Only attach role when we actually have a user
//     if (user?.email) {
//       const dbUser = await prisma.user.findUnique({
//         where: { email: user.email },
//         include: { role: true },
//       });

//       if (dbUser?.role?.name) {
//         token.role = dbUser.role.name;
//       }
//     }

//     return token;
//   },

//   async session({ session, token }) {
//     // session.user ALWAYS exists in v4, but be defensive
//     if (session.user && token?.role) {
//       (session.user as any).role = token.role;
//     }

//     return session;
//   },
// }


// };

// export default NextAuth(authOptions);
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user || !user.password) return null;

  const valid = await bcrypt.compare(credentials.password, user.password);
  if (!valid) return null;

  // ✅ RETURN ONLY CORE USER FIELDS
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
},
}),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  allowDangerousEmailAccountLinking: true,

    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
  async jwt({ token, user }) {
    // First login (Credentials / Google)
  if (user) {
    token.id = user.id;
  }

  if (user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { role: true },
    });
    if (dbUser?.role) token.role = dbUser.role.name;
  }
  return token;
},

async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.role = token.role as string;
  }
  return session;
},
}
};

export default NextAuth(authOptions);