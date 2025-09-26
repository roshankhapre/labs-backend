import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a unique booking ID
export const generateBookingID = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `LAB${timestamp}${random}`;
};

// Send professional confirmation email to patient
export const sendBookingEmail = async ({
  to,
  name,
  phone,
  address,
  appointmentDate,
  appointmentTime,
  bookingId, // ✅ Receive bookingId as parameter (DON'T generate new one)
}) => {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: `"Suyog Pathology Laboratory" <${process.env.EMAIL_USER}>`,
    to,
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
          .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2c7fb8; }
          .highlight { color: #2c7fb8; font-weight: bold; }
          .instructions { background: #fff3cd; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
          .contact-info { background: #d4edda; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔬 Suyog Pathology Laboratory</h1>
            <h2>Test Booking Confirmation</h2>
          </div>
          
          <div class="content">
            <p>Dear <span class="highlight">${name}</span>,</p>
            <p>Thank you for choosing Suyog Pathology Laboratory. Your test has been successfully booked.</p>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              <p><strong>Patient Name:</strong> ${name}</p>
              <p><strong>Contact Number:</strong> ${phone || "Not provided"}</p>
              <p><strong>Collection Address:</strong> ${
                address || "To be confirmed via phone"
              }</p>
              <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
              <p><strong>Appointment Time:</strong> ${appointmentTime}</p>
              <p><strong>Booking Date:</strong> ${currentDate}</p>
              <p><strong>Status:</strong> <span style="color: green;">Confirmed - Awaiting Sample Collection</span></p>
            </div>

            <div class="instructions">
              <h3>📝 Important Instructions</h3>
              <ul>
                <li>Our phlebotomist will contact you within 1-2 hours to schedule sample collection</li>
                <li>Please keep your prescription ready</li>
                <li>Fasting of 10-12 hours required if advised by your doctor</li>
                <li>Carry a valid government ID proof during sample collection</li>
                <li>Inform us about any specific medical conditions or medications</li>
              </ul>
            </div>

            <div class="contact-info">
              <h3>📞 Contact Information</h3>
              <p><strong>Lab Address:</strong> E-3126, Gopur Square, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009</p>
              <p><strong>Phone:</strong> +91 98260 43016</p>
              <p><strong>Email:</strong> suyogpathalogyandlaboratory@gmail.com</p>
              <p><strong>Working Hours:</strong> 7:00 AM - 8:00 PM (Monday-Saturday)</p>
            </div>

            <p>We are committed to providing you with accurate and timely test results.</p>
            <p><strong>Note:</strong> Reports will be delivered via email and can also be collected from our lab.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated confirmation. Please do not reply to this email.</p>
            <p>© 2024 Suyog Pathology Laboratory. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${name} with ID: ${bookingId}`);
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error);
    throw error;
  }
};

// Send detailed notification to admin/lab staff
export const sendAdminNotification = async (bookingData, bookingId) => {
  // ✅ Receive bookingId as parameter
  const mailOptions = {
    from: `"Lab Booking System" <${process.env.EMAIL_USER}>`,
    to: "suyogpathalogyandlaboratory@gmail.com",
    subject: `🔔 NEW LAB TEST BOOKING - ${bookingData.name} - ${bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 15px; text-align: center; border-radius: 5px; }
          .urgent { background: #fff3cd; padding: 10px; margin: 10px 0; border: 1px solid #ffc107; }
          .patient-info, .test-info, .action-required { 
            background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .action-required { border-left-color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 NEW TEST BOOKING ALERT</h1>
            <p>Urgent Action Required - Sample Collection Needed</p>
          </div>

          <div class="urgent">
            <h3>⏰ ACTION REQUIRED WITHIN 1 HOUR</h3>
            <p>Please contact the patient immediately to schedule sample collection.</p>
          </div>

          <div class="patient-info">
            <h3>👤 PATIENT INFORMATION</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Patient Name:</strong> ${bookingData.name}</p>
            <p><strong>Contact Number:</strong> ${
              bookingData.phone || "Not provided"
            }</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Collection Address:</strong> ${
              bookingData.address ||
              "Address not provided - Contact patient for details"
            }</p>
            <p><strong>Appointment Date:</strong> ${
              bookingData.appointmentDate
            }</p>
            <p><strong>Appointment Time:</strong> ${
              bookingData.appointmentTime
            }</p>
            <p><strong>Booking Time:</strong> ${new Date().toLocaleString(
              "en-IN"
            )}</p>
          </div>

          <div class="test-info">
            <h3>🔬 TEST DETAILS</h3>
            <p><strong>Test Type:</strong> ${
              bookingData.testType || "Diagnostic Test"
            }</p>
            <p><strong>Priority:</strong> ${
              bookingData.priority || "Standard"
            }</p>
          </div>

          <div class="action-required">
            <h3>📋 IMMEDIATE ACTIONS REQUIRED</h3>
            <ol>
              <li><strong>Contact Patient:</strong> Call ${
                bookingData.phone || "the provided number"
              } within 1 hour to confirm address and schedule</li>
              <li><strong>Assign Phlebotomist:</strong> Allocate staff for sample collection</li>
              <li><strong>Prepare Kit:</strong> Get required test tubes and materials ready</li>
              <li><strong>Update System:</strong> Log booking in lab management software</li>
              <li><strong>Confirm Timing:</strong> Inform patient about collection time</li>
            </ol>
          </div>

          <div style="background: #d4edda; padding: 15px; margin: 15px 0;">
            <h3>💡 IMPORTANT NOTES</h3>
            <ul>
              <li>Verify if fasting is required for the test</li>
              <li>Check if prescription needs to be collected</li>
              <li>Confirm specific timing constraints if any</li>
              <li>Note any special patient requirements</li>
            </ul>
          </div>

          <div style="background: #e9ecef; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3>🏢 LAB CONTACT INFORMATION</h3>
            <p><strong>Lab Address:</strong> E-3126, Gopur Square, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009</p>
            <p><strong>Contact Number:</strong> +91 98260 43016</p>
            <p><strong>Email:</strong> suyogpathalogyandlaboratory@gmail.com</p>
          </div>

          <p style="text-align: center; color: #666; font-size: 12px;">
            This notification was generated automatically by the Lab Booking System
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification sent with ID: ${bookingId}`);
  } catch (error) {
    console.error("❌ Error sending admin notification:", error);
    throw error;
  }
};

// Additional function for sending test results notification
export const sendResultsReadyEmail = async ({
  to,
  name,
  testName,
  bookingId,
}) => {
  const mailOptions = {
    from: `"Suyog Pathology Laboratory" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📊 Your Lab Test Results Are Ready - ${bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Test Results Available</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your test results for <strong>${
              testName || "the requested test"
            }</strong> are now ready.</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Report Date:</strong> ${new Date().toLocaleDateString(
              "en-IN"
            )}</p>
            <br>
            <p>You can:</p>
            <ul>
              <li>Download your report from our patient portal</li>
              <li>Visit the lab to collect physical copy</li>
              <li>Consult with our pathologist if needed</li>
            </ul>
            
            <div style="background: #e9ecef; padding: 15px; margin: 15px 0; border-radius: 5px;">
              <h3>🏢 Lab Information</h3>
              <p><strong>Address:</strong> E-3126, Gopur Square, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009</p>
              <p><strong>Phone:</strong> +91 98260 43016</p>
              <p><strong>Hours:</strong> 7:00 AM - 8:00 PM (Monday-Saturday)</p>
            </div>
            
            <p>Thank you for choosing Suyog Pathology Laboratory.</p>
          </div>
          <div class="footer">
            <p>Confidential: This email contains sensitive medical information</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Results notification sent to ${name}`);
  } catch (error) {
    console.error("❌ Error sending results email:", error);
    throw error;
  }
};
