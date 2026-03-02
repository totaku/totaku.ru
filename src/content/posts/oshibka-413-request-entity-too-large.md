---
title: "Ошибка 413 Request Entity Too Large"
date: 2016-10-05T18:12:00+03:00
lastmod: 2020-10-27T03:58:19+03:00
draft: false
keywords: "рукоблудие, линукс, nginx"
description: "По умолчании в nginx стоит ограничение 1m на размер тела от клиента и при загрузке файла больше 1м клиент получает эту ошибку."

tags: ["nginx"]
categories: ["dev"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/oshibka-413-request-entity-too-large.jpg"
---

В конфиге `nginx.conf` в секцию `http` добавить параметр:
```nginx
client_max_body_size 100m;
```

Открыть конфиг с правами рута:
```bash
sudo nano /etc/nginx/nginx.conf
```

и прописать:
```nginx
client_max_body_size 100m;
```

Перезагрузить nginx:
```bash
sudo service nginx restart
```

По умолчании в nginx стоит ограничение 1m на размер тела от клиента и при загрузке файла больше 1м клиент получает эту ошибку. Вы можете прописать не именно 100м, а столько, сколько вам необходимо, если вам нужен больший размер.

Утянул у [@Graytone](http://mihail.space/post/osibka-413-request-entity-too-large).