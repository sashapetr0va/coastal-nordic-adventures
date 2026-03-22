-- Tours table: one row per tour offering
CREATE TABLE public.tours (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  duration    text NOT NULL,
  max_group   text NOT NULL,
  locations   text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  price       text,
  note        text,
  sort_order  int NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Knowledge base: category + title + content for all other business knowledge
CREATE TABLE public.knowledge_base (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category    text NOT NULL,
  title       text NOT NULL,
  content     text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_knowledge_base_category ON public.knowledge_base (category);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
