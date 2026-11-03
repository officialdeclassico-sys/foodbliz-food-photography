-- Seed the six packages already displayed on the Foodbliz pricing page.
-- Prices are stored as whole INR rupees to match the existing frontend catalogue.
-- Re-running this migration updates these known package records without duplicating them.

INSERT INTO products (
  id, name, package_name, description, price, currency, media_type, is_active
) VALUES
  ('foodbliz-standard-starter', 'STARTER', 'Standard', '5 Food Images', 999, 'INR', 'standard_package', 1),
  ('foodbliz-standard-growth', 'GROWTH', 'Standard', '10 Food Images', 1999, 'INR', 'standard_package', 1),
  ('foodbliz-standard-pro', 'PRO', 'Standard', '25 Food Images', 3999, 'INR', 'standard_package', 1),
  ('foodbliz-monthly-starter', 'MONTHLY STARTER', 'Subscription', '10 Images / Month', 1499, 'INR', 'subscription_package', 1),
  ('foodbliz-monthly-growth', 'MONTHLY GROWTH', 'Subscription', '25 Images / Month', 2999, 'INR', 'subscription_package', 1),
  ('foodbliz-monthly-pro', 'MONTHLY PRO', 'Subscription', '50 Images / Month', 4999, 'INR', 'subscription_package', 1)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  package_name = excluded.package_name,
  description = excluded.description,
  price = excluded.price,
  currency = excluded.currency,
  media_type = excluded.media_type,
  is_active = excluded.is_active;
