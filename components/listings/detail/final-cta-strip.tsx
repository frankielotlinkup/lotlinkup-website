import { formatPhoneDisplay, formatPhoneHref } from "@/lib/format";

export function FinalCtaStrip({ phone }: { phone: string | null }) {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-3xl px-6 py-12 text-center sm:px-8 md:py-20">
        <h2 className="font-serif text-[28px] font-normal tracking-[-0.01em] text-paper md:text-[36px]">
          Ready to make this yours?
        </h2>
        <p className="mt-4 text-base leading-[1.55] text-paper/80 md:text-[17px]">
          Reach out and we&apos;ll get you the details, the numbers, and
          answers to anything you need.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#lead-form"
            className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
          >
            Request Details
          </a>
          {phone && (
            <a
              href={formatPhoneHref(phone)}
              className="inline-block rounded-md border border-paper px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Call/text {formatPhoneDisplay(phone)}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
