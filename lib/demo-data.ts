/**
 * TEMPORARY DEMO DATA — Phase 1 Step 3.
 *
 * Used to preview the /land-for-sale design before real inventory ships.
 * Merged into getPublishedListings() ONLY when
 *   process.env.NEXT_PUBLIC_LOTLINKUP_DEMO === "1"
 *
 * Remove this file (and the demo merge in lib/listings.ts) in Step 6
 * when real published rows go live.
 */

import type { PublicListing } from "./listings";

const NULL_LISTING: Omit<PublicListing, "id"> = {
  slug: null,
  state: null,
  state_code: null,
  city: null,
  county: null,
  acreage: null,
  latitude: null,
  longitude: null,
  google_maps_url: null,
  cash_price: null,
  financing_available: null,
  down_payment: null,
  monthly_payment: null,
  term_months: null,
  interest_rate: null,
  road_access: null,
  utilities: null,
  topography: null,
  nearest_recreation: null,
  nearest_town: null,
  best_use_cases: null,
  description: null,
  lead_hook: null,
  main_image: null,
  gallery: null,
  date_listed: null,
};

export const DEMO_LISTINGS: PublicListing[] = [
  {
    ...NULL_LISTING,
    id: "demo-1",
    slug: "demo-0-36-acre-livingston-tx",
    acreage: 0.36,
    county: "Polk County",
    city: "Livingston",
    state: "Texas",
    state_code: "TX",
    financing_available: true,
    cash_price: 25000,
    down_payment: 5000,
    monthly_payment: 389,
    term_months: 60,
    interest_rate: 9.9,
    lead_hook:
      "Mobile-home-friendly lot in a quiet wooded subdivision, minutes from Lake Livingston.",
  },
  {
    ...NULL_LISTING,
    id: "demo-2",
    slug: "demo-0-44-acre-corsicana-tx",
    acreage: 0.44,
    county: "Navarro County",
    city: "Corsicana",
    state: "Texas",
    state_code: "TX",
    financing_available: true,
    cash_price: 19500,
    down_payment: 3500,
    monthly_payment: 325,
    term_months: 60,
    interest_rate: 9.9,
    lead_hook:
      "Walkable to Navarro Mills Lake. Power and water at the road.",
  },
  {
    ...NULL_LISTING,
    id: "demo-3",
    slug: "demo-9-5-acre-cherokee-county-ok",
    acreage: 9.5,
    county: "Cherokee County",
    city: "Tahlequah",
    state: "Oklahoma",
    state_code: "OK",
    financing_available: false,
    cash_price: 52000,
    lead_hook:
      "All utilities at the road. Cleared building site, mature hardwoods, road frontage.",
  },
  {
    ...NULL_LISTING,
    id: "demo-4",
    slug: "demo-0-50-acre-lake-texoma-ok",
    acreage: 0.5,
    county: "Marshall County",
    city: "Kingston",
    state: "Oklahoma",
    state_code: "OK",
    financing_available: false,
    cash_price: 34000,
    lead_hook:
      "Direct waterfront access. Sandy beach. Mobile homes allowed.",
  },
];
