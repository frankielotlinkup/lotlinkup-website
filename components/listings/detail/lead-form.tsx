"use client";

import { useState, type FormEvent } from "react";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/format";

const inputClass =
  "block w-full rounded-md border border-paper-edge bg-white px-3 py-2 text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export function LeadForm({
  prefilledMessage,
  phone,
}: {
  prefilledMessage: string;
  phone: string | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [message, setMessage] = useState(prefilledMessage);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("listing inquiry submitted", {
      name,
      email,
      phone: phoneVal,
      message,
    });
    setSubmitted(true);
  }

  return (
    <section id="lead-form" className="scroll-mt-20 bg-paper">
      <h2 className="type-h2">Request details</h2>
      <p className="mt-3 text-base text-ink-soft">
        Fill out the form and we&apos;ll get back to you within 24 hours.
        {phone ? (
          <>
            {" "}
            Or call/text us directly at{" "}
            <a
              href={formatPhoneHref(phone)}
              className="text-accent underline underline-offset-2 transition-colors hover:text-accent-deep"
            >
              {formatPhoneDisplay(phone)}
            </a>
            .
          </>
        ) : null}
      </p>

      <div className="mt-8 max-w-3xl rounded-md border border-paper-edge bg-white p-6 md:p-8">
        {submitted ? (
          <p
            role="status"
            className="font-serif text-[20px] font-normal text-ink"
          >
            Thanks! We&apos;ll be in touch within 24 hours.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
            noValidate
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">
                Name
                <span className="ml-0.5 text-accent" aria-hidden="true">
                  *
                </span>
              </span>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">
                Email
                <span className="ml-0.5 text-accent" aria-hidden="true">
                  *
                </span>
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-sm font-medium text-ink">
                Phone
                <span className="ml-2 text-sm font-normal text-muted">
                  Optional
                </span>
              </span>
              <input
                type="tel"
                autoComplete="tel"
                value={phoneVal}
                onChange={(e) => setPhoneVal(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-sm font-medium text-ink">
                Message
                <span className="ml-0.5 text-accent" aria-hidden="true">
                  *
                </span>
              </span>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:w-auto"
              >
                Send Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
