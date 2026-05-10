-- Enable RLS on all tables
ALTER TABLE activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_trips ENABLE ROW LEVEL SECURITY;

-- Activity Categories: Public read
CREATE POLICY "Activity categories are viewable by everyone"
  ON activity_categories FOR SELECT
  USING (true);

-- Cities: Public read
CREATE POLICY "Cities are viewable by everyone"
  ON cities FOR SELECT
  USING (true);

-- Activities: Public read
CREATE POLICY "Activities are viewable by everyone"
  ON activities FOR SELECT
  USING (true);

-- Trips: Users can view their own trips
CREATE POLICY "Users can view their own trips"
  ON trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON trips FOR DELETE
  USING (auth.uid() = user_id);

-- Trip Stops: Users can manage stops for their trips
CREATE POLICY "Users can view stops for their trips"
  ON trip_stops FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert stops for their trips"
  ON trip_stops FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update stops for their trips"
  ON trip_stops FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete stops for their trips"
  ON trip_stops FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid()
  ));

-- Itinerary Days: Users can manage days for their trip stops
CREATE POLICY "Users can view itinerary days for their trips"
  ON itinerary_days FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM trip_stops 
    JOIN trips ON trips.id = trip_stops.trip_id 
    WHERE trip_stops.id = itinerary_days.trip_stop_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert itinerary days for their trips"
  ON itinerary_days FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM trip_stops 
    JOIN trips ON trips.id = trip_stops.trip_id 
    WHERE trip_stops.id = itinerary_days.trip_stop_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update itinerary days for their trips"
  ON itinerary_days FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM trip_stops 
    JOIN trips ON trips.id = trip_stops.trip_id 
    WHERE trip_stops.id = itinerary_days.trip_stop_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete itinerary days for their trips"
  ON itinerary_days FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM trip_stops 
    JOIN trips ON trips.id = trip_stops.trip_id 
    WHERE trip_stops.id = itinerary_days.trip_stop_id AND trips.user_id = auth.uid()
  ));

-- Itinerary Activities: Users can manage activities for their itinerary days
CREATE POLICY "Users can view itinerary activities for their trips"
  ON itinerary_activities FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM itinerary_days 
    JOIN trip_stops ON trip_stops.id = itinerary_days.trip_stop_id
    JOIN trips ON trips.id = trip_stops.trip_id 
    WHERE itinerary_days.id = itinerary_activities.itinerary_day_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert itinerary activities for their trips"
  ON itinerary_activities FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM itinerary_days 
    JOIN trip_stops ON trip_stops.id = itinerary_days.trip_stop_id
    JOIN trips ON trips.id = trip_stops.trip_id 
    WHERE itinerary_days.id = itinerary_activities.itinerary_day_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update itinerary activities for their trips"
  ON itinerary_activities FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM itinerary_days 
    JOIN trip_stops ON trip_stops.id = itinerary_days.trip_stop_id
    JOIN trips ON trips.id = trip_stops.trip_id 
    WHERE itinerary_days.id = itinerary_activities.itinerary_day_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete itinerary activities for their trips"
  ON itinerary_activities FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM itinerary_days 
    JOIN trip_stops ON trip_stops.id = itinerary_days.trip_stop_id
    JOIN trips ON trips.id = trip_stops.trip_id 
    WHERE itinerary_days.id = itinerary_activities.itinerary_day_id AND trips.user_id = auth.uid()
  ));

-- Budgets: Users can manage budgets for their trips
CREATE POLICY "Users can view budgets for their trips"
  ON budgets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = budgets.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert budgets for their trips"
  ON budgets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = budgets.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update budgets for their trips"
  ON budgets FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = budgets.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete budgets for their trips"
  ON budgets FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = budgets.trip_id AND trips.user_id = auth.uid()
  ));

-- Expenses: Users can manage expenses for their budgets
CREATE POLICY "Users can view expenses for their budgets"
  ON expenses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM budgets 
    JOIN trips ON trips.id = budgets.trip_id 
    WHERE budgets.id = expenses.budget_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert expenses for their budgets"
  ON expenses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM budgets 
    JOIN trips ON trips.id = budgets.trip_id 
    WHERE budgets.id = expenses.budget_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update expenses for their budgets"
  ON expenses FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM budgets 
    JOIN trips ON trips.id = budgets.trip_id 
    WHERE budgets.id = expenses.budget_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete expenses for their budgets"
  ON expenses FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM budgets 
    JOIN trips ON trips.id = budgets.trip_id 
    WHERE budgets.id = expenses.budget_id AND trips.user_id = auth.uid()
  ));

-- Packing Lists: Users can manage packing lists for their trips
CREATE POLICY "Users can view packing lists for their trips"
  ON packing_lists FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = packing_lists.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert packing lists for their trips"
  ON packing_lists FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = packing_lists.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update packing lists for their trips"
  ON packing_lists FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = packing_lists.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete packing lists for their trips"
  ON packing_lists FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = packing_lists.trip_id AND trips.user_id = auth.uid()
  ));

-- Packing Items: Users can manage packing items for their lists
CREATE POLICY "Users can view packing items for their lists"
  ON packing_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM packing_lists 
    JOIN trips ON trips.id = packing_lists.trip_id 
    WHERE packing_lists.id = packing_items.packing_list_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert packing items for their lists"
  ON packing_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM packing_lists 
    JOIN trips ON trips.id = packing_lists.trip_id 
    WHERE packing_lists.id = packing_items.packing_list_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update packing items for their lists"
  ON packing_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM packing_lists 
    JOIN trips ON trips.id = packing_lists.trip_id 
    WHERE packing_lists.id = packing_items.packing_list_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete packing items for their lists"
  ON packing_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM packing_lists 
    JOIN trips ON trips.id = packing_lists.trip_id 
    WHERE packing_lists.id = packing_items.packing_list_id AND trips.user_id = auth.uid()
  ));

-- Trip Notes: Users can manage notes for their trips
CREATE POLICY "Users can view notes for their trips"
  ON trip_notes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = trip_notes.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert notes for their trips"
  ON trip_notes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = trip_notes.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update notes for their trips"
  ON trip_notes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = trip_notes.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete notes for their trips"
  ON trip_notes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = trip_notes.trip_id AND trips.user_id = auth.uid()
  ));

-- Shared Trips: Users can manage sharing for their trips, public can view shared trips
CREATE POLICY "Users can view shared trips for their trips"
  ON shared_trips FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trips WHERE trips.id = shared_trips.trip_id AND trips.user_id = auth.uid()
    ) OR is_public = true
  );

CREATE POLICY "Users can insert shared trips for their trips"
  ON shared_trips FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = shared_trips.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update shared trips for their trips"
  ON shared_trips FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = shared_trips.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete shared trips for their trips"
  ON shared_trips FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM trips WHERE trips.id = shared_trips.trip_id AND trips.user_id = auth.uid()
  ));