"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import prismadb from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/token";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // server-side field data validation
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Field!" };
  }

  const { email, name, password } = validatedFields.data;

  const existingUser = await prismadb.user.findUnique({
    where: { email },
  });

  if (existingUser) return { error: "Email is Already Taken!" };

  const hashedPassword = await bcrypt.hash(password, 12);

  await prismadb.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: Send Verification token email
  const verificationToken = await generateVerificationToken(email);
  console.log(`Current Time: ${new Date()}`);
  return { success: "Email Sent!" };
};
