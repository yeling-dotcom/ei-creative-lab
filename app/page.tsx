import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: artworks } = await supabase.from("artworks").select("*").eq("is_published", true).order("sort_order");
  const featured = artworks?.find((art) => art.is_featured) ?? artworks?.[0];
  return (
    <main>
      <section className="hero">
        <div><p className="eyebrow">Custom chibis & happy little things</p><h1>Made tiny.<br />Loved big.</h1><p className="lede">Personal portraits and sticker packs drawn to capture the details that make you—and your favourite people—wonderfully you.</p><div className="actions"><Link className="button" href="/order">Start a custom order →</Link><Link className="button secondary" href="/gallery">See the gallery</Link></div></div>
        <div className="hero-art">{featured && <img src={featured.image_url} alt={featured.title} />}</div>
      </section>
      <div className="section-head"><div><p className="eyebrow">Fresh from the sketchbook</p><h2>Selected work</h2></div><Link href="/gallery">View all →</Link></div>
      {!artworks?.length ? <div className="empty">New artwork is on its way.</div> : <section className="art-grid">{artworks.slice(0, 3).map(art => <article className="art-card" key={art.id}><img src={art.image_url} alt={art.title} /><div><span className="tag">{art.category}</span><h3>{art.title}</h3><p>{art.description}</p></div></article>)}</section>}
    </main>
  );
}
