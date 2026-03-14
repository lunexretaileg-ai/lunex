-- Add cosmetic_condition column to product_variants
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "cosmetic_condition" text;

-- Create product_specs table
CREATE TABLE IF NOT EXISTS "product_specs" (
  "id" serial PRIMARY KEY NOT NULL,
  "product_id" integer NOT NULL REFERENCES "products"("id"),
  "spec_key" text NOT NULL,
  "spec_value" text NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0
);
