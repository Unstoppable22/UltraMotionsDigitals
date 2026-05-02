import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      // 🚨 CRITICAL: Use 'service' NOT 'host'
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your 16-character App Password
      },
    });

    // Updated log to confirm the code change is live
    console.log(`📩 GMAIL SYSTEM: Sending notification to ${options.to}`);

    await transporter.verify();
    
    const info = await transporter.sendMail({
      from: `"Ultra Motion Digitals" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
    });

    console.log("✅ GMAIL DELIVERY SUCCESSFUL");
    return info;
  } catch (error) {
    console.error("🔥 GMAIL SYSTEM ERROR:", error.message);
    throw error;
  }
};