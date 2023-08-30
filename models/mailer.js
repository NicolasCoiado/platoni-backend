import nodemailer from "nodemailer";
import "dotenv/config";

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "seucert@gmail.com",
    pass: "fckircgevjfynlha",
  },
});

export default mailer;
