/**
 * TEMPORARY DEMO DATA — Phase 1 Step 3+.
 *
 * Used to preview the /land-for-sale and /listings/[slug] designs
 * before real inventory ships. Merged in ONLY when
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
  finance_price: null,
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
  apn: null,
  available_terms: null,
};

const PLACEHOLDER_GALLERY = [
  "placeholder-1",
  "placeholder-2",
  "placeholder-3",
  "placeholder-4",
];

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
    latitude: 30.7102,
    longitude: -94.933,
    financing_available: true,
    cash_price: 25000,
    down_payment: 5000,
    monthly_payment: 389,
    term_months: 60,
    interest_rate: 9.9,
    available_terms: "24,36,48,60",
    road_access: "Paved county road",
    utilities: "Power and water at the road",
    topography: "Gently rolling, partially wooded",
    nearest_recreation:
      "5 minutes to Lake Livingston (the second-largest lake in Texas)",
    nearest_town: "12 minutes to Livingston · 75 minutes to Houston",
    best_use_cases:
      "Mobile home, RV parking, Weekend cabin, Hunting retreat, Investment hold",
    description:
      "A quiet third-of-an-acre tucked into a wooded subdivision a short drive from Lake Livingston. The lot is partially cleared, with mature pines and a gentle slope toward the back. Power and water are run to the road, so you can plug in a mobile home or RV without the usual six-month utility headaches. The HOA allows mobile homes and weekend cabins. A local fishing camp sits five minutes away, and you'll be in town in under fifteen.",
    lead_hook:
      "Mobile-home-friendly lot in a quiet wooded subdivision, minutes from Lake Livingston.",
    gallery: PLACEHOLDER_GALLERY,
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
    latitude: 31.9938,
    longitude: -96.4083,
    financing_available: true,
    cash_price: 19500,
    down_payment: 3500,
    monthly_payment: 325,
    term_months: 60,
    interest_rate: 9.9,
    available_terms: "36,48,60",
    road_access: "Gravel county road, year-round access",
    utilities: "Power at the road; well or community water options nearby",
    topography: "Flat with mature oaks along the back edge",
    nearest_recreation: "10 minutes to Navarro Mills Lake — fishing, boating, a public swim beach",
    nearest_town: "8 minutes to Corsicana · 60 minutes to Dallas",
    best_use_cases:
      "Mobile home, RV parking, Weekend cabin, Investment hold",
    description:
      "Just under half an acre on a quiet country road outside Corsicana, walking distance to Navarro Mills Lake. The land is flat enough to set a mobile home or pour a small slab without grading work. Power runs along the road, and most neighbors are on private wells. It's an easy weekend escape from Dallas — close enough to be practical, far enough to feel rural.",
    lead_hook:
      "Walkable to Navarro Mills Lake. Power and water at the road.",
    gallery: PLACEHOLDER_GALLERY,
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
    latitude: 35.9154,
    longitude: -94.9697,
    financing_available: false,
    cash_price: 52000,
    road_access: "Paved blacktop road frontage on two sides",
    utilities: "Electric, rural water, and fiber internet at the road",
    topography:
      "Mostly cleared building site with mature hardwoods on the perimeter",
    nearest_recreation:
      "20 minutes to Tenkiller Ferry Lake; 25 minutes to the Illinois River for kayaking",
    nearest_town: "10 minutes to Tahlequah · 75 minutes to Tulsa",
    best_use_cases:
      "Build site, Homestead, Hunting retreat, Off-grid cabin",
    description:
      "Nine and a half acres outside Tahlequah, with a cleared building pad already roughed in and a perimeter of oak and hickory. Utilities are run to the road, so closing on the lot and starting construction is a matter of weeks, not months. Frontage on a paved road on two sides gives you flexibility on driveway placement. Cherokee County is one of the few places in the region where rural broadband actually works.",
    lead_hook:
      "All utilities at the road. Cleared building site, mature hardwoods, road frontage.",
    gallery: PLACEHOLDER_GALLERY,
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
    latitude: 33.9988,
    longitude: -96.7475,
    financing_available: false,
    cash_price: 34000,
    road_access: "Private community road, paved",
    utilities: "Power and water at the road; community septic available",
    topography: "Slight slope to the waterfront, sandy soil",
    nearest_recreation:
      "Direct waterfront access on Lake Texoma — sandy beach, dock-friendly",
    nearest_town:
      "15 minutes to Kingston · 90 minutes to DFW · 90 minutes to Oklahoma City",
    best_use_cases:
      "Mobile home, RV parking, Weekend cabin, Vacation rental",
    description:
      "A waterfront half-acre on Lake Texoma with a sandy beach edge. Mobile homes are explicitly allowed in this community — no surprise zoning fights. Power and rural water reach the road, and a community septic system is available if you want to skip the install cost. Lake Texoma straddles the Texas–Oklahoma line and is one of the most popular boating lakes in the Southwest, so this also works as a short-term rental.",
    lead_hook: "Direct waterfront access. Sandy beach. Mobile homes allowed.",
    gallery: PLACEHOLDER_GALLERY,
  },
];
