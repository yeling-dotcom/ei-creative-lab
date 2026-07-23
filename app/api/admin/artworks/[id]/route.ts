import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json();
  const allowed = ["title", "description", "image_url", "category", "is_published", "is_featured", "sort_order"];
  const update = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  const supabase = await createClient();
  const { data, error } = await supabase.from("artworks").update(update).eq("id", (await params).id).select("*").single();
  if (error) return NextResponse.json({ error: "Artwork could not be updated." }, { status: 500 });
  return NextResponse.json({ artwork: data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { error } = await supabase.from("artworks").delete().eq("id", (await params).id);
  if (error) return NextResponse.json({ error: "Artwork could not be deleted." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
