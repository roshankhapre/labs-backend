// Generate booking ID
export const generateBookingID = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `LAB${timestamp}${random}`;
};

// Send booking email to patient using BREVO HTTP API
export const sendBookingEmail = async ({
  to,
  name,
  phone,
  address,
  appointmentDate,
  appointmentTime,
  bookingId,
}) => {
  try {
    console.log(`📧 Attempting to send email to user: ${to}`);
    console.log(
      `🔍 Using verified sender: suyogpathalogyandlaboratory@gmail.com`
    );

    if (!to || !to.includes("@")) {
      throw new Error(`Invalid email address: ${to}`);
    }

    const emailPayload = {
      sender: {
        name: "Suyog Pathology Laboratory",
        email: "suyogpathalogyandlaboratory@gmail.com", // CHANGED TO YOUR VERIFIED GMAIL
      },
      to: [
        {
          email: to,
          name: name,
        },
      ],
      subject: `Lab Test Booking Confirmed - Booking ID: ${bookingId}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
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
                <p><strong>Address:</strong> ${address || "Not provided"}</p>
                <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
                <p><strong>Appointment Time:</strong> ${appointmentTime}</p>
              </div>

              <p>Our phlebotomist will contact you within 1-2 hours to schedule sample collection at your provided address.</p>
              
              <div style="background: #e9ecef; padding: 15px; margin: 15px 0; border-radius: 5px;">
                <h3>🏢 Lab Information</h3>
                <p><strong>Address:</strong> E-3126, Gopur Square, Sector E, Sudama Nagar, Indore, MP 452009</p>
                <p><strong>Phone:</strong> +91 98260 43016</p>
                <p><strong>Email:</strong> info@suyogpathlab.com</p>
              </div>

              <div style="background: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
                <h3>📝 Important Notes</h3>
                <ul>
                  <li>Please keep this Booking ID for future reference</li>
                  <li>Fasting may be required for some tests (our staff will inform you)</li>
                  <li>Carry any previous medical reports if available</li>
                  <li>For any queries, call us at +91 98260 43016</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated confirmation. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Suyog Pathology Laboratory. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log(`📤 Sending to Brevo API...`);
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    console.log(`📨 Brevo Response Status: ${response.status}`);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Brevo API Error:`, data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log(`✅ Brevo email accepted for delivery to ${to}`);
    console.log(`✅ Brevo Message ID: ${data.messageId}`);
    console.log(`📝 Check Brevo dashboard for delivery status`);
    return data;
  } catch (error) {
    console.error("❌ Brevo HTTP error:", error);
    throw error;
  }
};

// Send admin notification using BREVO HTTP API
export const sendAdminNotification = async (bookingData, bookingId) => {
  try {
    console.log(`📧 Sending admin notification for: ${bookingId}`);
    console.log(
      `🔍 Using verified sender: suyogpathalogyandlaboratory@gmail.com`
    );

    const emailPayload = {
      sender: {
        name: "Lab Booking System",
        email: "suyogpathalogyandlaboratory@gmail.com", // CHANGED TO YOUR VERIFIED GMAIL
      },
      to: [
        {
          email: process.env.ADMIN_EMAIL,
        },
      ],
      subject: `🔔 NEW BOOKING - ${bookingData.name} - ${bookingId}`,
      htmlContent: `
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
            <p><strong>Address:</strong> ${
              bookingData.address || "Not provided"
            }</p>
            <p><strong>Appointment:</strong> ${
              bookingData.appointmentDate
            } at ${bookingData.appointmentTime}</p>
            <p><strong>Booking Time:</strong> ${new Date().toLocaleString(
              "en-IN"
            )}</p>
            
            <div style="background: #f8f9fa; padding: 15px; margin-top: 15px; border-radius: 5px;">
              <h4>📞 Action Required:</h4>
              <p>Please contact the patient within 1-2 hours to confirm sample collection details.</p>
            </div>
          </div>
        </div>
      `,
    };

    console.log(`📤 Sending admin notification to Brevo API...`);
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    console.log(`📨 Brevo Response Status: ${response.status}`);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Brevo API Error:`, data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log(`✅ Admin notification accepted for delivery`);
    console.log(`✅ Brevo Message ID: ${data.messageId}`);
    console.log(`📝 Check Brevo dashboard for delivery status`);
    return data;
  } catch (error) {
    console.error("❌ Brevo admin notification error:", error);
    throw error;
  }
};

// Test function for Brevo
export const testEmailSystem = async () => {
  try {
    const testData = {
      to: process.env.ADMIN_EMAIL,
      name: "Test Patient",
      phone: "9876543210",
      address: "Test Address, Indore",
      appointmentDate: "2024-10-14",
      appointmentTime: "11:00 AM - 12:00 PM",
      bookingId: generateBookingID(),
    };

    await sendBookingEmail(testData);
    console.log("✅ Brevo email system test completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Brevo test failed:", error);
    return false;
  }
};
