"use client";

import { loginGitHub, loginGoogle } from "@/lib/auth-actions";
import { CircleArrowDown, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function Home() {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-600">
      {isPending ? (
        
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="mb-5">Just a moment, we're signing you in...</p>
          <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
            <h1 className="text-center text-4xl font-bold mb-6 mt-20">
              Plan your trips step-by-step
            </h1>
            <h2 className="text-center text-xl text-gray-600 dark:text-gray-400">
              Ready to board your next adventure? <br /> Let's start planning your
              dream trip today!
            </h2>
            <p className="w-3/5 text-center text-md mt-6 text-gray-600 dark:text-gray-400">
              Organize your travel plans with ease and efficiency. With Travel
              Plan, you can stay organized by saving all the locations you plan to
              visit. You'll be able to keep track of your travel history and
              create a personalized globe showcasing all the places you've been
              to. Start planning your next adventure now and make your travel
              dreams a reality!
            </p>

            <h2 className="text-center text-xl text-gray-600 dark:text-gray-400">
              Get started now!
            </h2>
            <CircleArrowDown className="size-8 animate-bounce text-gray-500 dark:text-gray-300" />
          </div>
          <div className="mx-auto flex flex-col items-center gap-4 py-8">
            <button
              aria-label="Sign in with Google"
              className="flex items-center gap-3 bg-google-button-dark rounded-full p-0.5 pr-4 transition-colors duration-300 hover:bg-google-button-dark-hover disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => startTransition(() => loginGoogle())}
              disabled={isPending}
            >
              <div className="flex items-center justify-center bg-background w-9 h-9 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <title>Sign in with Google</title>
                  <desc>Google G Logo</desc>
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    className="fill-google-logo-blue"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    className="fill-google-logo-green"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    className="fill-google-logo-yellow"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    className="fill-google-logo-red"
                  ></path>
                </svg>
              </div>
              <span className="text-sm text-white tracking-wider">
                Sign in with Google
              </span>
            </button>
            <button
              aria-label="Sign in with GitHub"
              className="flex items-center gap-3 bg-google-button-dark rounded-full p-0.5 pr-4 transition-colors duration-300 hover:bg-google-button-dark-hover disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => startTransition(() => loginGitHub())}
              disabled={isPending}
            >
              <div className="flex items-center justify-center bg-background w-9 h-9 rounded-full">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3.01.41 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.23 0 1.61-.02 2.91-.02 3.31 0 .32.22.69.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <span className="text-sm text-white tracking-wider">
                Sign In with GitHub
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
