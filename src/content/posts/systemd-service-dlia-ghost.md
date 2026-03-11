---
title: "Systemd service для Ghost"
date: 2017-02-05T10:58:13+03:00
draft: false
description: "Простой Systemd service для Ghost."
tags: ["ghost", "линукс", "systemd"]
categories: ["Рукоблудие"]
toc: false
featuredImage: "./images/cover/systemd-service-dlia-ghost.png"
---

Довольно стандартный файл конфигурации. Какие-то хитрые возможности systemd не используются. Тип демона `simple`. Запускается от имени пользователя *ghost* и группы *ghost*. Движок Ghost расположен в директории `/var/www/ghost`.

Создаем пользователя:
```bash
sudo adduser --shell /bin/bash --gecos 'User for ghost application' ghost  
```

Некоторые пункты:

- `Restart=always` - нужен для того, чтобы если движок Ghost упадёт, то systemd перезапустил его
- `PrivateTmp=true` - сделать временные файлы, которые создаются Ghost видимыми только для него, остальные процессы ничего не будут знать о них. Добавил на всякий случай.

Файл `/etc/systemd/system/ghost.service`:
```bash
[Unit]
Description=Ghost blog  
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/ghost
User=ghost
Group=ghost
ExecStart=/usr/bin/npm start --production /var/www/ghost
ExecStop=/usr/bin/npm stop /var/www/ghost
Restart=always
SyslogIdentifier=ghost
Environment=NODE_ENV=production
StandardOutput=syslog
StandardError=syslog
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Запуск:
```bash
systemctl daemon-reload
systemctl enable ghost
systemctl start ghost
```
