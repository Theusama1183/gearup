// pages/api/instructors/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/utils/db";
import { Instructor } from "@/models/Schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();

  if (req.method === "PUT") {
    const { id } = req.query;
    const updatedInstructor = await Instructor.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedInstructor) {
      return res.status(404).json({ error: "Instructor not found" });
    }

    return res.status(200).json(updatedInstructor);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
