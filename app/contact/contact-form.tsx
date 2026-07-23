"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const next: Record<string, string> = {};
    if (String(values.sender_name).trim().length < 2) next.sender_name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.sender_email))) next.sender_email = "Please enter a valid email.";
    if (String(values.message).trim().length < 10) next.message = "Please write at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
      if (!response.ok) throw new Error();
      form.reset(); setState("done");
    } catch { setState("error"); }
  }
  if (state === "done") return <div className="success"><p className="eyebrow">Sent with love</p><h2>Message received!</h2><p>I&apos;ll write back as soon as I can.</p><button className="button" onClick={() => setState("idle")}>Send another</button></div>;
  return <form className="form-card" onSubmit={submit} noValidate>
    <label>Name<input name="sender_name" autoComplete="name" aria-invalid={!!errors.sender_name} /><small>{errors.sender_name}</small></label>
    <label>Email<input name="sender_email" type="email" autoComplete="email" aria-invalid={!!errors.sender_email} /><small>{errors.sender_email}</small></label>
    <label>Your message<textarea name="message" rows={7} aria-invalid={!!errors.message} /><small>{errors.message}</small></label>
    <button className="button" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message →"}</button>
    {state === "error" && <p role="alert" style={{ color: "#bd3159" }}>Could not send. Please try again.</p>}
  </form>;
}
