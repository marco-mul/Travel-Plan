"use client";

import { loginGoogle, loginGitHub, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import { useTransition } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar({ session }: { session: Session | null }) {
  const [isPending, startTransition] = useTransition();

  return (
    <nav className="bg-background shadow-md dark:shadow-muted-foreground py-4 border-b border-gray-200 dark:border-gray-800 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center not-first:px-6 lg:px-8">
        <Link href={"/"} className="flex items-center">
          <Image className="dark:hidden" src={"/logo.png"} alt="logo" width={50} height={50} />
          <Image className="hidden dark:block" src={"/logo-white.png"} alt="logo" width={50} height={50} />
          <span className="text-2xl font-bold text-foreground">
            Travel Plan
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link
                href={"/trips"}
                className="text-foreground hover:text-gray-500 dark:hover:text-gray-400"
              >
                My Trips
              </Link>
              <Link
                href={"/globe"}
                className="text-foreground hover:text-gray-500 dark:hover:text-gray-400"
              >
                Globe
              </Link>
              <Button
                variant="outline"
                className="hover:cursor-pointer"
                onClick={() => startTransition(() => logout())}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Sign Out"
                )}
              </Button>
            </>
          ) : (
            <>
              {/* <button
                className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-sm cursor-pointer"
                onClick={loginGitHub}
              >
                Sign In
                <svg
                  className="w-6 h-6 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3.01.41 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.23 0 1.61-.02 2.91-.02 3.31 0 .32.22.69.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </button> */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="hover:cursor-pointer">
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent>
                      <NavigationMenuLink asChild>
                        <span
                          className="flex flex-row items-center justify-center w-[100px] hover:cursor-pointer"
                          onClick={() => startTransition(() => loginGitHub())}
                        >
                          <p>GitHub</p>{" "}
                          <svg
                            className="w-6 h-6 ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3.01.41 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.23 0 1.61-.02 2.91-.02 3.31 0 .32.22.69.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <span
                          className="flex flex-row items-center justify-center w-[100px] hover:cursor-pointer"
                          onClick={() => startTransition(() => loginGoogle())}
                        >
                          <p>Google</p>{" "}
                          <svg
                            className="w-2 h-2 ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <desc>Google G Logo</desc>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>{" "}
                          </svg>
                        </span>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
