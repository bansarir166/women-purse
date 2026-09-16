import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = process.env.NOTIFICATION_EMAIL || "bansarir166@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const subscriberSource = source || "Homepage Newsletter";
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "UTC",
    });

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;

    // HTML Email Template matching VELORA's luxury aesthetic
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F5F0; margin: 0; padding: 40px 20px; color: #191411; }
          .container { max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E5DEC9; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 16px rgba(25, 20, 17, 0.05); }
          .header { background-color: #171310; padding: 36px 30px; text-align: center; }
          .brand { font-size: 24px; font-weight: 300; letter-spacing: 0.35em; color: #FAF8F5; text-transform: uppercase; margin: 0; }
          .badge { display: inline-block; margin-top: 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #C5A880; font-weight: 600; }
          .content { padding: 36px 32px; }
          .title { font-size: 19px; font-weight: 500; color: #191411; margin-top: 0; margin-bottom: 8px; letter-spacing: -0.01em; }
          .subtitle { font-size: 13px; color: #766E65; margin-top: 0; margin-bottom: 24px; line-height: 1.5; }
          .details-card { background-color: #FAF8F5; border: 1px solid #EAE3D9; padding: 20px; margin-bottom: 28px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F0ECE4; font-size: 13px; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #8C7F72; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; }
          .detail-value { color: #191411; font-weight: 500; }
          .subscriber-highlight { font-size: 16px; font-weight: 600; color: #9A7B4F; word-break: break-all; }
          .cta-button { display: inline-block; background-color: #191411; color: #FAF8F5 !important; text-decoration: none; padding: 13px 28px; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; border-radius: 1px; }
          .footer { background-color: #F8F5F0; border-top: 1px solid #EAE3D9; padding: 20px; text-align: center; font-size: 11px; color: #8C7F72; letter-spacing: 0.05em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">VELORA</h1>
            <span class="badge">Florence Atelier &bull; Privilege Circle</span>
          </div>
          <div class="content">
            <h2 class="title">New Subscriber Invitation Dispatched</h2>
            <p class="subtitle">A new collector has subscribed to the VELORA Atelier Circle and is awaiting private previews and seasonal allocations.</p>
            
            <div class="details-card">
              <div class="detail-row">
                <span class="detail-label">Subscriber Email</span>
                <span class="subscriber-highlight">${email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Form Location</span>
                <span class="detail-value">${subscriberSource}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date & Time (UTC)</span>
                <span class="detail-value">${timestamp}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Routing Destination</span>
                <span class="detail-value">${RECIPIENT_EMAIL}</span>
              </div>
            </div>

            <div style="text-align: center; margin-top: 10px;">
              <a href="mailto:${email}" class="cta-button">Contact Subscriber</a>
            </div>
          </div>
          <div class="footer">
            Automated notification delivered from VELORA Luxury Atelier &bull; ${RECIPIENT_EMAIL}
          </div>
        </div>
      </body>
      </html>
    `;

    // Check if mail transport credentials exist
    if ((emailUser && emailPass) || smtpHost) {
      let transporter;

      if (smtpHost) {
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });
      } else {
        // Standard Gmail configuration
        transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });
      }

      await transporter.sendMail({
        from: `"VELORA Atelier" <${emailUser || "noreply@velora.com"}>`,
        to: RECIPIENT_EMAIL,
        replyTo: email,
        subject: `✨ New VELORA Subscriber: ${email}`,
        text: `New subscriber on VELORA:\n\nEmail: ${email}\nSource: ${subscriberSource}\nTime: ${timestamp}\nSent to: ${RECIPIENT_EMAIL}`,
        html: htmlContent,
      });

      return NextResponse.json({
        success: true,
        message: `Subscription successful. Notification delivered to ${RECIPIENT_EMAIL}.`,
      });
    } else {
      // Graceful fallback when credentials aren't configured yet in .env.local
      console.log("=================================================");
      console.log(`[VELORA NEWSLETTER] New Subscriber Notification`);
      console.log(`To: ${RECIPIENT_EMAIL}`);
      console.log(`Subscriber: ${email}`);
      console.log(`Source: ${subscriberSource}`);
      console.log(`Time: ${timestamp}`);
      console.log(`Note: To send live emails, set EMAIL_USER and EMAIL_APP_PASSWORD in .env.local.`);
      console.log("=================================================");

      return NextResponse.json({
        success: true,
        simulated: true,
        message: `Subscription registered. Email notification queued for ${RECIPIENT_EMAIL}.`,
      });
    }
  } catch (error: unknown) {
    console.error("[Subscribe API Error]:", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again." },
      { status: 500 }
    );
  }
}
