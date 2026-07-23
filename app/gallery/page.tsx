import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Gallery", description: "Chibi portraits, stickers, and illustrations by Ei Creative Lab." };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: artworks, error } = await supabase.from("artworks").select("*").eq("is_published", true).order("sort_order");
  return <main><p className="eyebrow">The colourful archive</p><h1>Little worlds,<br />one drawing at a time.</h1><p className="lede">Browse recent commissions, character studies, and sticker experiments.</p>
    {error ? <div className="empty">The gallery could not be loaded.</div> : !artworks?.length ? <div className="empty">No artwork published yet.</div> : <section className="art-grid">{artworks.map(art => <article className="art-card" key={art.id}><img src={art.image_url} alt={art.title} /><div><span className="tag">{art.category}</span><h3>{art.title}</h3><p>{art.description}</p></div></article>)}</section>}
  </main>;
}
