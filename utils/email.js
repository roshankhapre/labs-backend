import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password if 2FA enabled
  },
});

// Send email to user
export const sendBookingEmail = async ({ to, name, packageName }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Lab Test Booking Confirmation",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your lab test <strong>${packageName}</strong> has been booked successfully.</p>
      <p>We will contact you shortly to collect your sample.</p>
      <br />
      <p>Thank you!</p>
      <p><b>Lab Booking Team</b></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send email to admin
export const sendAdminNotification = async ({
  name,
  email,
  phone,
  packageName,
}) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "roshankhapre30@gmail.com", // Replace with your admin email
    subject: "New Lab Booking",
    html: `
      <h2>New Booking Alert</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Package:</strong> ${packageName}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
