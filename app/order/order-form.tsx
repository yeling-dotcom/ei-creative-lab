"use client";

import { FormEvent, useState } from "react";

export function OrderForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [orderId, setOrderId] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const next: Record<string, string> = {};
    if (String(values.customer_name).trim().length < 2) next.customer_name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.customer_email))) next.customer_email = "Please enter a valid email.";
    if (String(values.brief).trim().length < 20) next.brief = "Please share at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("sending");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json();
      if (!response.ok) { if (result.errors) setErrors(result.errors); throw new Error(result.error); }
      setOrderId(result.id); form.reset(); setState("done");
    } catch { setState("error"); }
  }
  if (state === "done") return <div className="success"><p className="eyebrow">Order received</p><h2>Thank you!</h2><p>Your request is safely in the studio queue. I&apos;ll email you with timing and a quote.</p><p><strong>Reference:</strong> {orderId.slice(0, 8).toUpperCase()}</p><button className="button" onClick={() => setState("idle")}>Make another request</button></div>;
  return <form className="form-card" onSubmit={submit} noValidate>
    <label>Your name<input name="customer_name" autoComplete="name" aria-invalid={!!errors.customer_name} /><small>{errors.customer_name}</small></label>
    <label>Email<input name="customer_email" type="email" autoComplete="email" aria-invalid={!!errors.customer_email} /><small>{errors.customer_email}</small></label>
    <label>Phone (optional)<input name="customer_phone" autoComplete="tel" /></label>
    <label>What would you like?<select name="product_type"><option value="chibi_portrait">Custom chibi portrait</option><option value="sticker_pack">Custom sticker pack</option></select></label>
    <label>Quantity<input name="quantity" type="number" min="1" max="100" defaultValue="1" /></label>
    <label>Tell me about your idea<textarea name="brief" rows={6} placeholder="Who or what should I draw? Share the mood, colours, special details…" aria-invalid={!!errors.brief} /><small>{errors.brief}</small></label>
    <label>Reference image link (optional)<input name="reference_url" type="url" placeholder="https://…" /></label>
    <button className="button" disabled={state === "sending"}>{state === "sending" ? "Saving your request…" : "Send order request →"}</button>
    {state === "error" && <p role="alert" style={{ color: "#bd3159" }}>Something went wrong. Please try again.</p>}
  </form>;
}
