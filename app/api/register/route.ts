import { User } from "@/models/Schema";
import { connect } from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { email, password, role = "Instructor" } = await request.json(); // Default role to "customer"

  await connect();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  // Generate username from email
  let username = email.split("@")[0];

  // Check if the username already exists and modify it until it's unique
  let usernameExists = await User.findOne({ username });
  while (usernameExists) {
    const randomNum = Math.floor(Math.random() * 1000); // Generate a random number
    username = `${username}${randomNum}`; // Append the random number to the username
    usernameExists = await User.findOne({ username }); // Check again if the new username exists
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    email,
    password: hashedPassword,
    role,
    username,
  });

  try {
    await newUser.save();
    return new NextResponse("User is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err.message || "An error occurred", {
      status: 500,
    });
  }
};
