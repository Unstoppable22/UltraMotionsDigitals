import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  try {
    // We use process.env so your secrets stay safe in Render
    const transporter = nodemailer.createTransport({
      host: "premium77.qservers.net", // Force the domain host
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
      tls: {
        rejectUnauthorized: false 
      }
    });

    console.log(`📩 Attempting delivery via QServers to: ${options.to}`);
    
    await transporter.verify();
    
    const info = await transporter.sendMail({
      from: `"Ultra Motion Digitals" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
    });

    console.log("✅ Email Reflection Successful");
    return info;
  } catch (error) {
    console.error("🔥 Reflection Error:", error.message);
    throw error;
  }
};