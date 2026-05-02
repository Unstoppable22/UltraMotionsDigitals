import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // LOG 1: Check if variables are even reaching the function
  console.log("🛠️ Debug: EMAIL_USER is", process.env.EMAIL_USER ? "DEFINED" : "MISSING");

  try {
    const transporter = nodemailer.createTransport({
      // We are being extremely explicit here to kill the 127.0.0.1 error
      host: "premium77.qservers.net",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Necessary for many QServers setups
      },
      // This forces the connection to wait longer before giving up
      connectionTimeout: 20000, 
      greetingTimeout: 20000
    });

    console.log(`📡 Attempting direct QServers handshake for: ${options.to}`);

    // Verify the connection
    await transporter.verify();
    console.log("✅ QServers Handshake Verified!");

    const info = await transporter.sendMail({
      from: `"Ultra Motion Digitals" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: `<div style="font-family:sans-serif; padding:20px; border:1px solid #ddd;">
              <h3>Ultra Motion Digitals</h3>
              <p>${options.text}</p>
             </div>`
    });

    console.log(`✅ Email Success: ${info.messageId}`);
    return info;

  } catch (error) {
    // LOG 2: This will tell us if it's STILL trying 127.0.0.1
    console.error("🔥 THE SMOKING GUN:", error.message);
    throw error;
  }
};