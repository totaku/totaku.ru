---
title: "Исправляем ошибку perl: warning: Setting locale failed в Ubuntu/Debian"
date: 2017-01-17T19:34:16+03:00
draft: false
description: "Обычно на свежеустановленном Debian/Ubuntu появляется ошибка (например при установке пакетов)."
tags: ["терминал", "линукс", "рукоблудие", "ubuntu", "консоль", "debian"]
categories: ["Рукоблудие"]
toc: false
featuredImage: "./images/cover/ispravliaiem-oshibku-perl-warning-setting-locale-failed-v-ubuntu-debian.jpg"
---

Обычно на свежеустановленном Debian/Ubuntu появляется ошибка (например при установке пакетов):

```bash
    perl: warning: Setting locale failed.
    perl: warning: Please check that your locale settings:
        LANGUAGE = "en_US:",
        LC_ALL = (unset),
        LC_CTYPE = "ru_RU.UTF-8",
        LANG = "en_US"
        are supported and installed on your system.
    perl: warning: Falling back to a fallback locale ("en_US").
    locale: Cannot set LC_CTYPE to default locale: No such file or directory
    locale: Cannot set LC_ALL to default locale: No such file or directory
```

Для исправления достаточно выполнить команду:
```bash
dpkg-reconfigure locales
```    

и отметить в появившемся окне:
```
en_US.UTF-8
ru_RU.UTF-8
```
