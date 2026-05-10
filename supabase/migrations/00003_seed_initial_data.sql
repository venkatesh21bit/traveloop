-- Insert Activity Categories
INSERT INTO activity_categories (name, icon, color) VALUES
  ('Sightseeing', 'Eye', 'hsl(180, 65%, 45%)'),
  ('Food Tours', 'UtensilsCrossed', 'hsl(30, 85%, 55%)'),
  ('Adventure', 'Mountain', 'hsl(200, 80%, 50%)'),
  ('Culture', 'Landmark', 'hsl(280, 60%, 55%)'),
  ('Entertainment', 'Music', 'hsl(340, 70%, 55%)'),
  ('Shopping', 'ShoppingBag', 'hsl(150, 60%, 45%)'),
  ('Relaxation', 'Spa', 'hsl(260, 50%, 60%)'),
  ('Nightlife', 'Moon', 'hsl(240, 70%, 50%)');

-- Insert Cities
INSERT INTO cities (name, country, region, description, image, cost_index, rating, popular_activities, weather, best_time_to_visit) VALUES
  ('Paris', 'France', 'Europe', 'The City of Light, known for its art, fashion, and culture', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 4, 4.8, ARRAY['Sightseeing', 'Culture', 'Food Tours'], 'Temperate', 'April to June, September to October'),
  ('Tokyo', 'Japan', 'Asia', 'A vibrant metropolis blending tradition and modernity', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 4, 4.9, ARRAY['Culture', 'Food Tours', 'Shopping'], 'Humid subtropical', 'March to May, September to November'),
  ('New York', 'USA', 'North America', 'The city that never sleeps, a global hub of culture and commerce', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', 5, 4.7, ARRAY['Sightseeing', 'Entertainment', 'Shopping'], 'Humid continental', 'April to June, September to November'),
  ('Barcelona', 'Spain', 'Europe', 'A Mediterranean gem with stunning architecture and beaches', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', 3, 4.7, ARRAY['Sightseeing', 'Culture', 'Relaxation'], 'Mediterranean', 'May to June, September to October'),
  ('Bali', 'Indonesia', 'Asia', 'Tropical paradise with beaches, temples, and rice terraces', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 2, 4.8, ARRAY['Relaxation', 'Adventure', 'Culture'], 'Tropical', 'April to October'),
  ('Dubai', 'UAE', 'Middle East', 'Luxury destination with modern architecture and desert adventures', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 4, 4.6, ARRAY['Shopping', 'Adventure', 'Entertainment'], 'Desert', 'November to March'),
  ('Rome', 'Italy', 'Europe', 'The Eternal City, rich in history and ancient ruins', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', 3, 4.8, ARRAY['Sightseeing', 'Culture', 'Food Tours'], 'Mediterranean', 'April to June, September to October'),
  ('London', 'UK', 'Europe', 'Historic capital with world-class museums and royal heritage', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', 5, 4.7, ARRAY['Sightseeing', 'Culture', 'Entertainment'], 'Temperate oceanic', 'May to September'),
  ('Sydney', 'Australia', 'Oceania', 'Harbor city with iconic opera house and beautiful beaches', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', 4, 4.7, ARRAY['Sightseeing', 'Relaxation', 'Adventure'], 'Humid subtropical', 'September to November, March to May'),
  ('Bangkok', 'Thailand', 'Asia', 'Vibrant city with temples, street food, and bustling markets', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', 2, 4.6, ARRAY['Food Tours', 'Culture', 'Shopping'], 'Tropical', 'November to February');

-- Insert Activities (using subqueries to get IDs)
INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Eiffel Tower Visit',
  'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris',
  (SELECT id FROM activity_categories WHERE name = 'Sightseeing'),
  (SELECT id FROM cities WHERE name = 'Paris'),
  180,
  25.00,
  4.8,
  ARRAY['https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400'],
  ARRAY['iconic', 'must-see', 'photography'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Louvre Museum Tour',
  'Explore the world''s largest art museum and see the Mona Lisa',
  (SELECT id FROM activity_categories WHERE name = 'Culture'),
  (SELECT id FROM cities WHERE name = 'Paris'),
  240,
  20.00,
  4.9,
  ARRAY['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400'],
  ARRAY['art', 'museum', 'culture'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Seine River Cruise',
  'Romantic cruise along the Seine with dinner and live music',
  (SELECT id FROM activity_categories WHERE name = 'Food Tours'),
  (SELECT id FROM cities WHERE name = 'Paris'),
  150,
  85.00,
  4.7,
  ARRAY['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400'],
  ARRAY['romantic', 'dinner', 'cruise'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Senso-ji Temple',
  'Visit Tokyo''s oldest temple in the historic Asakusa district',
  (SELECT id FROM activity_categories WHERE name = 'Culture'),
  (SELECT id FROM cities WHERE name = 'Tokyo'),
  120,
  0.00,
  4.7,
  ARRAY['https://images.unsplash.com/photo-1528164344705-47542687000d?w=400'],
  ARRAY['temple', 'free', 'historic'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Tsukiji Fish Market',
  'Experience the world''s largest fish market and enjoy fresh sushi',
  (SELECT id FROM activity_categories WHERE name = 'Food Tours'),
  (SELECT id FROM cities WHERE name = 'Tokyo'),
  180,
  40.00,
  4.8,
  ARRAY['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'],
  ARRAY['food', 'market', 'sushi'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Shibuya Crossing',
  'Experience the world''s busiest pedestrian crossing',
  (SELECT id FROM activity_categories WHERE name = 'Sightseeing'),
  (SELECT id FROM cities WHERE name = 'Tokyo'),
  60,
  0.00,
  4.6,
  ARRAY['https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400'],
  ARRAY['iconic', 'free', 'photography'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Statue of Liberty',
  'Ferry to Liberty Island and tour the iconic statue',
  (SELECT id FROM activity_categories WHERE name = 'Sightseeing'),
  (SELECT id FROM cities WHERE name = 'New York'),
  240,
  30.00,
  4.7,
  ARRAY['https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400'],
  ARRAY['iconic', 'ferry', 'historic'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Broadway Show',
  'Watch a world-class musical or play on Broadway',
  (SELECT id FROM activity_categories WHERE name = 'Entertainment'),
  (SELECT id FROM cities WHERE name = 'New York'),
  180,
  120.00,
  4.9,
  ARRAY['https://images.unsplash.com/photo-1503095396549-807759245b35?w=400'],
  ARRAY['theater', 'entertainment', 'musical'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Central Park Bike Tour',
  'Explore Central Park on a guided bike tour',
  (SELECT id FROM activity_categories WHERE name = 'Adventure'),
  (SELECT id FROM cities WHERE name = 'New York'),
  120,
  45.00,
  4.6,
  ARRAY['https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400'],
  ARRAY['outdoor', 'bike', 'nature'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Sagrada Familia',
  'Tour Gaudí''s masterpiece basilica',
  (SELECT id FROM activity_categories WHERE name = 'Sightseeing'),
  (SELECT id FROM cities WHERE name = 'Barcelona'),
  150,
  26.00,
  4.9,
  ARRAY['https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400'],
  ARRAY['architecture', 'Gaudí', 'iconic'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Park Güell',
  'Explore Gaudí''s colorful park with city views',
  (SELECT id FROM activity_categories WHERE name = 'Sightseeing'),
  (SELECT id FROM cities WHERE name = 'Barcelona'),
  120,
  10.00,
  4.7,
  ARRAY['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400'],
  ARRAY['park', 'Gaudí', 'views'];

INSERT INTO activities (name, description, category_id, city_id, duration, price, rating, images, tags)
SELECT 
  'Tapas Tour',
  'Guided tour of the best tapas bars in Gothic Quarter',
  (SELECT id FROM activity_categories WHERE name = 'Food Tours'),
  (SELECT id FROM cities WHERE name = 'Barcelona'),
  180,
  65.00,
  4.8,
  ARRAY['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'],
  ARRAY['food', 'tapas', 'local'];