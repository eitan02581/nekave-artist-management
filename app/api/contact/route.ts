import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: `"NEKAVE Website" <${process.env.GMAIL_USER}>`,
      to: "nekaveart@gmail.com",
      replyTo: email,
      subject: `New Lead: ${subject} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #b8924a; padding-bottom: 12px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666; width: 100px;">Name</td>
              <td style="padding: 8px 12px; color: #1a1a1a;">${name}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Email</td>
              <td style="padding: 8px 12px; color: #1a1a1a;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Phone</td>
              <td style="padding: 8px 12px; color: #1a1a1a;">${phone || "Not provided"}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Subject</td>
              <td style="padding: 8px 12px; color: #1a1a1a;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-left: 3px solid #b8924a;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #666;">Message</p>
            <p style="margin: 0; color: #1a1a1a; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Sent from the NEKAVE Artists Management website contact form.
          </p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
