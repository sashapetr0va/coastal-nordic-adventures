# Knowledge Base Guide / Руководство по базе знаний

How to manage your AI chat agent's knowledge using the Supabase Dashboard.
Как управлять знаниями AI чат-агента через панель Supabase.

---

## Getting Started / Начало работы

1. Open the Supabase Dashboard: https://supabase.com/dashboard/project/ywdqxkypzrlfqdghjdrq
2. Click **Table Editor** in the left sidebar
3. You'll see two tables: **tours** and **knowledge_base**

---

1. Откройте панель Supabase: https://supabase.com/dashboard/project/ywdqxkypzrlfqdghjdrq
2. Нажмите **Table Editor** в левом меню
3. Вы увидите две таблицы: **tours** и **knowledge_base**

---

## Table 1: `tours` — Your Tour Offerings / Ваши туры

Each row is one tour. The agent uses this data when visitors ask about tours.
Каждая строка — один тур. Агент использует эти данные, когда посетители спрашивают о турах.

### Columns / Столбцы

| Column | What to write | Example |
|--------|--------------|---------|
| `id` | Short unique ID (lowercase, no spaces) | `coastal` |
| `name` | Tour display name | `Coastal Walking Tour` |
| `duration` | How long the tour lasts | `1.5–2 hours` |
| `max_group` | Maximum group size | `8` or `Your group size` |
| `locations` | List of locations (Postgres array) | `{Portrush cliffs,Whiterocks,Portstewart}` |
| `description` | 1-2 sentence description | `Explore stunning cliff paths and beaches...` |
| `price` | Price per person (leave empty if not set yet) | `£25 per person` |
| `note` | Optional highlight | `Most popular tour` |
| `sort_order` | Display order (1 = first) | `1` |
| `is_active` | Show in chat? Toggle off to hide without deleting | `true` |

### How to: Add a new tour / Добавить новый тур

1. Click the **tours** table
2. Click **Insert row** (top right)
3. Fill in the columns:
   - `id`: `sunset` (short, unique, lowercase)
   - `name`: `Sunset Coastal Walk`
   - `duration`: `2 hours`
   - `max_group`: `6`
   - `locations`: `{Portrush,Whiterocks}`
   - `description`: `A magical evening walk along the cliffs as the sun sets over the Atlantic.`
   - `price`: `£30 per person`
   - `sort_order`: `5`
   - `is_active`: `true`
4. Click **Save**
5. The agent will know about this tour within 5 minutes

---

1. Нажмите на таблицу **tours**
2. Нажмите **Insert row** (вверху справа)
3. Заполните столбцы (как в примере выше)
4. Нажмите **Save**
5. Агент узнает об этом туре в течение 5 минут

### How to: Add pricing to existing tours / Добавить цены

1. Click the **tours** table
2. Click on the row you want to edit (e.g., `coastal`)
3. Find the `price` column (it may be empty)
4. Type the price: `£25 per person`
5. Click **Save**
6. Now when someone asks "How much does the coastal tour cost?", the agent will answer with the price

---

1. Нажмите на таблицу **tours**
2. Нажмите на строку, которую хотите изменить
3. Найдите столбец `price` (он может быть пустым)
4. Введите цену: `£25 per person`
5. Нажмите **Save**
6. Теперь агент будет отвечать на вопросы о цене

### How to: Temporarily hide a tour / Временно скрыть тур

1. Click on the tour row
2. Set `is_active` to `false`
3. Click **Save**
4. The tour disappears from the chat agent (but the data is preserved)
5. Set it back to `true` whenever you're ready

---

## Table 2: `knowledge_base` — Everything Else / Всё остальное

This table holds all other business knowledge: FAQ, policies, contact info, about you, what to bring, etc. Each row becomes part of the agent's knowledge.

Эта таблица содержит все остальные знания: FAQ, политики, контакты, о вас, что брать с собой и т.д.

### Columns / Столбцы

| Column | What to write | Example |
|--------|--------------|---------|
| `category` | Group this belongs to (see list below) | `faq` |
| `title` | Short label | `What to wear` |
| `content` | The actual information the agent will use | `Comfortable walking shoes and weather-appropriate layers. We provide Nordic walking poles.` |
| `sort_order` | Order within the category | `1` |
| `is_active` | Show in chat? | `true` |

### Available categories / Доступные категории

| Category | What goes here | Example |
|----------|---------------|---------|
| `faq` | Frequently asked questions | What to wear, fitness level required, age restrictions |
| `policy` | Business policies | Cancellation, bad weather, accessibility |
| `about` | About you / the business | Your background, qualifications, story |
| `what_to_bring` | Kit list for walkers | Shoes, water, sunscreen |
| `pricing` | General pricing info | Group discounts, gift vouchers |
| `contact` | Contact methods (already seeded) | WhatsApp, email, phone |
| `booking` | How to book (already seeded) | Website form, WhatsApp |
| `location` | Operating area (already seeded) | North Coast, specific routes |
| `guidelines` | Agent behaviour rules (already seeded) | Tone, accuracy, brevity |

