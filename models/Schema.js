// app/models/Schema.js

import mongoose from "mongoose";

const { Schema } = mongoose;

// User Schema - Base schema for both customers and instructors
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["customer", "instructor"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Customer Schema
const customerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

// Instructor Schema
const instructorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    skils: {
      type: [String],
      required: false,
    },
    experience: {
      type: String,
      required: false,
    },
    availability: {
      type: String,
      enum: ["all day", "morning", "afternoon", "night"],
      required: true,
    },
    availabilityDuration: {
      type: String,
      required: false,
    },
    Price: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Instructor =
  mongoose.models.Instructor || mongoose.model("Instructor", instructorSchema);

// Booking Schema
const bookingSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// Review Schema
const reviewSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

// Payment Schema
const paymentSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer"],
    },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export { User, Customer, Instructor, Booking, Review, Payment };
