import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DefaultSession, NextAuthOptions } from 'next-auth';
import { prisma } from '../prisma';
import { compare, hash } from 'bcrypt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { name: credentials.username },
          select: { id: true, email: true, name: true, password: true },
        });

        if (!user || !(await compare(credentials.password, user.password!))) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (typeof token?.id === 'string') {
        session.user.id = token.id;
      }

      return session;
    },
    redirect: () => '/',
  },
  pages: {
    signIn: '/sign-in',
  },
};
