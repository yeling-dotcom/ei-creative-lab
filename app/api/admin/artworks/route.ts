import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const image_url = String(body.image_url ?? "").trim();
  if (title.length < 2 || !/^https?:\/\//.test(image_url)) return NextResponse.json({ error: "Title and a valid image URL are required." }, { status: 422 });
  const supabase = await createClient();
  const { data, error } = await supabase.from("artworks").insert({
    title, slug: `${slugify(title)}-${Date.now().toString(36)}`,
    description: String(body.description ?? "").trim(),
    image_url, category: String(body.category ?? "illustration"),
    is_published: body.is_published !== false,
  }).select("*").single();
  if (error) return NextResponse.json({ error: "Artwork could not be saved." }, { status: 500 });
  return NextResponse.json({ artwork: data }, { status: 201 });
}
