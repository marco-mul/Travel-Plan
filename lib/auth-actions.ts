"use server";

import { signIn, signOut } from "@/auth";

export const loginGitHub = async () => {
  // We use the github provider for authentication
  await signIn("github", { redirectTo: "/trips" });
};

export const loginGoogle = async () => {
  // We use the google provider for authentication
  await signIn("google", { redirectTo: "/trips" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
