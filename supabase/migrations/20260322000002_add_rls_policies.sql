-- Row Level Security policies for tours and knowledge_base tables.
--
-- Design:
--   - Anonymous (anon) users can only SELECT rows where is_active = true.
--   - All other operations (INSERT, UPDATE, DELETE) are implicitly denied
--     for anon because no permissive policies exist for those commands.
--   - The service_role bypasses RLS automatically, so it retains full
--     read/write access without explicit policies.

-- tours: allow anon to read active tours only
CREATE POLICY "anon_select_active_tours"
  ON public.tours
  FOR SELECT
  TO anon
  USING (is_active = true);

-- knowledge_base: allow anon to read active entries only
CREATE POLICY "anon_select_active_knowledge_base"
  ON public.knowledge_base
  FOR SELECT
  TO anon
  USING (is_active = true);
