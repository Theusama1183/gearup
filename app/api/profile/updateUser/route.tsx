import { NextRequest, NextResponse } from "next/server";
import { User, Customer, Instructor } from "@/models/Schema";
import { connect } from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { userId, updateData } = await req.json();

    console.log("User ID:", userId);
    console.log("Update Data:", updateData);

    if (!userId || !updateData) {
      return NextResponse.json(
        { message: "Missing userId or updateData." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    console.log("User Found:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (user.role === "customer") {
      // Check for required fields or provide default values
      const requiredFields = {
        gender: updateData.gender || "",
        country: updateData.country || "",
        state: updateData.state || "",
        city: updateData.city || "",
        postalCode: updateData.postalCode || "",
        address: updateData.address || "",
        user: userId,
      };

      const completeUpdateData = { ...updateData, ...requiredFields };

      let updatedCustomer = await Customer.findByIdAndUpdate(
        userId,
        completeUpdateData,
        { new: true }
      );
      console.log("Updated Customer:", updatedCustomer);

      if (!updatedCustomer) {
        updatedCustomer = await Customer.create({
          _id: userId,
          ...completeUpdateData,
        });
        console.log("Newly Created Customer:", updatedCustomer);
      }

      return NextResponse.json({
        message: "Customer profile updated successfully.",
      });
    } else if (user.role === "instructor") {
      const updatedInstructor = await Instructor.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
      console.log("Updated Instructor:", updatedInstructor);
      return NextResponse.json({
        message: "Instructor profile updated successfully.",
      });
    } else {
      return NextResponse.json(
        { message: "Invalid user role." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal server error.", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
