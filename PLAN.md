# Миграция Hugo блога totaku.ru → Astro

## Контекст

Личный блог totaku.ru работает на Hugo с темой LoveIt. 112 постов, русский язык. Задача — переехать на Astro, улучшив дизайн, но сохранив:
- Все SEO (URL, meta теги, OG, Twitter Cards, Schema.org, верификации Яндекс/Pinterest/Zen)
- Структуру URL (без /posts/ префикса, trailing slash: `https://totaku.ru/slug/`)

Дополнительные требования:
- Статьи как отдельные `.md` файлы в одной папке (не папка/index.md)
- Cover картинки в `src/content/posts/images/cover/`, inline картинки в `src/content/posts/images/content/`
- Файлы статей и картинок именуются по слагу поста
- Все картинки конвертируются в WebP/AVIF при сборке

---

## Структура проекта Astro

```
totaku.ru/new/                        ← новая папка рядом со old/
├── astro.config.mjs
├── package.json
├── tsconfig.json
│
├── public/
│   ├── img/                          ← аватары
│   │   ├── avatar-zima.png
│   │   └── avatar-leto.png
│   ├── favicon.ico + иконки
│   ├── robots.txt
│   └── site.webmanifest
│
└── src/
    ├── content/
    │   ├── config.ts                 ← Zod схема
    │   └── posts/
    │       ├── biesplatnyie-fotostoki.md  ← было: posts/{slug}/index.md
    │       ├── ... (112 файлов)
    │       └── images/
    │           ├── cover/
    │           │   ├── biesplatnyie-fotostoki.jpg   ← было: featured-image.jpg
    │           │   └── drupal-9-docker.jpg
    │           └── content/
    │               ├── biesplatnyie-fotostoki-01.png  ← было: img/{slug}-01.png
    │               └── ...
    │
    ├── layouts/
    │   ├── BaseLayout.astro          ← HTML + SEO head
    │   └── PostLayout.astro          ← лейаут статьи (ToC, Disqus)
    │
    ├── components/
    │   ├── SEO.astro                 ← все meta + JSON-LD
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── PostCard.astro
    │   ├── Pagination.astro
    │   ├── TableOfContents.astro
    │   ├── DisqusComments.astro
    │   ├── CodePen.astro             ← свой компонент для CodePen embed
    │   └── PhotoSwipeGallery.astro   ← лайтбокс для галерей (photoswipe)
    │
    ├── pages/
    │   ├── index.astro               ← главная с пагинацией
    │   ├── about.astro
    │   ├── [slug].astro              ← посты по URL без /posts/
    │   ├── categories/
    │   │   └── [category]/
    │   │       └── [...page].astro
    │   ├── tags/
    │   │   └── [tag]/
    │   │       └── [...page].astro
    │   └── rss.xml.ts
    │
    └── utils/
        └── posts.ts
```

---

## Content Collections схема (`src/content/config.ts`)

Изображения хранятся в `src/content/posts/images/` — это позволяет Astro обрабатывать их через `<Image>` компонент с автоматической конвертацией в WebP/AVIF и оптимизацией.

```typescript
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    lastmod: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    keywords: z.string().optional(),
    description: z.string().optional(),
    featuredImage: image().optional(),        // Astro image() для авто-оптимизации
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    hiddenFromHomePage: z.boolean().default(false),
    toc: z.boolean().default(false),
  }),
});

export const collections = { posts: postsCollection };
```

В frontmatter поста указывается относительный путь к cover:
```yaml
featuredImage: "./images/cover/biesplatnyie-fotostoki.jpg"
```

Astro автоматически оптимизирует изображение при сборке (WebP + AVIF + нужные размеры).

---

## Роутинг — URL без /posts/

Файл `src/pages/[slug].astro`:
```typescript
export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
```

Astro slug = имя файла → `biesplatnyie-fotostoki.md` → URL `/biesplatnyie-fotostoki/`

В `astro.config.mjs`:
```javascript
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://totaku.ru',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  markdown: { shikiConfig: { theme: 'github-dark', wrap: true } },
});
```

---

## Изображения — конвертация в WebP/AVIF

Все изображения хранятся в `src/content/posts/images/` — это даёт Astro доступ для оптимизации при сборке.

**Cover (featured):** используется через `<Image>` компонент Astro:
```astro
---
import { Image } from 'astro:assets';
---
<Image src={post.data.featuredImage} alt={post.data.title}
       widths={[400, 800, 1200]} formats={['avif', 'webp']} />
```

**Inline изображения в Markdown:** Astro автоматически обрабатывает локальные изображения в markdown-файлах Content Collections (относительные пути `./images/content/...`). При сборке конвертируются в WebP/AVIF.

---

## SEO — компонент `SEO.astro`

