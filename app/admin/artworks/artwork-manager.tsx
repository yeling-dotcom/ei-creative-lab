"use client";

import { FormEvent, useState } from "react";

type Artwork = { id: string; title: string; description: string | null; image_url: string; category: string; sort_order: number; is_published: boolean; is_featured: boolean };

export function ArtworkManager({ initialArtworks }: { initialArtworks: Artwork[] }) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [error, setError] = useState("");

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/admin/artworks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) return setError(result.error);
    setArtworks(current => [result.artwork, ...current]); form.reset();
  }
  async function toggle(artwork: Artwork, field: "is_published" | "is_featured") {
    const response = await fetch(`/api/admin/artworks/${artwork.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ [field]: !artwork[field] }) });
    if (response.ok) { const { artwork: saved } = await response.json(); setArtworks(current => current.map(item => item.id === saved.id ? saved : item)); }
  }
  async function edit(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault(); setError("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/admin/artworks/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, sort_order: Number(body.sort_order) }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error);
    setArtworks(current => current.map(item => item.id === id ? result.artwork : item).sort((a, b) => a.sort_order - b.sort_order));
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this artwork permanently?")) return;
    const response = await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
    if (response.ok) setArtworks(current => current.filter(item => item.id !== id));
  }

  return <><form className="form-card compact-form" onSubmit={create}>
    <h3>Add artwork</h3><label>Title<input name="title" required /></label><label>Image URL<input name="image_url" type="url" required /></label><label>Category<select name="category"><option>chibi</option><option>stickers</option><option>portrait</option><option>illustration</option></select></label><label>Description<textarea name="description" rows={3} /></label><button className="button">Publish artwork</button>
  </form>{error && <p role="alert" style={{ color: "#bd3159" }}>{error}</p>}<div className="manage-grid">{artworks.map(art =>
    <article className="manage-card" key={art.id}>
      <img src={art.image_url} alt="" />
      <form className="artwork-edit" onSubmit={event => edit(event, art.id)}>
        <label>Title<input name="title" defaultValue={art.title} required /></label>
        <label>Image URL<input name="image_url" type="url" defaultValue={art.image_url} required /></label>
        <label>Category<input name="category" defaultValue={art.category} /></label>
        <label>Order<input name="sort_order" type="number" defaultValue={art.sort_order} /></label>
        <label className="wide">Description<textarea name="description" rows={3} defaultValue={art.description ?? ""} /></label>
        <div className="actions wide"><button type="submit">Save edits</button><button type="button" onClick={() => toggle(art, "is_published")}>{art.is_published ? "Unpublish" : "Publish"}</button><button type="button" onClick={() => toggle(art, "is_featured")}>{art.is_featured ? "Unfeature" : "Feature"}</button><button type="button" className="danger" onClick={() => remove(art.id)}>Delete</button></div>
      </form>
    </article>
  )}</div></>;
}
