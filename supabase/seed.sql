-- Seed data for Stacked Stone
-- Editions
INSERT INTO public.book_editions (id, slug, name, pages_min, pages_max, size_label, base_price, ideal_for, photo_estimate_min, photo_estimate_max, description, sort_order)
VALUES
  (gen_random_uuid(), 'weekend', 'Weekend Edition', 20, 60, '8 × 10 in', 4990, 'Short trips and city breaks', 15, 30, 'A compact volume for quick escapes. Smyth-sewn, cloth-bound, foil-stamped.', 1),
  (gen_random_uuid(), 'journey', 'Journey Edition', 40, 90, '9 × 12 in', 7990, 'Multi-city itineraries', 30, 60, 'The most popular edition. Generous spreads for narrative arc across destinations.', 2),
  (gen_random_uuid(), 'explorer', 'Explorer Edition', 60, 120, '10 × 13 in', 10990, 'Expeditions and epic travel', 50, 100, 'Our largest format. Built for landscapes, panoramas, and photo essays.', 3),
  (gen_random_uuid(), 'collector', 'Collector Edition', 40, 90, '9 × 12 in', 14990, 'The finest expression', 30, 60, 'Full-grain leather binding, gilded edges, archival storage box included.', 4);

-- Materials
INSERT INTO public.book_materials (id, slug, name, feel, description, price_delta, swatch_color, sort_order)
VALUES
  (gen_random_uuid(), 'classic', 'Classic Hardcover', 'Smooth matte linen', 'A timeless cloth-bound hardcover. Understated and elegant.', 0, '#f5f0e8', 1),
  (gen_random_uuid(), 'linen', 'Linen Bound', 'Textured natural linen', 'European linen with a tactile, organic grain.', 490, '#d4c9b8', 2),
  (gen_random_uuid(), 'leather', 'Leather', 'Supple full-grain leather', 'Premium full-grain leather in rich cognac. Ages beautifully.', 1690, '#8b5e3c', 3),
  (gen_random_uuid(), 'soft-touch', 'Soft Touch', 'Velvety matte finish', 'A soft-touch laminate with a warm, almost suede-like feel.', 690, '#e8e0d0', 4);

-- Papers
INSERT INTO public.paper_types (id, slug, name, weight, finish, best_for, price_delta, sort_order)
VALUES
  (gen_random_uuid(), 'premium-matte', 'Premium Matte', '170 gsm', 'Smooth, low-glare', 'All-purpose photographic', 0, 1),
  (gen_random_uuid(), 'silk', 'Silk', '210 gsm', 'Soft sheen, mid-gloss', 'Portraits and fine detail', 690, 2),
  (gen_random_uuid(), 'lustre', 'Lustre', '230 gsm', 'Pearlescent, high-definition', 'Landscape and colour', 990, 3),
  (gen_random_uuid(), 'fine-art', 'Fine Art Cotton', '300 gsm', 'Textured, archival', 'Gallery-grade museum prints', 1990, 4);

-- Page counts
INSERT INTO public.page_counts (id, pages, label, recommended_min, recommended_max, ideal_for, price_delta, sort_order)
VALUES
  (gen_random_uuid(), 24, '24 pages', 12, 18, 'Weekend trips', 0, 1),
  (gen_random_uuid(), 36, '36 pages', 20, 30, 'Short journeys', 490, 2),
  (gen_random_uuid(), 48, '48 pages', 28, 40, 'Week-long travel', 990, 3),
  (gen_random_uuid(), 60, '60 pages', 36, 50, 'Extended trips', 1490, 4),
  (gen_random_uuid(), 80, '80 pages', 50, 70, 'Epic adventures', 1990, 5),
  (gen_random_uuid(), 100, '100 pages', 60, 90, 'Grand expeditions', 2490, 6);
