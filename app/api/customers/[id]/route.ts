// pages/api/customers/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/utils/db";
import { Customer } from "@/models/Schema";
import { POST } from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();

  if (req.method === "PUT") {
    const { id } = req.query;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(200).json(updatedCustomer);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
