<!--
TEMPLATE — DOUBLE-LOT (COMBO) LISTING.
Copy this into a new property folder under Lot Linkup Properties/Active/ in Drive,
then rename to property-info.md. Fill in the bullets marked "you fill" —
Claude fills the marketing copy (marked "Claude fills") at publish time.

Use this ONLY for two side-by-side lots a buyer can purchase together or one at
a time. For a normal single lot, use property-info-TEMPLATE.md instead.

How the sync reads this file:
  - Only lines that look like "- Field Name: value" are parsed. Headers, comments, and dividers are ignored.
  - Field names are case-insensitive. Leave blank or write "TBD" for anything unknown — those are skipped.
  - Owner Financing must be "yes" or "no". Numbers can be plain ("12000") or with $/commas.
  - State Code is the two-letter abbreviation (AL, TX, MO, etc.).
  - "- Listing Type: combo" is what turns this into the double-lot page. Without that line it's treated as a normal single listing.
  - The three "## Both lots together / ## Lot A / ## Lot B" sections each become a toggle option on the page. Everything above them is shared by all three.

Images — make THREE folders in this property folder (not one Images/ folder):
  - Images-Both/   photos showing both lots together (aerials, outline shots)
  - Images-LotA/   photos of Lot A only
  - Images-LotB/   photos of Lot B only
  To control the hero for an option, prefix one filename in that folder with "hero-".

After saving this file in Drive, also:
  1. Create ONE inventory row in the CRM carrying either lot's APN — the sync only updates existing rows, it never inserts.
  2. Trigger the sync (curl, or just ask Claude to run it).
-->

## INTAKE — shared, you fill
- Listing Type: combo
- State:
- State Code:
- County:
- City:
- Maps Link:
- Zoning:
- HOA:
- Road Access:
- Utilities:

---

## ACQUISITION — internal only, never published, you fill
- Purchased:
- Purchase Price:
- Source:
- Target Sale Price:
- Target Margin:

---

## LISTING DETAILS — shared marketing, Claude fills
- Nearest Town:
- Nearest Recreation:
- Terrain:
- Best Use Cases:
- Lead Hook:

---
<!-- The three options below. In each: you fill the size/price bullets; Claude writes the Description. -->

## Both lots together
- Acres:
- APN:
- Cash Price:
- Owner Financing:
- Financed Price:
- Down Payment:
- Monthly Payment:
- Term Months:
- Interest Rate:
- Description:

## Lot A
- Acres:
- APN:
- Cash Price:
- Owner Financing:
- Financed Price:
- Down Payment:
- Monthly Payment:
- Term Months:
- Interest Rate:
- Description:

## Lot B
- Acres:
- APN:
- Cash Price:
- Owner Financing:
- Financed Price:
- Down Payment:
- Monthly Payment:
- Term Months:
- Interest Rate:
- Description:
