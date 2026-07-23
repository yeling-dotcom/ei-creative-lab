import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const customer_name = typeof body.customer_name === "string" ? body.customer_name.trim() : "";
  const customer_email = typeof body.customer_email === "string" ? body.customer_email.trim().toLowerCase() : "";
  const customer_phone = typeof body.customer_phone === "string" ? body.customer_phone.trim() : null;
  const product_type = body.product_type === "sticker_pack" ? "sticker_pack" : "chibi_portrait";
  const brief = typeof body.brief === "string" ? body.brief.trim() : "";
  const reference_url = typeof body.reference_url === "string" && body.reference_url.trim() ? body.reference_url.trim() : null;
  const quantity = Number(body.quantity) || 1;
  const errors: Record<string, string> = {};
  if (customer_name.length < 2) errors.customer_name = "Please enter your name.";
  if (!emailPattern.test(customer_email)) errors.customer_email = "Please enter a valid email.";
  if (brief.length < 20) errors.brief = "Tell me a little more (at least 20 characters).";
  if (quantity < 1 || quantity > 100) errors.quantity = "Quantity must be between 1 and 100.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").insert({ customer_name, customer_email, customer_phone, product_type, brief, reference_url, quantity }).select("id").single();
  if (error) { console.error("Order insert failed", error.code); return NextResponse.json({ error: "We could not save your order. Please try again." }, { status: 500 }); }
  return NextResponse.json({ id: data.id }, { status: 201 });
}
