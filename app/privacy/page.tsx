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
        <p className="type-small text-ink-soft mt-3">Last updated: June 29, 2026</p>

        <div className="mt-8 max-w-2xl space-y-8">
          <section className="space-y-3">
            <p className="type-body text-ink-soft">
              Lot Link Up (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy.
              This Privacy Policy explains what information we collect, how we use it, and the choices you
              have. It applies to www.lotlinkup.com and to the way we communicate with our land buyers and
              interested customers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="type-h3">Information we collect</h2>
            <p className="type-body text-ink-soft">
              We collect information you provide directly to us, such as your name, mailing address, email
              address, and mobile phone number, as well as information related to any land purchase or
              owner-financing agreement you enter into with us. We may also collect basic usage information
              when you visit our website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="type-h3">How we use your information</h2>
            <p className="type-body text-ink-soft">
              We use your information to sell and finance land, service your account, process and track
              payments, respond to your questions, send account and payment notifications, and comply with
              our legal obligations. We do not use your information for third-party advertising.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="type-h3">SMS / text messaging</h2>
            <p className="type-body text-ink-soft">
              If you are a Lot Link Up owner-financing customer and provide your mobile number (for example,
              on your signed purchase and financing agreement), you may receive account and payment
              notification text messages from us &mdash; such as payment reminders and payment confirmations
              &mdash; and you may reply with questions about your account. Consent to receive text messages is
              not a condition of any purchase.
            </p>
            <p className="type-body text-ink-soft">
              Message frequency varies. Message and data rates may apply. You can opt out at any time by
              replying <strong>STOP</strong>, and you can reply <strong>HELP</strong> for assistance.
            </p>
            <p className="type-body text-ink-soft">
              <strong>
                Lot Link Up will not sell or share your mobile information, or your consent to receive text
                messages, with third parties or affiliates for their promotional or marketing purposes.
              </strong>{" "}
              Mobile opt-in data is used solely to deliver the account and payment messages described above.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="type-h3">How we share information</h2>
            <p className="type-body text-ink-soft">
              We do not sell your personal information. We may share information with service providers who
              help us operate our business (for example, payment processing, accounting, and messaging
              providers), and when required by law. These providers are permitted to use your information only
              to perform services for us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="type-h3">Data security &amp; retention</h2>
            <p className="type-body text-ink-soft">
              We use reasonable administrative and technical safeguards to protect your information, and we
              retain it for as long as needed to service your account and meet our legal and record-keeping
              obligations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="type-h3">Your choices</h2>
            <p className="type-body text-ink-soft">
              You may opt out of text messages at any time by replying STOP. You may also contact us to
              update your information or ask questions about how your information is handled.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="type-h3">Contact us</h2>
            <p className="type-body text-ink-soft">
              Questions about this Privacy Policy? Email us at{" "}
              <a href="mailto:support@lotlinkup.com" className="text-accent-deep underline">
                support@lotlinkup.com
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
