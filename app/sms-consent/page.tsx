import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "SMS Consent Authorization",
  robots: { index: false, follow: false },
};

// Printable SMS/text consent authorization form. Buyers complete and sign this as
// part of their seller-financing closing packet, providing express written consent
// to receive account & payment notification texts. Public URL used as the opt-in
// proof for 10DLC (Lot Link Up "Payment Reminders" campaign).
export default function SmsConsentPage() {
  const line = "inline-block border-b border-ink/40 align-baseline";
  return (
    <div className="bg-paper py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl">
          <p className="type-small text-accent-deep font-semibold tracking-wide uppercase">Lot Link Up</p>
          <h1 className="type-h1 mt-2">SMS / Text Message Consent Authorization</h1>
          <p className="type-body text-ink-soft mt-4">
            Completed and signed by the buyer as part of the Lot Link Up seller-financing closing packet.
          </p>

          <div className="mt-10 space-y-6 rounded-xl border border-paper-edge bg-paper-warm p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label className="type-small text-ink-soft">Buyer name</label>
                <div className={`${line} mt-6 w-full`} />
              </div>
              <div>
                <label className="type-small text-ink-soft">Property / Parcel</label>
                <div className={`${line} mt-6 w-full`} />
              </div>
              <div>
                <label className="type-small text-ink-soft">Mobile phone number</label>
                <div className={`${line} mt-6 w-full`} />
              </div>
              <div>
                <label className="type-small text-ink-soft">Date</label>
                <div className={`${line} mt-6 w-full`} />
              </div>
            </div>

            <div className="border-t border-paper-edge pt-6">
              <p className="type-body text-ink">
                <span className="mr-2 inline-block h-4 w-4 translate-y-0.5 rounded-sm border border-ink/50" aria-hidden />
                By providing my mobile number above and signing below, I agree to receive account and payment
                notification text messages from <strong>Lot Link Up</strong> about my land contract (such as
                payment reminders and payment confirmations) at the number provided, and I may reply with
                questions about my account. <strong>Consent to receive text messages is not a condition of
                purchase.</strong> Message frequency varies. Message and data rates may apply. I can reply
                <strong> STOP</strong> to opt out at any time, or <strong>HELP</strong> for help. Lot Link Up
                will not sell or share my mobile information with third parties for promotional or marketing
                purposes.
              </p>
              <p className="type-small text-ink-soft mt-4">
                See our Privacy Policy at{" "}
                <a href="https://www.lotlinkup.com/privacy" className="text-accent-deep underline">
                  lotlinkup.com/privacy
                </a>
                .
              </p>
            </div>

            <div className="border-t border-paper-edge pt-8">
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
                <div>
                  <div className={`${line} w-full`} />
                  <p className="type-small text-ink-soft mt-2">Buyer signature</p>
                </div>
                <div>
                  <div className={`${line} w-full`} />
                  <p className="type-small text-ink-soft mt-2">Date</p>
                </div>
              </div>
            </div>
          </div>

          <p className="type-small text-ink-soft mt-6">
            Questions? Email{" "}
            <a href="mailto:support@lotlinkup.com" className="text-accent-deep underline">
              support@lotlinkup.com
            </a>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