Должен генерировать:
- `<title>`, `<meta description>`, `<meta keywords>`, `<link rel="canonical">`
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`)
- Twitter Cards (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`)
- Yandex verification: `bcf062eda39841d7` и `7ce8e380c28fe9bd`
- Pinterest: `319c291f435d12cdbe0857fa0deb5b4e`
- Zen: `hzyzu3gDjer1nR5xFe5UR4aIsiTA6h26Sf2uqVtXOukT2uw80JPITAb6rUM0R829`
- RSS autodiscovery link
- JSON-LD Schema.org: `BlogPosting` для постов, `WebSite` для главной

---

## Скрипт миграции (`scripts/migrate.py`)

Скрипт Python для автоматической миграции всех 112 постов.

**Этап 1 — Изображения:**
```
content/posts/{slug}/featured-image.{ext}  → src/content/posts/images/cover/{slug}.{ext}
content/posts/{slug}/img/{slug}-01.png     → src/content/posts/images/content/{slug}-01.png
content/posts/{slug}/img/{slug}-02.png     → src/content/posts/images/content/{slug}-02.png
```

Inline изображения сохраняют slug-префикс, чтобы имена не конфликтовали между постами.

**Этап 2 — Frontmatter (трансформации):**
- Удалить: `subtitle`, `author`, `authorLink`, `resources`, `lightgallery`
- `toc: {enable: true}` → `toc: true`
- Добавить: `featuredImage: "./images/cover/{slug}.{ext}"` (относительный путь для Astro image())

**Этап 3 — Замена Hugo shortcodes:**
- `{{< figure src="img/{slug}-01.png" >}}` → `![](./images/content/{slug}-01.png)` (Astro обработает при сборке)
- `{{< youtube ID >}}` → `<YouTube id="ID" />` из `astro-embed`
- `{{< pen id="ID" >}}` → `<CodePen id="ID" />` (свой компонент)
- `{{< admonition type "title" >}}...{{< /admonition >}}` → `<div class="admonition type">...</div>`

**Стратегия embeds:** Посты с `{{< youtube >}}` или `{{< pen >}}` конвертируются в `.mdx`. Скрипт миграции:
1. Определяет наличие embed-шорткодов в посте
2. Если есть — создаёт `.mdx` файл вместо `.md`
3. Добавляет импорты в начало файла:
   ```mdx
   import { YouTube } from 'astro-embed';
   import CodePen from '@/components/CodePen.astro';
   ```
4. Заменяет `{{< youtube ID >}}` → `<YouTube id="ID" />`
5. Заменяет `{{< pen id="ID" >}}` → `<CodePen id="ID" />`

Обычные посты без embeds остаются `.md`.

**Компонент `CodePen.astro`:**
```astro
---
interface Props { id: string; height?: number; tab?: string; }
const { id, height = 500, tab = 'result' } = Astro.props;
---
<script
  data-slug-hash={id}
  data-height={height}
  data-default-tab={tab}
  data-theme-id="8862"
  class="codepen"
  async
  src="https://cpwebassets.codepen.io/assets/embed/ei.js"
></script>
```

Используется официальный JS-скрипт CodePen (`ei.js`) — он сам резолвит автора по `data-slug-hash`, `user` не нужен. Именно так работал старый Hugo шорткод.

**Edge cases:**
- Числовые слаги (пост "35")
- `figure` с внешними URL (`https://fairu.totaku.ru/...`)
- `admonition` с третьим параметром `false` (закрытый по умолчанию → `<details>`)
- Посты с `draft: true` — не попадают в сборку

---

## Дизайн

**Стек:** Astro + Tailwind CSS v4 + `@tailwindcss/typography`

**Концепция:** Минималистичный читабельный блог. Упор на типографику и контент. Light/Dark режим.

**Цветовая схема:**
```css
/* Light */  --color-accent: oklch(55% 0.2 250); --color-bg: #ffffff; --color-text: #1a1a1a;
/* Dark */   --color-accent: oklch(70% 0.18 250); --color-bg: #0f1117; --color-text: #e2e8f0;
```

**Ширина:** контент 720px, хедер/сетка 1100px

**Шрифты:** системный стек (быстрая загрузка, нет FOUT)

---

## Пакеты

```bash
pnpm create astro@latest
# Основные интеграции
pnpm add @astrojs/sitemap @astrojs/rss @astrojs/mdx
# SEO, robots, embeds
pnpm add astro-robots-txt astro-seo astro-embed
# Галерея
pnpm add photoswipe
# Стили
pnpm add -D tailwindcss @tailwindcss/vite @tailwindcss/typography
# Линтер и форматер
pnpm add -D eslint eslint-plugin-astro @typescript-eslint/parser prettier prettier-plugin-astro
```

### Назначение новых пакетов

| Пакет | Назначение |
|---|---|
| `@astrojs/mdx` | MDX-файлы в Content Collections (JSX-компоненты в markdown) |
| `astro-robots-txt` | Генерация `robots.txt` через конфиг (вместо статического файла) |
| `astro-seo` | Компонент `<SEO>` для meta-тегов (но у нас свой `SEO.astro` — используется как опциональная база) |
| `astro-embed` | Готовые компоненты: `<YouTube>`, `<Tweet>`, `<Vimeo>` — заменяют `{{< youtube >}}` шорткоды Hugo |
| `photoswipe` | Лайтбокс для галерей (замена `lightgallery: true` из Hugo-тем) |

