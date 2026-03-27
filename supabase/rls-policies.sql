-- RLS Policies for Voyage Planner
--
-- These policies enforce per-user data isolation. Every row in itineraries
-- and itinerary_items must be owned by the authenticated user making the request.
--
-- To verify or recreate these policies in the Supabase dashboard:
--   Table Editor → [table] → RLS → Policies
-- Or run this file against your project via: supabase db push

-- ============================================================
-- itineraries
-- ============================================================

ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Users can only read their own itineraries
CREATE POLICY "itineraries_select_own"
  ON itineraries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert rows they own
CREATE POLICY "itineraries_insert_own"
  ON itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own rows
CREATE POLICY "itineraries_update_own"
  ON itineraries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own rows
CREATE POLICY "itineraries_delete_own"
  ON itineraries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- itinerary_items
-- ============================================================

ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "itinerary_items_select_own"
  ON itinerary_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "itinerary_items_insert_own"
  ON itinerary_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "itinerary_items_update_own"
  ON itinerary_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "itinerary_items_delete_own"
  ON itinerary_items FOR DELETE
  USING (auth.uid() = user_id);
