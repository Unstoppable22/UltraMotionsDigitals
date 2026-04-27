import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  console.log(`📩 Routing professional email to: ${options.to}`);

  try {
    const transporter = nodemailer.createTransport({
      // FOR QSERVERS: Usually your domain name with 'mail.' in front
      host: "mail.ultramotiondigitals.com", 
      port: 465, 
      secure: true, // Use true for port 465
      auth: {
        user: process.env.EMAIL_USER, // info@ultramotiondigitals.com
        pass: process.env.EMAIL_PASS, 
      },
      tls: {
        // This is critical for QServers to prevent SSL handshake errors
        rejectUnauthorized: false 
      }
    });

    // Handshake check
    await transporter.verify();
    console.log("✅ QServers SMTP Connection Verified");

    const mailOptions = {
      from: `"Ultra Motion Digitals" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Ultra Motion Digitals</h2>
              <p>${options.text}</p>
             </div>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email delivered via QServers!`);

  } catch (error) {
    console.error("🔥 QSERVERS MAIL ERROR:", error.message);
    throw error;
  }
};