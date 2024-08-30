// components/UserProfileClient.tsx

"use client";

import { useSession } from "next-auth/react";

const UserProfileClient = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  const { user } = session;

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <img
          src={user.image || "/user-avatar.png"}
          alt="User Image"
          className="w-32 h-32 mx-auto rounded-full"
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
