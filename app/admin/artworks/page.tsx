import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArtworkManager } from "./artwork-manager";

export const dynamic = "force-dynamic";

export default async function AdminArtworksPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("artworks").select("*").order("sort_order");
  return <main><div className="admin-shell"><aside className="admin-nav"><p className="eyebrow">Studio</p><Link href="/admin/orders">Orders</Link><Link href="/admin/artworks">Artwork</Link><Link href="/admin/messages">Messages</Link><Link href="/">View site ↗</Link></aside><section><p className="eyebrow">Portfolio desk</p><h2>Manage artwork</h2><p className="lede">Publish, edit, feature, order, or remove everything visitors see.</p><ArtworkManager initialArtworks={data ?? []} /></section></div></main>;
}
