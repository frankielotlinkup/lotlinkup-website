import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="bg-paper py-16 lg:py-24">
      <Container>
        <h1 className="type-h1">Privacy Policy</h1>
        <p className="type-body text-ink-soft mt-4 max-w-2xl">Coming soon.</p>
      </Container>
    </div>
  );
}
