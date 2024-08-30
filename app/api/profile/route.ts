import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import { User, Customer, Instructor } from "@/models/Schema";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  await connect();

  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let profile;
    if (user.role === "customer") {
      profile = await Customer.findOne({ user: user._id }).exec();
    } else if (user.role === "instructor") {
      profile = await Instructor.findOne({ user: user._id }).exec();
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
