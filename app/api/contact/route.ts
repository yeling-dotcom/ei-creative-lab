import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const sender_name = typeof body.sender_name === "string" ? body.sender_name.trim() : "";
  const sender_email = typeof body.sender_email === "string" ? body.sender_email.trim().toLowerCase() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const errors: Record<string, string> = {};
  if (sender_name.length < 2) errors.sender_name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender_email)) errors.sender_email = "Please enter a valid email.";
  if (message.length < 10) errors.message = "Please write at least 10 characters.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ sender_name, sender_email, message });
  if (error) return NextResponse.json({ error: "Message could not be saved." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
