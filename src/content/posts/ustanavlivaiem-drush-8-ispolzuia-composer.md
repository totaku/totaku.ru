---
title: "Устанавливаем Drush 8 используя Composer"
date: 2016-02-21T17:17:00+03:00
lastmod: 2020-10-27T03:22:49+03:00
draft: false
keywords: "drupal, рукоблудие, drush"
description: "В чатике DrupalRu узнал, что есть уже Drush 8 и люди им пользуется."

tags: ["drupal","drush","terminal"]
categories: ["Рукоблудие"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/ustanavlivaiem-drush-8-ispolzuia-composer.png"
---

Проснулся сегодня утром. Налил чай и сел за комп. И думал уже заняться чем то полезным, но судьба решила по другому. В чатике [DrupalRu](https://gitter.im/orgs/DrupalRu/rooms) узнал, что есть уже Drush 8 и люди им пользуется. Залез на свою виртуалочку проверить какая версия Drush у меня. Оказалось, что у меня 5.х версия, установленная через `apt-get`. Покопавшись в интернете нашел прекрасную статью как это исправить, ее и решил перевести.

Недавно в разговоре с друзьями и коллегами я столкнулся с проблемой. Люди до сих пор используют `apt-get`, `homebrew` или другие методы для установки Drush. Это странно для тех кто использует Drupal 8, поскольку он требует Drush 8. Использование Composer является самым простым способом установить Drush.

## Установка

Для начала установим Composer:
```bash
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
``` 

Теперь пропишем путь в `.bash_profile` или `.zshrc`:
```bash
export PATH="$HOME/.composer/vendor/bin:$PATH"
```

Перезапустим терминал или выполним команду:
```bash
source ~/.bash_profile
```

Теперь устанавливаем Drush, установим `dev` версию:
```bash
composer global require drush/drush:dev-master
```

Вот и все! Все работает.

Проверить версию Drush можно командой
```bash
drush --version
```

## Что можно еще?

Обновить Drush (и все остальное, что вы установили через Composer):
```bash
composer global update
```

Откатиться к версии Drush 7:
```bash
composer global require drush/drush:7.*
``` 

Установить определенную версию Drush. Например: Drush 6.1.0
```bash
composer global require drush/drush:6.1.0
```    

[Оригинал](http://whaaat.com/installing-drush-8-using-composer)