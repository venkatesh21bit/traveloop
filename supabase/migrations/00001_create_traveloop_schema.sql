-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Activity Categories Table
CREATE TABLE activity_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities Table
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  cost_index INTEGER NOT NULL CHECK (cost_index >= 1 AND cost_index <= 5),
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  popular_activities TEXT[] DEFAULT '{}',
  weather TEXT,
  best_time_to_visit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities Table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES activity_categories(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips Table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10,2) NOT NULL DEFAULT 0,
  travel_style TEXT,
  interests TEXT[] DEFAULT '{}',
  group_size INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'ongoing', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip Stops Table
CREATE TABLE trip_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL,
  stop_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itinerary Days Table
CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_stop_id UUID NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itinerary Activities Table
CREATE TABLE itinerary_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  activity_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets Table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE UNIQUE,
  total_budget DECIMAL(10,2) NOT NULL DEFAULT 0,
  transport_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  accommodation_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  food_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  activities_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  miscellaneous_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses Table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('transport', 'accommodation', 'food', 'activities', 'miscellaneous')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packing Lists Table
CREATE TABLE packing_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packing Items Table
CREATE TABLE packing_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  packing_list_id UUID NOT NULL REFERENCES packing_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('clothing', 'electronics', 'documents', 'toiletries', 'miscellaneous')),
  is_packed BOOLEAN DEFAULT FALSE,
  item_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip Notes Table
CREATE TABLE trip_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_id UUID REFERENCES itinerary_days(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared Trips Table
CREATE TABLE shared_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  share_id TEXT NOT NULL UNIQUE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX idx_itinerary_days_trip_stop_id ON itinerary_days(trip_stop_id);
CREATE INDEX idx_itinerary_activities_day_id ON itinerary_activities(itinerary_day_id);
CREATE INDEX idx_activities_city_id ON activities(city_id);
CREATE INDEX idx_activities_category_id ON activities(category_id);
CREATE INDEX idx_budgets_trip_id ON budgets(trip_id);
CREATE INDEX idx_expenses_budget_id ON expenses(budget_id);
CREATE INDEX idx_packing_items_list_id ON packing_items(packing_list_id);
CREATE INDEX idx_trip_notes_trip_id ON trip_notes(trip_id);
CREATE INDEX idx_shared_trips_share_id ON shared_trips(share_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_notes_updated_at BEFORE UPDATE ON trip_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();