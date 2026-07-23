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

const { data: order, error: orderError } = await supabase.from("orders").insert({
  customer_name: "Owner Control Test", customer_email: "owner-smoke@example.com",
  customer_phone: "+60123456789", product_type: "sticker_pack",
  brief: "Temporary request that verifies quote and studio-note persistence.",
  reference_url: "https://example.com/reference.png", quantity: 2,
}).select("*").single();
if (orderError) throw orderError;
const { data: quoted, error: quoteError } = await supabase.from("orders").update({
  quoted_amount: 128.50, owner_notes: "Quote approved in smoke test.",
  order_status: "in_progress", payment_status: "deposit_paid",
}).eq("id", order.id).select("*").single();
if (quoteError || Number(quoted.quoted_amount) !== 128.5 || !quoted.owner_notes) throw quoteError ?? new Error("Owner order details did not persist.");

const { data: message, error: messageError } = await supabase.from("contact_messages").insert({
  sender_name: "Inbox Test", sender_email: "inbox-smoke@example.com", message: "Temporary owner inbox verification.",
}).select("*").single();
if (messageError) throw messageError;
const { data: read, error: readError } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", message.id).select("*").single();
if (readError || !read.is_read) throw readError ?? new Error("Message read state did not persist.");

await supabase.from("orders").delete().eq("id", order.id);
await supabase.from("contact_messages").delete().eq("id", message.id);
console.log("owner workflow: customer details → quote/notes → progress/payment → inbox → cleanup passed");
