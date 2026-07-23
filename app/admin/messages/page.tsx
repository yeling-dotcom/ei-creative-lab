import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MessageInbox } from "./message-inbox";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  return <main><div className="admin-shell"><aside className="admin-nav"><p className="eyebrow">Studio</p><Link href="/admin/orders">Orders</Link><Link href="/admin/artworks">Artwork</Link><Link href="/admin/messages">Messages</Link><Link href="/">View site ↗</Link></aside><section><p className="eyebrow">Inbox</p><h2>Contact messages</h2><p className="lede">Read, reply to, and clear messages sent from the public contact form.</p><MessageInbox initialMessages={data ?? []} /></section></div></main>;
}
