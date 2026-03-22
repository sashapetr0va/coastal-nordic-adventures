-- Seed tours (matching current hardcoded TOUR_DATA)
INSERT INTO public.tours (id, name, duration, max_group, locations, description, note, sort_order) VALUES
  ('coastal', 'Coastal Walking Tour', '1.5–2 hours', '8', ARRAY['Portrush cliffs', 'Whiterocks', 'Portstewart'], 'Explore stunning cliff paths and beaches with guided instruction, photo stops, and nature discovery.', 'Most popular tour', 1),
  ('beach', 'Beach Nordic Walking', '1 hour', '10', ARRAY['Portstewart Strand', 'Benone Beach'], 'Fitness-focused session on the sand.', NULL, 2),
  ('beginner', 'Beginner Lesson', '45 minutes', '6', ARRAY['Portrush area'], 'Learn correct technique, posture, and pole usage. No experience needed.', NULL, 3),
  ('private', 'Private Tour', 'Flexible', 'Your group size', ARRAY['Your choice of location'], 'Personalised experience for families, friends, or corporate wellness.', NULL, 4);

-- Seed knowledge base (matching current hardcoded SYSTEM_PROMPT)
INSERT INTO public.knowledge_base (category, title, content, sort_order) VALUES
  ('contact', 'WhatsApp', '+44 7541 772498', 1),
  ('contact', 'Telegram', '+44 7541 772498', 2),
  ('contact', 'Phone', '+44 7541 772498', 3),
  ('contact', 'Email', 'sashe4ka.petrova@gmail.com', 4),
  ('booking', 'How to book', 'Visitors can use the booking form on the website or contact directly via WhatsApp/Telegram/phone/email.', 1),
  ('location', 'Operating area', 'North Coast of Northern Ireland — routes include areas around Portrush, Portstewart, and Benone beach.', 1),
  ('guidelines', 'Tone', 'Be warm, concise, and encouraging.', 1),
  ('guidelines', 'Unknown prices', 'If asked about specific prices and you don''t have them, suggest contacting directly for a quote.', 2),
  ('guidelines', 'Encourage booking', 'Encourage booking via the website form or WhatsApp for fastest response.', 3),
  ('guidelines', 'Accuracy', 'Do not make up information you don''t have.', 4),
  ('guidelines', 'Brevity', 'Keep responses short (2-4 sentences) unless the question requires more detail.', 5),
  ('guidelines', 'Tools', 'You have tools available — use them when the user asks about tour details or the current time.', 6);
