import { OrderForm } from "./order-form";

export const metadata = { title: "Order custom art", description: "Request a custom chibi portrait or sticker pack." };

export default function OrderPage() {
  return <main><div className="form-layout"><section><p className="eyebrow">Commission your own</p><h1>Tell me your tiny big idea.</h1><p className="lede">Send the details below. I&apos;ll review your request and email a timeline and quote before any payment is due.</p><div className="notice">No payment today. Your order starts only after you approve the quote.</div></section><OrderForm /></div></main>;
}
