import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'

import { connectToDB } from "@utils/database";
import User from "@models/User";

console.log('xx', process.env.GOOGLE_ID)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  async session({ session }) {

  },
  async signIn({ profile }) {
    try {
      await connectToDB();

      // check if a user already exists.

      const userExists = await User.findOne({ email: profile.email })

      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(" ", "").toLowerCase(),
          image: profile.picture
        })
      }

      // if not create a user and save it to the database.
    } catch (error) {

    }
  }
})

export { handler as GET, handler as POST }
