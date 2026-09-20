/** Frontend-only plan catalog. Billing is not wired yet. */

export const PLANS = [
  {
    id: "free",
    storageGb: 5,
    priceMonthly: 0,
    featured: false,
  },
  {
    id: "plus",
    storageGb: 100,
    priceMonthly: 99000,
    featured: true,
  },
  {
    id: "pro",
    storageGb: 1024,
    priceMonthly: 249000,
    featured: false,
  },
];
