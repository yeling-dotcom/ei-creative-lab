import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
    }),
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data: art, error: artError } = await supabase.from("artworks").insert({
  title: "Smoke Test Art", slug: `smoke-${Date.now()}`, image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
  category: "illustration", is_published: false,
}).select("*").single();
if (artError) throw artError;
const { data: published, error: publishError } = await supabase.from("artworks").update({ is_published: true }).eq("id", art.id).select("*").single();
if (publishError || !published.is_published) throw publishError ?? new Error("Publish failed.");

const { data: message, error: messageError } = await supabase.from("contact_messages").insert({
  sender_name: "Smoke Test", sender_email: "smoke@example.com", message: "Temporary message for persistence verification.",
}).select("*").single();
if (messageError) throw messageError;

await supabase.from("artworks").delete().eq("id", art.id);
await supabase.from("contact_messages").delete().eq("id", message.id);
console.log("content workflow: create → publish → contact → cleanup passed");
