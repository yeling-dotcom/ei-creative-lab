import { ContactForm } from "./contact-form";

export const metadata = { title: "Contact", description: "Say hello to Ei Creative Lab." };

export default function ContactPage() {
  return <main><div className="form-layout"><section><p className="eyebrow">Notes, questions, hellos</p><h1>Let&apos;s make something joyful.</h1><p className="lede">Have a collaboration in mind, a question about commissions, or just want to say hi? Send a note here.</p></section><ContactForm /></div></main>;
}
