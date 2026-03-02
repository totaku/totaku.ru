---
title: "Как встроить Youtube в сайт на Nuxt используя Markdown"
date: 2023-12-04T16:32:18+03:00
lastmod: 2023-21-04T23:32:18+03:00
draft: false
keywords: "drupal, terminal, drush"
description: "Встраивать Youtube в блог с Nuxt еще никогда не было так просто. Подключите к нему пакет `lite-youtube-embed`, создайте плагин и компонент Nuxt, и все. Дальше вы сможете использовать этот компонент во всех своимх Markdown файлах."

tags: ["js","vue","nuxt","markdown"]
categories: ["dev"]

hiddenFromHomePage: false

toc: true
featuredImage: "./images/cover/how-to-embed-youtube-in-nuxt-website-via-markdown-file.jpg"
---

Встраивать Youtube в блог с Nuxt еще никогда не было так просто. Подключите к нему пакет `lite-youtube-embed`, создайте плагин и компонент Nuxt, и все. Дальше вы сможете использовать этот компонент во всех своих Markdown файлах.

## 1. Установливаем `lite-youtube-embed`

Сначала нам нужно установить npm-пакет [lite-youtube-embed](https://www.npmjs.com/package/lite-youtube-embed), созданный членом команды Google Chrome и разработчиком фронтенда [Полом Айришем](https://www.paulirish.com/). Этот пакет предназначен для вставки видео с Youtube с улучшенной производительностью по сравнению с " обычным" способом.

Я не хочу углубляться в проблемы производительности при встраивании Youtube-плееров в ваш блог. Я хочу показать вам, как вы можете внедрить Youtube-плеер в ваши Markdown-файлы с использованием Nuxt.

Выполняем в папке с проектом следующую команду.

```bash
yarn add lite-youtube-embed
```

или

```bash
npm i lite-youtube-embed
```

Подключите CSS-файл к свойству `css` в файле `nuxt.config.js`.

```js
export default {
  css: [
        'node_modules/lite-youtube-embed/src/lite-yt-embed.css'
    ]
}
```

## 2. Создаем плагин

Создайте файл плагина `youtube.client.js` в папке `plugins`. Убедитесь, что в его названии присутствует `.client.js`, чтобы Nuxt загружал его только в браузере. Записываем в него следующее.

```js dsd
import 'lite-youtube-embed'
```

Теперь вам нужно зарегистрировать этот плагин в файле `nuxt.config.js`, как показано ниже.

```js
export default {
  plugins: ['@/plugins/youtube.client.js']
}
```

## 3. Создаем компонент

Чтобы использовать компонент `<lite-youtube>` в файлах Markdown, необходимо создать Vue компонент для его отображения. В ином случае вы не сможете его использовать на странице.

Я создал компонент `Youtube.vue` в папке `components`.

```js
<template>
    <div class="youtube">
        <lite-youtube
            :videoid="id"
            :playlabel="label"
        />
    </div>
</template>
<script>
    export default {
        props: {
            id: String,
            label: String,
        },
        fetchOnServer: false,
    }
</script>
```

Создав данный компонент, вы можете начать использовать его в своих Markdown-файлах.

## 4. Используем наш компонент

Возникает вопрос, как использовать его в ваших Markdown-файлах?

Добавьте его в файлы, как вы обычно делаете это с компонентами Vue.

```markdown
<youtube id="5SR_NUdg7t8"></youtube>
```

Nuxt волшебным образом превратит весь ваш Markdown-файл в HTML-страницу, которую вы сможете увидеть в браузере.




[Оригинал](https://byrayray.dev/posts/2022-09-20-embed-youtube-nuxt-website-via-markdown)

Photo by <a href="https://unsplash.com/@afgprogrammer?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Mohammad Rahmani</a> on <a href="https://unsplash.com/photos/black-flat-screen-computer-monitor-8qEB0fTe9Vw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>