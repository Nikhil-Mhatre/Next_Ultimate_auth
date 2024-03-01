import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as UUID_TOKEN } from "uuid";
import prismadb from "./db";

export const generateVerificationToken = async (email: string) => {
  // using UUID to generate unique IDs
  const token = UUID_TOKEN();

  // Token will expires in 1hour
  const expire = new Date(new Date().getTime() + 3600 * 1000);
  console.log(`verificationToken expiry: ${expire}`);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prismadb.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prismadb.verificationToken.create({
    data: {
      email,
      token,
      expire,
    },
  });

  return verificationToken;
};
