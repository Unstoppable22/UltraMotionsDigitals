import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // 1. Log the attempt so you see it in Render
  console.log(`📩 Preparing email for: ${options.to}`);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Increase timeout for server environments
      connectionTimeout: 10000, 
    });

    // 2. Verify connection before sending
    await transporter.verify();
    console.log("✅ Gmail Connection Verified Successfully");

    const mailOptions = {
      from: `"Ultra Motion Digitals" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text, // Sends HTML if provided
    };

    // 3. Send and log result
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent! Message ID: ${info.messageId}`);
    
    return info;
  } catch (error) {
    // This will now catch and show why the connection failed
    console.error("🔥 NODEMAILER ERROR:", error.message);
    throw error;
  }
};