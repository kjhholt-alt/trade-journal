import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");

function readWaitlist(): string[] {
  try {
    if (fs.existsSync(WAITLIST_FILE)) {
      return JSON.parse(fs.readFileSync(WAITLIST_FILE, "utf-8"));
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function writeWaitlist(emails: string[]) {
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(emails, null, 2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const emails = readWaitlist();
    if (!emails.includes(email)) {
      emails.push(email);
      writeWaitlist(emails);
    }

    return NextResponse.json({ success: true, count: emails.length });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const emails = readWaitlist();
  return NextResponse.json({ count: emails.length });
}
