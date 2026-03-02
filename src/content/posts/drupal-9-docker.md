---
title: "Docker и Drupal 9 — как быстро их свести"
date: 2020-12-21T16:38:03+03:00
lastmod: 2020-12-21T16:38:03+03:00
draft: false
keywords: "docker, drupla 9, ddev"
description: "Устанавливаем Drupal 9 использую DDEV для локальной разработки."

tags: ["docker","drupal"]
categories: ["dev"]

hiddenFromHomePage: false

toc: true
featuredImage: "./images/cover/drupal-9-docker.jpg"
---

В целом существует много способов скрестить [Docker](https://www.docker.com/) и [Drupal](https://www.drupal.org/). Но большая часть из них либо большая и сложна, либо дурацкая и не самая удобная. Покопавшись какое то время в разных способах я нашел идеальный для себя. Ну вы почитайте, может и вам пригодится.

Для локальной разработки, нужно чтоб все разворачиваемое окружения было простым как раз два три. А что может быть проще чем выполнить несколько команд? Да ничего!

Вот например для работы с [docker4drupal](https://github.com/wodby/docker4drupal) не достаточно просто скачать с гита и начать комфортно работать. Нужно все же открыть как минимум `.env` и поиграться с ним. А [Lando](https://lando.dev/)? Да там ваще без поллитра не разберешься.

## DDEV
И вот я наткнулся на [DDEV](https://www.ddev.com/). Просто идеальное решение! Раз два три и все готово.

### Установка
Пожалуй самая сложная часть. Для начала нужно установить Docker. Как установить его в [Ubuntu я уже писал](https://totaku.ru/ustanovka-docker-i-docker-compose-na-ubuntu-20-04/), а для всего остального [читать тут](https://www.docker.com/get-started). Далее нужно установить сам DDEV. 

Если вы пользуетесь маком, то скорей всего вы уже давно знаете, что такое [Homebrew](https://brew.sh/index_ru) и нафига оно нужно. Если нет, что я ваще не понимаю нахера вы это читаете. Линуксойды читаем тут как [установить](https://docs.brew.sh/Homebrew-on-Linux) эту штуку для вас. Ну а виндузятникам разработчики очень рекомендуют устанавливать DDEV через [Chocolatey](https://ddev.readthedocs.io/en/stable/#installation-or-upgrade-windows).

#### Установка DDEV на macOS/Linux
```bash
brew tap drud/ddev && brew install ddev
```

#### Установка DDEV на Windows
```bash
choco install ddev
```

#### Что дальше?
А дальше создавайте проекты и работаете с ними. Например можете выполнить `ddev -h` и посмотреть на список команд. Либо почитать [документацию на сайте](https://ddev.readthedocs.io/en/stable/) и посмотреть примеры конфигурации под разные проекты.

## Установка Drupal
И вот то ради чего я все затеял. Нужно выполнить все 6 команд:
```bash
mkdir my-drupal9-site
cd my-drupal9-site
ddev config --project-type=drupal9 --docroot=web --create-docroot
ddev start
ddev composer create "drupal/recommended-project"
ddev launch
```
Если вам нужно установить Drush, выполняем следующую команду:
```bash
ddev composer require drush/drush
```
Ну, а далее для установки чего-то для Drupal через Composer вам нужно выполнить:
```bash
ddev composer require <..>
```
Все! Проект работает и готов к работе. Кстати в документации есть примеры для [Drupal 7](https://ddev.readthedocs.io/en/stable/users/cli-usage/#drupal-67-quickstart), [Drupal 8](https://ddev.readthedocs.io/en/stable/users/cli-usage/#drupal-8-quickstart), [Wordpress](https://ddev.readthedocs.io/en/stable/users/cli-usage/#wordpress-quickstart) и [прочего](https://ddev.readthedocs.io/en/stable/users/cli-usage/#quickstart-guides).

## Итого
Как я и говорил это самый простой и понятный способ запустить Drupal+Docker для локальной разработки.