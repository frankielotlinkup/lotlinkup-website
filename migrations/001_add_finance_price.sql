-- Adds the seller-finance sticker price as a separate column from cash_price.
-- For financed lots, monthly payment is computed off (finance_price - down_payment);
-- cash buyers see the lower cash_price.
alter table public.inventory
  add column if not exists finance_price numeric null;
