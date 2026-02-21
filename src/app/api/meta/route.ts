import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN!;
const META_API_VERSION = process.env.META_API_VERSION ?? "v19.0";
const META_PAGE_ID = process.env.META_PAGE_ID ?? "";
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "accounts") {
    const res = await fetch(
      `${BASE_URL}/me/adaccounts?fields=id,name,account_status,currency&access_token=${META_ACCESS_TOKEN}`
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message ?? "Meta API error" }, { status: 502 });
    }
    return NextResponse.json({ accounts: data.data ?? [] });
  }

  if (action === "campaigns") {
    const accountId = searchParams.get("accountId");
    if (!accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 });
    }
    const res = await fetch(
      `${BASE_URL}/${accountId}/campaigns?fields=id,name,status,objective&access_token=${META_ACCESS_TOKEN}`
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message ?? "Meta API error" }, { status: 502 });
    }
    return NextResponse.json({ campaigns: data.data ?? [] });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action, recipientId, messageText } = body;

  if (action === "send_message") {
    if (!META_PAGE_ID) {
      return NextResponse.json({ error: "META_PAGE_ID not configured" }, { status: 500 });
    }
    const res = await fetch(
      `${BASE_URL}/${META_PAGE_ID}/messages?access_token=${META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: messageText },
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message ?? "Meta API error" }, { status: 502 });
    }
    return NextResponse.json({ messageId: data.message_id });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
