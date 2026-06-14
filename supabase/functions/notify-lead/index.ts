import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  from_location: string;
  to_location: string;
  move_date?: string;
  move_type: string;
  property_size: string;
  message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const lead: LeadPayload = await req.json();
    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const results = await Promise.allSettled([
      sendEmail(lead, submittedAt),
      appendToGoogleSheets(lead, submittedAt),
    ]);

    const [emailResult, sheetsResult] = results;

    return new Response(
      JSON.stringify({
        success: true,
        email: emailResult.status === "fulfilled" ? "sent" : `failed: ${emailResult.reason}`,
        sheets: sheetsResult.status === "fulfilled" ? "appended" : `failed: ${sheetsResult.reason}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function sendEmail(lead: LeadPayload, submittedAt: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
      <div style="background: #f97316; padding: 20px 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Lead - SafeMove Packers & Movers</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Full Name</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Moving From</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.from_location}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Moving To</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.to_location}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Move Date</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.move_date || "Not specified"}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Move Type</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.move_type}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Property Size</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.property_size}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Message</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${lead.message || "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Submitted At</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${submittedAt}</td></tr>
        </table>
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">This is an automated lead notification from SafeMove website.</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "SafeMove Leads <onboarding@resend.dev>",
      to: ["venkatasateeshdivi@gmail.com"],
      subject: `New Lead: ${lead.name} - ${lead.from_location} to ${lead.to_location}`,
      html: htmlBody,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${err}`);
  }
}

async function appendToGoogleSheets(lead: LeadPayload, submittedAt: string) {
  const GOOGLE_SHEETS_WEBHOOK_URL = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");
  if (!GOOGLE_SHEETS_WEBHOOK_URL) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL not set");

  const row = [
    submittedAt,
    lead.name,
    lead.phone,
    lead.email,
    lead.from_location,
    lead.to_location,
    lead.move_date || "",
    lead.move_type,
    lead.property_size,
    lead.message || "",
  ];

  const res = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ row }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Sheets webhook error: ${err}`);
  }
}
