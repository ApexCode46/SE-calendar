import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db/db";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "your-username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const [rows] = await db.execute(
          "SELECT accounts.username, accounts.password, accounts.role, users.user_id, users.title, users.firstname, users.lastname FROM accounts INNER JOIN users ON accounts.user_id = users.user_id WHERE accounts.username = ?",
          [credentials.username]
        );

        if (rows.length === 0) {
          throw new Error("User not found!");
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid password!");
        }

        return {
          id: user.user_id,
          username: user.username,
          role: user.role,
          title: user.title,
          firstname: user.firstname,
          lastname: user.lastname,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // หลังจาก login สำเร็จให้ redirect ไปหน้า calendar
      if (url.startsWith(baseUrl + "/api/auth/signin") || url === baseUrl + "/") {
        return `${baseUrl}/calendar`;
      }
      
      // หากเป็น URL ภายในเว็บไซต์ ให้ redirect ตามปกติ
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // หากเป็น relative URL ให้ redirect ไป calendar
      if (url.startsWith("/")) {
        return `${baseUrl}/calendar`;
      }
      
      // default fallback ไปหน้า calendar
      return `${baseUrl}/calendar`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
