// components/UserProfileClient.tsx

"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

const UserProfileClient = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  const { user } = session;

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <Image
          src={session.user?.image || "/user-avatar.png"}
          alt="user image"
          className="rounded-full"
          width={200}
          height={200}
        />
        <h1 className="text-2xl font-bold mt-4">Welcome, {user.username}</h1>
        <p className="text-lg mt-2">{user.role}</p>
      </div>

      {user.role === "customer" && user.customerDetails && (
        <div>
          <h2>Customer Details</h2>
          <p>Name: {user.customerDetails.name}</p>
          <p>Phone: {user.customerDetails.phone}</p>
          <p>Address: {user.customerDetails.address}</p>
          {/* Add more fields as needed */}
        </div>
      )}

      {user.role === "instructor" && user.instructorDetails && (
        <div>
          <h2>Instructor Details</h2>
          <p>Name: {user.instructorDetails.name}</p>
          <p>Phone: {user.instructorDetails.phone}</p>
          <p>Skills: {user.instructorDetails.skills.join(", ")}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default UserProfileClient;
