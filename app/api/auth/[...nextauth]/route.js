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
        // ดึงข้อมูลจากฐานข้อมูล
        const [rows] = await db.execute(
          "SELECT accounts.username, accounts.password, accounts.role, users.user_id, users.title, users.firstname, users.lastname FROM accounts INNER JOIN users ON accounts.user_id = users.user_id WHERE accounts.username = ?",
          [credentials.username]
        );

        if (rows.length === 0) {
          throw new Error("User not found!");
        }

        const user = rows[0];
        console.log(user);

        // ตรวจสอบรหัสผ่าน (ควรใช้ bcrypt เปรียบเทียบ)
        if (credentials.password !== user.password) {
          throw new Error("Invalid password!");
        }

        // ส่งข้อมูลผู้ใช้กลับไปใน session
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
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
