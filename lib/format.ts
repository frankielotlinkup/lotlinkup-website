// Display: "+1 (702) 286-8132". Returns the raw input unchanged for
// anything that doesn't parse as a 10- or 11-digit US-style number.
export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

// Tel link: E.164 with leading +. Browsers / iOS Phone treat the +1 country
// code as required for click-to-call to work reliably across networks.
export function formatPhoneHref(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  if (digits.length === 10) return `tel:+1${digits}`;
  return `tel:${raw.replace(/[^+0-9]/g, "")}`;
}