You can also create your own categories — just type any new category name and the agent will include it.
Вы можете создавать свои категории — просто введите новое имя, и агент его подхватит.

### How to: Add a FAQ / Добавить FAQ

1. Click the **knowledge_base** table
2. Click **Insert row**
3. Fill in:
   - `category`: `faq`
   - `title`: `What fitness level do I need?`
   - `content`: `No special fitness required! Our tours are suitable for all abilities. We walk at a comfortable pace with plenty of stops. Nordic walking poles actually make it easier on your joints.`
   - `sort_order`: `1`
   - `is_active`: `true`
4. Click **Save**

More FAQ examples to add:

| title | content |
|-------|---------|
| `What to wear` | `Comfortable walking shoes (trainers or hiking boots), weather-appropriate layers. We walk rain or shine! We provide Nordic walking poles.` |
| `Age restrictions` | `All ages welcome. Children under 16 must be accompanied by an adult.` |
| `Can I bring my dog?` | `Well-behaved dogs on leads are welcome on most tours. Please mention it when booking so we can choose a dog-friendly route.` |
| `How do I get there?` | `Meeting points vary by tour. After booking, you'll receive a WhatsApp message with the exact meeting location, parking info, and directions.` |

### How to: Add policies / Добавить политики

1. Click **knowledge_base** → **Insert row**
2. Examples:

| category | title | content |
|----------|-------|---------|
| `policy` | `Cancellation` | `Full refund if you cancel at least 24 hours before the tour. Less than 24 hours, we offer a reschedule to another date.` |
| `policy` | `Bad weather` | `We walk in most weather conditions — it's Northern Ireland after all! In extreme weather (storms, flooding), we'll reschedule at no cost and notify you via WhatsApp.` |
| `policy` | `Group bookings` | `Groups of 6 or more get 10% off. Corporate wellness packages available — contact us for a custom quote.` |

### How to: Add "About Me" / Добавить "Обо мне"

| category | title | content |
|----------|-------|---------|
| `about` | `The instructor` | `Hi, I'm Sasha! Originally from Russia, now living on the beautiful North Coast of Northern Ireland. I'm a certified Nordic walking instructor and I love sharing the stunning coastal scenery with visitors and locals alike.` |
| `about` | `Why Nordic walking?` | `Nordic walking uses 90% of your muscles, burns more calories than regular walking, and is gentle on your joints. Plus, our North Coast routes are absolutely breathtaking!` |

### How to: Add "What to Bring" / Добавить "Что брать с собой"

| category | title | content |
|----------|-------|---------|
| `what_to_bring` | `Essentials` | `Comfortable walking shoes, water bottle, weather-appropriate clothing (layers recommended). We provide Nordic walking poles.` |
| `what_to_bring` | `Optional` | `Sunscreen, hat, camera or phone for photos, small snack for longer tours.` |

---

## Important Notes / Важные замечания

### Cache / Кэширование
Changes take **up to 5 minutes** to appear in the chat agent. The Edge Function caches knowledge from the database to keep responses fast.

Изменения появляются в чат-агенте **в течение 5 минут**. Edge Function кэширует данные для быстрых ответов.

### Don't delete, deactivate / Не удаляйте, деактивируйте
If you want to remove something temporarily, set `is_active` to `false` instead of deleting the row. This way you can bring it back later.

Если хотите временно убрать что-то, поставьте `is_active` = `false` вместо удаления строки.

### Locations format / Формат локаций
The `locations` column in the `tours` table uses Postgres array format: `{Location 1,Location 2,Location 3}`. Don't use quotes inside the braces.

Столбец `locations` использует формат массива Postgres: `{Локация 1,Локация 2}`. Не используйте кавычки внутри фигурных скобок.

### Sort order / Порядок сортировки
Lower `sort_order` = appears first. Use `1, 2, 3...` to control the order entries appear in the agent's knowledge.

Меньший `sort_order` = появляется первым.

### The agent won't make things up / Агент не будет выдумывать
If information isn't in the database, the agent will say "I don't have that information, please contact us directly." It won't invent answers.

Если информации нет в базе, агент скажет "у меня нет этой информации, пожалуйста, свяжитесь с нами напрямую."

---

## Quick Reference / Краткая справка

| I want to... | Table | What to do |
|--------------|-------|------------|
| Add a new tour | `tours` | Insert row with id, name, duration, etc. |
| Add pricing | `tours` | Edit existing row, fill `price` column |
| Hide a tour | `tours` | Set `is_active` = false |
| Add FAQ | `knowledge_base` | Insert row, category = `faq` |
| Add policy | `knowledge_base` | Insert row, category = `policy` |
| Add "about me" | `knowledge_base` | Insert row, category = `about` |
| Add "what to bring" | `knowledge_base` | Insert row, category = `what_to_bring` |
| Change contact info | `knowledge_base` | Edit existing rows with category = `contact` |
| Change agent tone | `knowledge_base` | Edit existing rows with category = `guidelines` |
