import { NextResponse } from "next/server";
import NodeCache from "node-cache";
import { connect } from "@/utils/db";
import { User, Customer, Instructor } from "@/models/Schema";

const cache = new NodeCache({ stdTTL: 600 });

export async function GET(request: Request) {
  try {
    // Extract userId from the query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedData = cache.get(userId);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    await connect();

    const user = await User.findById(userId).exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let profile;
    if (user.role === "customer") {
      profile = await Customer.findOne({ user: userId }).exec();
    } else if (user.role === "instructor") {
      profile = await Instructor.findOne({ user: userId }).exec();
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const userProfile = {
      ...user.toObject(),
      profile: profile.toObject(),
    };

    cache.set(userId, userProfile);

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
