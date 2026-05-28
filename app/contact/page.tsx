import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with LotLinkUp.",
};

export default function ContactPage() {
  return (
    <div className="bg-paper py-16 lg:py-24">
      <Container>
        <header className="max-w-3xl">
          <h1 className="type-h1">Get in touch.</h1>
          <p className="type-body text-ink-soft mt-4">
            Send us a note and we&apos;ll get back to you as soon as we can.
          </p>
        </header>
        <div className="mt-12 max-w-xl">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
