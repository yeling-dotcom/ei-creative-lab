"use client";

import { FormEvent, useState } from "react";

type Order = {
  id: string; created_at: string; customer_name: string; customer_email: string;
  customer_phone: string | null; product_type: string; brief: string;
  reference_url: string | null; quantity: number; order_status: string;
  payment_status: string; quoted_amount: number | null; owner_notes: string | null;
};

export function OrderBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [saving, setSaving] = useState("");

  async function update(id: string, field: "order_status" | "payment_status", value: string) {
    setSaving(id + field);
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ [field]: value }) });
    if (response.ok) { const { order } = await response.json(); setOrders(current => current.map(item => item.id === id ? order : item)); }
    setSaving("");
  }

  async function saveDetails(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    setSaving(id + "details");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (response.ok) { const { order } = await response.json(); setOrders(current => current.map(item => item.id === id ? order : item)); }
    setSaving("");
  }

  if (!orders.length) return <div className="empty">No orders yet. New requests will appear here.</div>;
  return <div className="order-list">{orders.map(order =>
    <article className="order-card" key={order.id}>
      <div>
        <div className="order-meta"><span>{new Date(order.created_at).toLocaleDateString()}</span><span>•</span><span>{order.product_type.replaceAll("_", " ")}</span><span>•</span><span>Qty {order.quantity}</span></div>
        <h3>{order.customer_name}</h3>
        <p><a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>{order.customer_phone && <> · <a href={`tel:${order.customer_phone}`}>{order.customer_phone}</a></>}</p>
        <p>{order.brief}</p>
        {order.reference_url && <p><a href={order.reference_url} target="_blank" rel="noreferrer">Open reference image ↗</a></p>}
        <span className="tag">{order.id.slice(0, 8)}</span>
      </div>
      <div className="order-controls">
        <label>Status<select value={order.order_status} disabled={saving === order.id + "order_status"} onChange={event => update(order.id, "order_status", event.target.value)}>{["new","reviewing","in_progress","proof_ready","completed","cancelled"].map(value => <option value={value} key={value}>{value.replaceAll("_"," ")}</option>)}</select></label>
        <label>Payment<select value={order.payment_status} disabled={saving === order.id + "payment_status"} onChange={event => update(order.id, "payment_status", event.target.value)}>{["unpaid","deposit_paid","paid","refunded"].map(value => <option value={value} key={value}>{value.replaceAll("_"," ")}</option>)}</select></label>
        <form className="order-details" onSubmit={event => saveDetails(event, order.id)}>
          <label>Quote (MYR)<input name="quoted_amount" type="number" min="0" step="0.01" defaultValue={order.quoted_amount ?? ""} /></label>
          <label>Studio notes<textarea name="owner_notes" rows={3} defaultValue={order.owner_notes ?? ""} /></label>
          <button disabled={saving === order.id + "details"}>{saving === order.id + "details" ? "Saving…" : "Save details"}</button>
        </form>
      </div>
    </article>
  )}</div>;
}
