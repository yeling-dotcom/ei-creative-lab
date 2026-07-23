import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const statuses = ["new", "reviewing", "in_progress", "proof_ready", "completed", "cancelled"];
const payments = ["unpaid", "deposit_paid", "paid", "refunded"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (statuses.includes(body.order_status)) update.order_status = body.order_status;
  if (payments.includes(body.payment_status)) update.payment_status = body.payment_status;
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").update(update).eq("id", (await params).id).select("*").single();
  if (error) return NextResponse.json({ error: "Update failed." }, { status: 500 });
  return NextResponse.json({ order: data });
}
