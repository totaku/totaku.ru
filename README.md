# totaku.ru

Личный блог на [Astro 5](https://astro.build/) + MDX + Tailwind CSS v4.

## Стек

- **Astro 5** — фреймворк
- **Tailwind CSS v4** через `@tailwindcss/vite` (без `tailwind.config.js`)
- **MDX** для контента с богатыми компонентами
- **Pagefind** — поиск по сайту (генерируется после билда)
- **PhotoSwipe** — лайтбокс для галерей
- **Shiki** — подсветка кода (темы: Tokyo Night + GitHub Light)

## Команды

```bash
pnpm dev           # dev-сервер на http://localhost:4321
pnpm build         # билд + генерация поискового индекса Pagefind
pnpm preview       # предпросмотр билда
```

## Структура

```
src/
  components/    # Astro-компоненты
  config/        # Настройки (аналитика)
  content/posts/ # Посты (.md / .mdx)
  layouts/       # BaseLayout, PostLayout
  pages/         # Маршруты
  styles/        # global.css
  utils/         # Утилиты TypeScript
```

---

## Фронтматтер поста

```yaml
---
title: "Заголовок поста"
date: 2024-01-15
lastmod: 2024-01-20          # опционально, дата обновления
draft: false                  # true — пост не публикуется
description: "Описание"       # краткое описание (для SEO и карточки)
featuredImage: ./cover.jpg    # обложка (путь относительно файла поста)
tags: ["css", "tutorial"]     # теги
categories: ["Веб"]           # категории (используется первая)
keywords: "ключевые слова"    # для мета-тега keywords
toc: false                    # показывать оглавление
hiddenFromHomePage: false      # скрыть с главной
---
```

---

## Компоненты

### Лейауты

#### `BaseLayout.astro`

Базовый макет. Включает: Header, Footer, ReadingProgress, BackToTop, SearchModal.

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---
<BaseLayout title="Заголовок" description="Описание">
  <slot />
</BaseLayout>
```

#### `PostLayout.astro`

Макет поста. Включает: TableOfContents, ShareButtons, PostNavigation, SEO.

---

### Карточки и лента

#### `PostCard.astro`

Карточка поста в сетке. Используется внутри `InfinitePostList`.

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `post` | `CollectionEntry<'posts'>` | — | Пост |
| `animDelay` | `number` | `0` | Задержка анимации (секунды) |

#### `InfinitePostList.astro`

Бесконечная прокрутка постов. Все посты рендерятся сервером, JS только показывает скрытые.

```astro
---
import InfinitePostList from '@/components/InfinitePostList.astro';
---
<InfinitePostList posts={allPosts} initialCount={9} batchSize={6} />
```

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `posts` | `CollectionEntry<'posts'>[]` | — | Список постов |
| `initialCount` | `number` | `9` | Кол-во постов при загрузке |
| `batchSize` | `number` | `6` | Кол-во добавляемых за раз |

#### `Hero.astro`

Блок с аватаркой, именем, биографией и ссылками. Используется на главной.

```astro
---
import Hero from '@/components/Hero.astro';
---
<Hero />
```

---

### Навигация и UI

#### `Header.astro`

Шапка сайта с логотипом, навигацией, кнопкой поиска и переключателем темы.

#### `Footer.astro`

Подвал сайта.

#### `BackToTop.astro`

Кнопка «Наверх», появляется после 300px скролла.

```astro
---
import BackToTop from '@/components/BackToTop.astro';
---
<BackToTop />
```

#### `ReadingProgress.astro`

Полоска прогресса чтения вверху страницы.

```astro
---
import ReadingProgress from '@/components/ReadingProgress.astro';
---
<ReadingProgress />
```

---

### Поиск

#### `SearchModal.astro`

Модальное окно поиска на базе Pagefind. Открывается по `⌘K` / `Ctrl+K` или кнопкой в шапке.

> Поиск работает только в production. В dev-режиме показывает подсказку запустить `pnpm build`.

```astro
---
import SearchModal from '@/components/SearchModal.astro';
---
<SearchModal />
```

Программный вызов из JS:
```js
window.openSearchModal?.();
```

---

### Контент поста

#### `TableOfContents.astro`

Оглавление из h2/h3, коллапсируется нативным `<details>`.

```astro
---
import TableOfContents from '@/components/TableOfContents.astro';
const { headings } = Astro.props; // из PostLayout
---
<TableOfContents headings={headings} initiallyOpen={true} />
```

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `headings` | `{ depth, slug, text }[]` | — | Заголовки поста (из Astro) |
| `initiallyOpen` | `boolean` | `true` | Открыто по умолчанию |

#### `ShareButtons.astro`

Кнопки шаринга: Telegram, X (Twitter), Bluesky.

```astro
---
import ShareButtons from '@/components/ShareButtons.astro';
---
<ShareButtons url="https://totaku.ru/post-slug/" title="Заголовок поста" />
```

| Проп | Тип | Описание |
|------|-----|----------|
| `url` | `string` | URL страницы |
| `title` | `string` | Заголовок поста |

#### `PostNavigation.astro`

Навигация «Предыдущий / Следующий» в конце поста.

```astro
---
import PostNavigation from '@/components/PostNavigation.astro';
---
<PostNavigation prevPost={prevPost} nextPost={nextPost} />
```

| Проп | Тип | Описание |
|------|-----|----------|
| `prevPost` | `CollectionEntry<'posts'> \| null` | Предыдущий пост |
| `nextPost` | `CollectionEntry<'posts'> \| null` | Следующий пост |

---

### MDX-компоненты (для использования в постах)

#### `Quote.astro`

Цитата с двумя вариантами оформления.

```mdx
import Quote from '@/components/Quote.astro';

<Quote author="Автор" variant="border">
  Текст цитаты здесь.
</Quote>

<Quote variant="corners">
  Текст без автора с угловыми скобками.
</Quote>
```

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `author` | `string` | — | Подпись |
| `variant` | `'border' \| 'corners'` | `'border'` | Стиль оформления |

#### `InfoBlock.astro`

Блок с акцентом (инфо, предупреждение, совет, опасность).

```mdx
import InfoBlock from '@/components/InfoBlock.astro';

<InfoBlock title="Заметка" variant="info">
  Полезная информация.
</InfoBlock>

<InfoBlock variant="warning">
  Без заголовка — только иконка через цвет блока.
</InfoBlock>
```

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `title` | `string` | — | Заголовок блока |
| `variant` | `'info' \| 'warning' \| 'tip' \| 'danger'` | `'info'` | Тип |
| `class` | `string` | `''` | Дополнительные CSS-классы |

Цвета акцента: `info` — `--accent`, `warning` — оранжевый, `tip` — зелёный, `danger` — красный.

#### `ImageGallery.astro`

Галерея с PhotoSwipe лайтбоксом. Поддерживает single/double/grid layout.

```mdx
import ImageGallery from '@/components/ImageGallery.astro';
import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';

<!-- Одно изображение -->
<ImageGallery images={[img1]} layout="single" />

<!-- Два в ряд -->
<ImageGallery images={[img1, img2]} layout="double" alt={['Фото 1', 'Фото 2']} />

<!-- Сетка с подписью -->
<ImageGallery
  images={[img1, img2, img3]}
  layout="grid"
  aspectRatio="4/3"
  caption="Три фотографии"
/>
```

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `images` | `ImageMetadata[] \| { src, alt? }[]` | — | Изображения |
| `layout` | `'single' \| 'double' \| 'grid'` | — | Расположение |
| `caption` | `string` | — | Подпись под галереей |
| `aspectRatio` | `'16/9' \| '4/3' \| '3/2' \| '1/1' \| 'auto'` | `'16/9'` | Пропорции |
| `alt` | `string[] \| ((i) => string) \| string` | — | Alt-текст (для ImageMetadata[]) |

При > 6 изображений последнее показывает оверлей «+N», остальные скрыты в лайтбоксе.

#### `LinkPreview.astro`

Превью ссылки с OG-метаданными (загружается на этапе билда).

```mdx
import LinkPreview from '@/components/LinkPreview.astro';

<LinkPreview url="https://example.com" />

<!-- Без изображения, с URL -->
<LinkPreview url="https://example.com" showImage={false} showUrl={true} />
```

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `url` | `string` | — | URL |
| `showImage` | `boolean` | `true` | Показывать OG-изображение |
| `customImage` | `string` | — | Своё изображение вместо OG |
| `showUrl` | `boolean` | `false` | Показывать URL под описанием |
| `customDescription` | `string` | — | Своё описание вместо OG |
| `class` | `string` | `''` | Дополнительные CSS-классы |

#### `CodePen.astro`

Встроенный CodePen.

```mdx
import CodePen from '@/components/CodePen.astro';

<CodePen id="abcXYZ" height={400} tab="result" />
```

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `id` | `string` | — | Slug хэш пена |
| `height` | `number` | `500` | Высота в px |
| `tab` | `string` | `'result'` | Вкладка по умолчанию |

#### `DisqusComments.astro`

Блок комментариев Disqus.

```astro
---
import DisqusComments from '@/components/DisqusComments.astro';
---
<DisqusComments slug="post-slug" title="Заголовок" url="https://totaku.ru/post-slug/" />
```

| Проп | Тип | Описание |
|------|-----|----------|
| `slug` | `string` | Уникальный идентификатор (slug поста) |
| `title` | `string` | Заголовок поста |
| `url` | `string` | Полный URL поста |

---

### SEO

#### `SEO.astro`

SEO-мета-теги: title, description, OG, Twitter Card. Используется внутри `PostLayout`.

---

## Утилиты

### `src/utils/formatDate.ts`

```ts
import { formatDate, formatDateShort, formatDateLong } from '@/utils/formatDate';

formatDateShort(date);  // "15 янв. 2024"
formatDateLong(date);   // "15 января 2024"
formatDate(date);       // алиас для formatDateShort
```

### `src/utils/jsonLd.ts`

JSON-LD схемы для структурированных данных.

```ts
import { generateWebSiteSchema, generateArticleSchema, generateBreadcrumbSchema, serializeJsonLd } from '@/utils/jsonLd';

const schema = generateArticleSchema(post, siteUrl, currentUrl);
const json = serializeJsonLd(schema);
// → <script type="application/ld+json">{json}</script>

generateBreadcrumbSchema([
  { name: 'Главная', url: 'https://totaku.ru/' },
  { name: 'Категория', url: 'https://totaku.ru/categories/web/' },
]);
```

### `src/utils/transliterate.ts`

Транслитерация русского текста для генерации URL.

```ts
import { transliterate } from '@/utils/transliterate';

transliterate('Веб')  // → 'veb'
```

### `src/utils/posts.ts`

```ts
import { POSTS_PER_PAGE } from '@/utils/posts';
// POSTS_PER_PAGE = 25
```

---

## Конфигурация

### `src/config/analytics.ts`

Управление аналитическими сервисами и согласием пользователя.

```ts
import { analyticsServices, hasAnalyticsConsent, acceptAnalyticsConsent, shouldShowCookieBanner } from '@/config/analytics';

// Добавить сервис — отредактировать analyticsServices[]
// enabled: true — активирует сервис

if (shouldShowCookieBanner()) {
  // показать баннер
}

if (hasAnalyticsConsent()) {
  // загрузить счётчики
}

acceptAnalyticsConsent(); // сохранить согласие
```

По умолчанию все сервисы отключены (`enabled: false`).

---

## Темизация

Темы `dark` / `light` через атрибут `data-theme` на `<html>`. Переключается кнопкой в шапке, сохраняется в `localStorage`.

CSS-переменные доступны в любом компоненте:

| Переменная | Описание |
|------------|----------|
| `--bg` | Фон страницы |
| `--bg-card` | Фон карточки |
| `--bg-secondary` | Вторичный фон |
| `--border` | Тонкая граница |
| `--border-mid` | Средняя граница |
| `--text` | Основной текст |
| `--text-muted` | Приглушённый текст |
| `--text-dim` | Второстепенный текст |
| `--accent` | Акцентный цвет |

---

## Pagefind (поиск)

Индекс генерируется автоматически при `pnpm build` (команда `pagefind --site dist` запускается после Astro).

В dev-режиме поиск недоступен — `SearchModal` показывает подсказку.
