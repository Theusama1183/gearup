"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [role, setRole] = useState("instructor");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    return email.includes("@") && email.includes(".");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role, // Send the selected role to the backend
        }),
      });

      if (res.status === 400) {
        toast.error("This email is already registered");
        setError("The email is already in use");
      } else if (res.status === 200) {
        setError("");
        toast.success("Registration successful");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Error, try again");
      setError("Error, try again");
      console.log(error);
    }
    console.log("Received data:", { email, password, role });
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-col items-center">
          <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900">
            Sign up to Become an Instructor
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Sign up
                </button>
              </div>

              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>
            </form>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  signIn("google");
                }}
                className="flex w-full items-center border border-gray-300 justify-center gap-3 rounded-md bg-white px-3 py-1.5 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <FcGoogle />
                <span className="text-sm font-semibold leading-6">Google</span>
              </button>

              <button
                onClick={() => {
                  signIn("github");
                }}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 1.58.314 3.081.876 4.459l-.003.002 1.5-.084c-.317-.893-.491-1.847-.491-2.777 0-1.405.433-2.715 1.172-3.781-.115.022-.221.033-.338.033-.83 0-1.548-.281-2.136-.757-.106.201-.166.433-.166.677 0 1.479 1.057 2.706 2.463 2.991-.258.071-.532.109-.81.109-.198 0-.393-.019-.583-.056.393 1.229 1.534 2.124 2.887 2.148-1.06.832-2.398 1.327-3.835 1.327-.248 0-.493-.014-.735-.043 1.361.872 2.983 1.38 4.724 1.38 5.658 0 8.756-4.564 8.756-8.53 0-.13-.004-.259-.009-.387.601-.435 1.121-.977 1.537-1.596l-.001-.001-.002-.002A9.949 9.949 0 0020 10.017C20 4.484 15.523 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">GitHub</span>
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Already a member?{" "}
              <Link
                href="/login"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default RegisterPage;
