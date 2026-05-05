"use client";

import { useState, type FormEvent, type ReactNode } from "react";

const inputClass =
  "block w-full rounded-md border border-paper-edge bg-white px-3 py-2 type-body text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="type-small font-medium text-ink">
        {label}
        {required && (
          <span className="text-accent ml-0.5" aria-hidden="true">
            *
          </span>
        )}
        {hint && (
          <span className="type-small text-muted font-normal ml-2">{hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("contact form submitted", { name, email, phone, message });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-lg border border-paper-edge bg-white p-6"
      >
        <p className="type-body text-ink">
          Thanks — your message was logged to the console. (Form delivery is
          wired up in Step 7.)
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <Field label="Name" htmlFor="name" required>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Email" htmlFor="email" required>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Phone" htmlFor="phone" hint="Optional">
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Message" htmlFor="message" required>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </Field>
      <button
        type="submit"
        className="self-start rounded-md bg-accent px-6 py-3 type-body font-medium text-white transition-colors hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Send message
      </button>
    </form>
  );
}