**Примечание по `astro-seo`:** Пакет предоставляет компонент-обёртку. Можно использовать его внутри нашего `SEO.astro` или написать компонент полностью с нуля. Рекомендуется написать свой — больше контроля над JSON-LD и нестандартными мета-тегами (верификации Яндекс/Pinterest/Zen).

**Примечание по `@astrojs/mdx`:** Добавить интеграцию в `astro.config.mjs`. Посты с YouTube/CodePen шорткодами мигрируются в `.mdx` — это позволяет использовать `<YouTube id="...">` из `astro-embed` прямо в контенте. Content Collections поддерживают смешанные `.md` и `.mdx` файлы в одной коллекции.

**Примечание по `astro-robots-txt`:** Заменяет `public/robots.txt`. Генерируется автоматически из конфига, поддерживает sitemap-ссылку.

**Примечание по `photoswipe`:** Инициализируется через клиентский JS-скрипт в `BaseLayout.astro` или `PostLayout.astro`. CSS импортируется глобально.

**Tailwind v4** — нет `tailwind.config.mjs`, конфигурация через CSS:
```css
/* src/styles/global.css */
@import "tailwindcss";
@import "@tailwindcss/typography";

@theme {
  --color-accent: oklch(55% 0.2 250);
  /* ... */
}
```

В `astro.config.mjs` используется плагин `@tailwindcss/vite`:
```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://totaku.ru',
  trailingSlash: 'always',
  integrations: [
    sitemap(),
    mdx(),
    robotsTxt(),
  ],
  vite: { plugins: [tailwindcss()] },
  markdown: { shikiConfig: { theme: 'github-dark', wrap: true } },
});
```

---

## Линтер и форматер

### ESLint (`.eslintrc.cjs`)

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:astro/recommended'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: { parser: '@typescript-eslint/parser', extraFileExtensions: ['.astro'] },
      rules: {},
    },
  ],
};
```

### Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } }
  ]
}
```

### `.prettierignore`

```
dist/
node_modules/
src/content/posts/    ← не форматировать MD-файлы контента
```

### Scripts в `package.json`

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "lint": "eslint src --ext .ts,.astro",
  "format": "prettier --write src"
}
```

---

## Порядок реализации

### Шаг 1: Инициализация проекта
- `pnpm create astro@latest new` (в папке рядом с `old/`)
- Установить все пакеты (см. секцию Пакеты)
- Настроить `astro.config.mjs`, `tsconfig.json`
- Настроить ESLint (`.eslintrc.cjs`) и Prettier (`.prettierrc`)
- Убедиться, что `pnpm lint` и `pnpm format` работают

### Шаг 2: Скрипт миграции
- Написать `scripts/migrate.py`
- Запустить, проверить 10 постов вручную
- Исправить edge cases

### Шаг 3: Content Collections
- Создать `src/content/config.ts` со схемой
- Убедиться что все 112 постов парсятся без ошибок (`pnpm astro check`)

### Шаг 4: Роутинг
- `src/pages/[slug].astro` — посты
- `src/pages/index.astro` — главная с пагинацией (25 постов)
- `src/pages/categories/[category]/[...page].astro`
- `src/pages/tags/[tag]/[...page].astro`
- `src/pages/about.astro`

### Шаг 5: SEO
- `src/components/SEO.astro` — все meta + JSON-LD
- `src/pages/rss.xml.ts` — RSS feed
- `robots.txt` — генерируется через `astro-robots-txt` интеграцию (не статический файл)
- Sitemap через `@astrojs/sitemap` интеграцию

### Шаг 6: Дизайн и компоненты
- `src/styles/global.css` — Tailwind v4, CSS переменные, dark mode
- `src/layouts/BaseLayout.astro` — HTML обёртка
- `src/layouts/PostLayout.astro` — лейаут статьи
- `src/components/Header.astro`, `Footer.astro`
- `src/components/PostCard.astro`, `Pagination.astro`
- `src/components/TableOfContents.astro`
- `src/components/DisqusComments.astro`

---

## Критичные файлы для справки

- `old/config.toml` — permalinks, меню, параметры Hugo
- `old/themes/LoveIt/layouts/partials/head/meta.html` — текущие meta теги и коды верификации
- `old/themes/LoveIt/layouts/partials/head/seo.html` — JSON-LD реализация
- `old/content/posts/biesplatnyie-fotostoki/index.md` — эталон поста с картинками и shortcodes
- `old/themes/LoveIt/layouts/shortcodes/admonition.html` — типы admonition для конвертации

---

## Верификация после реализации

1. URL всех постов совпадают с Hugo (список из `old/public/` директории)
2. SEO: проверить meta теги через browser DevTools на нескольких страницах
3. RSS: валидатор W3C
4. Sitemap: открыть `/sitemap-index.xml`
5. Lighthouse audit: целевой балл 95+
6. Disqus: проверить загрузку комментариев на посте
7. Dark mode: переключение и сохранение в localStorage
