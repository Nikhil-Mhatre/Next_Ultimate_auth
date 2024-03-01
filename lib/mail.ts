import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.DOMAIN}/auth/new-verification?token=${token}`;

  let transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER_ID,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: "nextultimateauth@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Confirmed Your Email", // Subject line
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`, // html body
  };
  const mailResponse = await transport.sendMail(mailOptions);
  console.log(`<---------- Mail Response ---------> ${mailResponse}`);
};
