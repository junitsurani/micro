import { google, type sheets_v4 } from "googleapis";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { waitlistStore } from "@/lib/waitlist/store";

export const runtime = "nodejs";

type AccessRequestPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: boolean;
  source?: string;
};

type LeadInput = {
  firstName: string;
  lastName: string;
  email: string;
};

let _resend: Resend | null = null;
let _sheets: sheets_v4.Sheets | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getBackendApiUrl = () =>
  process.env.MICRO_BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_API_URL ??
  process.env.BACKEND_API_URL ??
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:8000");

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const [firstName = "Website", ...rest] = parts;

  return {
    firstName,
    lastName: rest.join(" ") || "Waitlist",
  };
};

const normalizeGooglePrivateKey = (value: string | undefined) =>
  value
    ?.trim()
    .replace(/,$/, "")
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");

const getGoogleSheetsClient = () => {
  if (_sheets) return _sheets;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = normalizeGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  if (!email || !key) return null;

  _sheets = google.sheets({
    version: "v4",
    auth: new google.auth.JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    }),
  });

  return _sheets;
};

const buildSheetRange = (sheetName: string) => {
  const escapedSheetName = sheetName.replace(/'/g, "''");
  return `'${escapedSheetName}'!A:D`;
};

const submitLeadToGoogleSheets = async ({ firstName, lastName, email }: LeadInput) => {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_LEAD_SHEET_NAME ?? "Leads";
  const sheets = getGoogleSheetsClient();

  if (!spreadsheetId || !sheets) return false;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: buildSheetRange(sheetName),
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[firstName, lastName, email, new Date().toISOString()]],
    },
  });

  return true;
};

const submitLeadToMicroBackend = async ({ firstName, lastName, email }: LeadInput) => {
  const backendApiUrl = getBackendApiUrl();
  if (!backendApiUrl) return false;

  const response = await fetch(`${backendApiUrl.replace(/\/$/, "")}/api/v1/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Micro backend lead submission failed (${response.status}): ${details}`);
  }

  return true;
};

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, consent, source } = (await req.json()) as AccessRequestPayload;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    const lead = {
      ...splitName(name),
      email: normalizedEmail,
    };

    await waitlistStore.addSubmission({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim(),
      message: message?.trim(),
      consent: consent ?? false,
      source: source ?? "access",
      userAgent: req.headers.get("user-agent") ?? undefined,
      referer: req.headers.get("referer") ?? undefined,
    });

    const mirrorResults = await Promise.allSettled([
      submitLeadToGoogleSheets(lead),
      submitLeadToMicroBackend(lead),
    ]);

    for (const result of mirrorResults) {
      if (result.status === "rejected") {
        console.error("Waitlist mirror submission failed:", result.reason);
      }
    }

    if (process.env.RESEND_API_KEY) {
      const resend = getResend();
      const from = process.env.MICRO_QUOTE_FROM ?? "MICRO <onboarding@resend.dev>";
      const to = process.env.MICRO_QUOTE_TO ?? "hello@microbythefix.com";

      await resend.emails.send({
        from,
        to,
        replyTo: normalizedEmail,
        subject: `New Access Request from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${normalizedEmail}`,
          `Phone: ${phone || "Not provided"}`,
          "",
          "Access Notes:",
          message || "Not provided",
        ].join("\n"),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Waitlist request stored successfully",
    }, { status: 201 });
  } catch (err) {
    console.error("Waitlist submission error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
