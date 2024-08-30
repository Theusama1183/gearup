"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";

const Navbar = () => {
  const { data: session }: any = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserProfilePopup, setShowUserProfilePopup] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <>
      <header className="bg-white px-8 fixed w-full top-0">
        <nav
          className="mx-auto w-full flex items-center justify-between py-5"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              GearUp
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-end gap-x-6">
            {!session ? (
              <>
                <Link
                  href="/become-an-instructor"
                  className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
                >
                  Become an Intructor
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-black px-3 py-2 border border-gray-500 border-1 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <div className="relative flex flex-col ">
                  {/* user image if user not have image show default image here */}
                  <Button
                    variant={"ghost"}
                    className="rounded-full "
                    size={"icon"}
                    aria-label={"user image"}
                    onClick={() =>
                      setShowUserProfilePopup(!showUserProfilePopup)
                    }
                  >
                    <Image
                      src={session.user?.image || "/user-avatar.png"}
                      alt="user image"
                      width={50}
                      height={50}
                    />
                  </Button>

                  {/* User Profile Popup */}
                  {showUserProfilePopup && (
                    <div className="absolute mt-12 px-5 py-2 bg-white border rounded shadow-lg user-profile-popup">
                      <div className="flex py-3 items-center">
                        <div className="block">
                          <Image
                            src={session.user?.image || "/user-avatar.png"}
                            alt="user image"
                            width={50}
                            height={50}
                          />
                        </div>
                        <div className="block pl-3">
                          <p className="block text-sm font-bold">
                            {session.user?.email}
                          </p>
                          <p className="block text-sm">{session.user?.role}</p>
                        </div>
                      </div>
                      <ul className="my-3 pt-5  border-t">
                        <li>
                          <Link className="block py-2 text-sm" href="/profile">
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="block py-2 text-sm"
                            href="/edit-profile"
                          >
                            Setting
                          </Link>
                        </li>
                        <li className="border-t mt-3 pt-2">
                          <Button
                            variant={"ghost"}
                            className="block p-0 hover:bg-transparent text-sm"
                            onClick={() => {
                              signOut();
                            }}
                          >
                            Log out
                          </Button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex lg:hidden ml-5">
            <Button
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between gap-x-6">
              <Link href="/" className="-m-1.5 p-1.5">
                <span>GearUp</span>
              </Link>
              <Button
                className="-m-2.5 rounded-md p-2.5 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <FaXmark className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
};

export default Navbar;
