-- Update featured tour to reflect the Port Path as the flagship route
UPDATE public.tours
SET name = 'Port Path Guided Walk',
    description = 'Walk the iconic Port Path — part of the Causeway Coast Way linking Portstewart Strand to Portrush along cliff tops, grass tracks, and open beach.',
    locations = ARRAY['Portstewart Strand', 'Port Path', 'Ramore Head (Portrush)']
WHERE id = 'coastal';

-- Seed knowledge base with popular Nordic walking routes in the Causeway Coast area
INSERT INTO public.knowledge_base (category, title, content, sort_order) VALUES
  ('routes', 'Port Path (Portstewart ↔ Portrush)', 'Flagship ~6 km coastal route linking Portstewart Strand to Portrush via Ramore Head. Part of the Causeway Coast Way and Ulster Way. Mix of promenade, grass tracks, cliff path, and open beach — gently undulating and ideal for Nordic walking at any level.', 1),
  ('routes', 'Ramore Head Circular (Portrush)', 'Short ~3–5 km loop around Portrush headland with harbour views, East Strand beach, and open Atlantic panoramas. Good for beginner Nordic walking sessions.', 2),
  ('routes', 'Dunluce Cliff Walk (Portrush → Portballintrae)', '~6 km section of the Causeway Coast Way passing Whiterocks Beach and the dramatic ruins of Dunluce Castle on its basalt cliff. One of the most photogenic stretches of the North Coast.', 3),
  ('routes', 'Portballintrae to Giant''s Causeway', '~6 km cliff and beach walk leading to the UNESCO World Heritage Giant''s Causeway. Stunning but more exposed — best in fair weather.', 4),
  ('routes', 'Downhill Demesne & Mussenden Temple', '~3 km cliff-top route above Benone Beach, taking in Mussenden Temple perched on the edge and views across Lough Foyle. Short and scenic.', 5),
  ('routes', 'Causeway Coast Way (overview)', 'The full Causeway Coast Way is a 52 km (33 mi) two-day waymarked route from Ballycastle to Portstewart. Our tours cover the western sections (Portstewart–Portrush–Portballintrae) most suited to Nordic walking groups.', 6);
