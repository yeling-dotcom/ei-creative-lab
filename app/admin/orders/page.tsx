import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OrderBoard } from "./order-board";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  return <main><div className="admin-shell"><aside className="admin-nav"><p className="eyebrow">Studio</p><Link href="/admin/orders">Orders</Link><Link href="/admin/artworks">Artwork</Link><Link href="/admin/messages">Messages</Link><Link href="/">View site ↗</Link></aside><section><p className="eyebrow">Commission desk</p><h2>Customer orders</h2><p className="lede">Review requests, record quotes and notes, and keep progress and payment state current.</p><OrderBoard initialOrders={orders ?? []} /></section></div></main>;
}
