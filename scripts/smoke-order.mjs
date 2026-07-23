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
const { data: created, error: createError } = await supabase.from("orders").insert({
  customer_name: "Sprint Smoke Test",
  customer_email: "smoke@example.com",
  product_type: "chibi_portrait",
  brief: "Temporary order used to verify the complete persistence workflow.",
  quantity: 1,
}).select("*").single();
if (createError) throw createError;

const { data: updated, error: updateError } = await supabase.from("orders")
  .update({ order_status: "reviewing", payment_status: "deposit_paid" })
  .eq("id", created.id).select("*").single();
if (updateError) throw updateError;
if (updated.order_status !== "reviewing" || updated.payment_status !== "deposit_paid") throw new Error("Update did not persist.");

const { error: deleteError } = await supabase.from("orders").delete().eq("id", created.id);
if (deleteError) throw deleteError;
console.log("order workflow: create → progress → cleanup passed");
