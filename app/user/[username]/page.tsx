// app/profile/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth/index";
import { redirect } from "next/navigation";

import UserProfileClient from "@/components/UserProfileClient";

export const metadata = {
  title: "User Profile",
};

const UserProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <h1>User Profile</h1>
      <UserProfileClient />
      {/* {session.user.role === "customer" && <CustomerUpdateForm />}
      {session.user.role === "instructor" && <InstructorUpdateForm />} */}
    </div>
  );
};

export default UserProfilePage;
