---
title: "Включаем поддержку UTF8MB4 в Drupal 7"
date: 2016-11-23T18:44:00+03:00
lastmod: 2020-11-03T01:57:20+03:00
draft: false
keywords: "рукоблудие, drupal, MySQL"
description: "Drupal 7 с версии 7.50, научился поддерживать UTF8MB4, но по умолчанию оно не работает."

tags: ["drupal","mysql"]
categories: ["Рукоблудие"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/vkliuchaiem-poddierzhku-utf8mb4-v-drupal-7.png"
---

Drupal 7 с версии 7.50, научился поддерживать UTF8MB4, но по умолчанию оно не работает. Вообще конечно, это лишь видно в отчёт о состоянии и оно как бы не обязательно, но лично меня раздражает вот это сообщение:

Чтоб от этого избавиться применим магию и заклинаяни. Для начала надо установить сам конвертер.
```bash
drush dl utf8mb4_convert
drush cc drush
```    

Конвертер установлен, его не нужно устанавливать на каждый сайт, он ставится лишь один раз и устанавливается как команда драш. Теперь пора применить магию и заклинания к каждому конкретному сайту. Погнали

1. Делаем бэкап базы данных `drush sql-dump >> backup.sql`
2. Включаем режим обслуживания `drush vset maintenance_mode 1`
3. Конвертируем нашу базу `drush utf8mb4-convert-databases`
4. Включаем поддержку utf8mb4 в `settings.php`
```php
$databases['default']['default'] = array(
  'driver' => 'mysql',
  'database' => 'databasename',
  'username' => 'username',
  'password' => 'password',
  'host' => 'localhost',
  'charset' => 'utf8mb4',
  'collation' => 'utf8mb4_general_ci',
);
```

5. Выключаем режим обслуживания `drush vset maintenance_mode 0`

Все! Магия и заклинания теперь вступили в силу и работают. Запускаем, крон и смотрим отчет о состоянии на нашем сайте, он должен выглядеть так:

#### UPD

В комментариях товарищ [bassay](https://totaku.ru/vkliuchaiem-poddierzhku-utf8mb4-v-drupal-7/#comment-3776652652) подсказывает, что нужно бы еще и конфиг MySQL поправить:
```
[mysqld]
innodb_large_prefix=true
innodb_file_format=barracuda
innodb_file_per_table=true
```