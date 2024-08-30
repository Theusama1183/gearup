import { notFound } from "next/navigation";

export default async function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/profile?username=${params.username}`
  );

  if (!res.ok) {
    console.error("Failed to fetch user profile:", await res.text()); // Debugging line
    notFound(); // This will render a 404 page if the response is not ok
  }

  const user = await res.json();

  return (
    <div>
      <h1>User Profile: {params.username}</h1>
      <p>Name: {user.name}</p>
      <p>Phone: {user.phone}</p>
      <p>Address: {user.address}</p>
      <p>City: {user.city}</p>
      <p>State: {user.state}</p>
      <p>Country: {user.country}</p>
      {/* Render other fields based on user role */}
    </div>
  );
}
