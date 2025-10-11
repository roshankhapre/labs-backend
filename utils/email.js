import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate booking ID
export const generateBookingID = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `LAB${timestamp}${random}`;
};

// Send booking email to patient
export const sendBookingEmail = async ({
  to,
  name,
  phone,
  address,
  appointmentDate,
  appointmentTime,
  bookingId,
}) => {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: "Suyog Pathology Laboratory <onboarding@resend.dev>",
      to: [to],
      subject: `Lab Test Booking Confirmed - Booking ID: ${bookingId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c7fb8; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔬 Suyog Pathology Laboratory</h1>
              <h2>Test Booking Confirmation</h2>
            </div>
            
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for choosing Suyog Pathology Laboratory. Your test has been successfully booked.</p>
              
              <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2c7fb8;">
                <h3>📋 Booking Details</h3>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Patient Name:</strong> ${name}</p>
                <p><strong>Contact Number:</strong> ${
                  phone || "Not provided"
                }</p>
                <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
                <p><strong>Appointment Time:</strong> ${appointmentTime}</p>
              </div>

              <p>Our phlebotomist will contact you within 1-2 hours to schedule sample collection.</p>
              
              <div style="background: #e9ecef; padding: 15px; margin: 15px 0; border-radius: 5px;">
                <h3>🏢 Lab Information</h3>
                <p><strong>Address:</strong> E-3126, Gopur Square, Sector E, Sudama Nagar, Indore, MP 452009</p>
                <p><strong>Phone:</strong> +91 98260 43016</p>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated confirmation. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw error;
    }

    console.log(`✅ Confirmation email sent to ${name} with ID: ${bookingId}`);
    return data;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Send admin notification
export const sendAdminNotification = async (bookingData, bookingId) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Lab Booking System <onboarding@resend.dev>",
      to: [process.env.ADMIN_EMAIL],
      subject: `🔔 NEW BOOKING - ${bookingData.name} - ${bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: #dc3545; color: white; padding: 15px; text-align: center;">
            <h1>🚨 NEW TEST BOOKING ALERT</h1>
          </div>
          <div style="padding: 20px;">
            <h3>👤 PATIENT INFORMATION</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Patient Name:</strong> ${bookingData.name}</p>
            <p><strong>Phone:</strong> ${
              bookingData.phone || "Not provided"
            }</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Appointment:</strong> ${
              bookingData.appointmentDate
            } at ${bookingData.appointmentTime}</p>
            <p><strong>Booking Time:</strong> ${new Date().toLocaleString(
              "en-IN"
            )}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend admin error:", error);
      throw error;
    }

    console.log(`✅ Admin notification sent with ID: ${bookingId}`);
    return data;
  } catch (error) {
    console.error("❌ Error sending admin notification:", error);
    throw error;
  }
};

// Test function
export const testEmailSystem = async () => {
  try {
    const testData = {
      to: process.env.ADMIN_EMAIL,
      name: "Test Patient",
      phone: "9876543210",
      appointmentDate: "2024-10-11",
      appointmentTime: "10:00 AM",
      bookingId: "LABTEST123",
    };

    await sendBookingEmail(testData);
    console.log("✅ Resend email system is working!");
    return true;
  } catch (error) {
    console.error("❌ Resend test failed:", error);
    return false;
  }
};
