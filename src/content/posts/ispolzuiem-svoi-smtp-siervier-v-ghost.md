---
title: "Используем свой smtp сервер в Ghost"
date: 2017-01-13T20:00:00+03:00
lastmod: 2020-11-03T02:13:11+03:00
draft: false
keywords: "рукоблудие, ghost, SMTP"
description: "Официальная документация Ghost предлагает выбрать из 3 smtp серверов: Gmail, Amazon SES, Mailgun. В ней не слова не говорится, о собственном smpt сервере."

tags: ["ghost","smtp"]
categories: ["dev"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/ispolzuiem-svoi-smtp-siervier-v-ghost.jpg"
---

Официальная [документация](http://docs.ghost.org/mail/) Ghost предлагает выбрать из 3 smtp серверов: Gmail, Amazon SES, Mailgun. В ней не слова не говорится, о собственном smpt сервере.
<!--more-->
Вот протстое решение (подсмотрел в настройках [nodemailer](https://github.com/andris9/Nodemailer#setting-up-smtp)):
```json
mail: {
    transport: 'SMTP',
    options: {
        host: 'yourdomain.com',
        secureConnection: true,
        port: 465,
        auth: {
            user: 'ghost@yourdomain.com',
            pass: '****'
        }
    }
}
```

Собственно все.
