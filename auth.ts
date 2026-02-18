import nextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import GoogleProvider from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = nextAuth({
  // allows to add any provider for auth
  providers: [GitHub, GoogleProvider],
  //allows to use db adapters such as prisma
  adapter: PrismaAdapter(prisma),
});


  