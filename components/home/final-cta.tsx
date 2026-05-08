import Link from "next/link";
import { SectionTitle } from "@/components/section-title";

function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

export function HomeFinalCta({ phone }: { phone: string | null }) {
  const telHref = phone ? `tel:${phone.replace(/[^+0-9]/g, "")}` : null;

  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-3xl px-6 py-14 text-center sm:px-8 md:py-20">
        <SectionTitle
          headline="Find your land. Make it yours."
          subhead={
            <>
              Browse our active inventory or reach out &mdash; we&apos;re a
              phone call away.
            </>
          }
          align="center"
          variant="dark"
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/land-for-sale"
            className="inline-flex items-center justify-center rounded-md bg-accent px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
          >
            Browse Land for Sale
          </Link>
          {phone && telHref && (
            <a
              href={telHref}
              className="inline-flex items-center justify-center rounded-md border-[1.5px] border-paper px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Call or text {formatPhoneDisplay(phone)}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
