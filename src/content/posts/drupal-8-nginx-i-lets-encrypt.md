---
title: "Drupal 8, nginx и Let's Encrypt"
date: 2019-04-04T09:50:42+03:00
lastmod: 2020-11-03T06:24:58+03:00
draft: false
keywords: "рукоблудие, nginx, let's encrypt, HTTPS, drupal, перевод"
description: "Нашел хорошую заметку о дружбе Drupal 8, nginx и Let's Encrypt. Сделал для вас перевод."

tags: ["drupal","nginx","let's encrypt","ssl"]
categories: ["dev"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/drupal-8-nginx-i-lets-encrypt.jpg"
---

Нашел хорошую заметку о дружбе Drupal 8, nginx и Let's Encrypt. Сделал для вас перевод.

Мой сайт работает на Drupal 8. Я использую nxinx в качестве веб сервера и [Let's Encrypt](https://letsencrypt.org/) сертификаты. В этом посте я покажу как выглядит мой nginx конфиг.

Мой домен gorannikolovski.com.

Все запросы используют https-without-www перенаправление. Это значит, что если вы попробуете перейти по адресам:

- [http://www.gorannikolovski.com](http://www.gorannikolovski.com)
- [https://www.gorannikolovski.com](https://www.gorannikolovski.com)
- [http://www.gorannikolovski.com](http://www.gorannikolovski.com)

Вы будете перенаправлены на [https://gorannikolovski.com](https://gorannikolovski.com).

Вот мой nginx конфиг:
```
server {
  server_name gorannikolovski.com;
  root /var/www/gorannikolovski.com/web; ## <-- Your only path reference.

  access_log /var/log/web/gorannikolovski.com_access_log;
  error_log /var/log/web/gorannikolovski.com_error_log;

  location = /favicon.ico {
    log_not_found off;
    access_log off;
  }

  location = /robots.txt {
    allow all;
    log_not_found off;
    access_log off;
  }

  # Very rarely should these ever be accessed outside of your lan
  location ~* \.(txt|log)$ {
    allow 192.168.0.0/16;
    deny all;
  }

  location ~ \..*/.*\.php$ {
    return 403;
  }

  location ~ ^/sites/.*/private/ {
    return 403;
  }

  # Allow "Well-Known URIs" as per RFC 5785
  location ~* ^/.well-known/ {
    allow all;
  }

  # Block access to "hidden" files and directories whose names begin with a
  # period. This includes directories used by version control systems such
  # as Subversion or Git to store control files.
  location ~ (^|/)\. {
    return 403;
  }

  location / {
    # try_files $uri @rewrite; # For Drupal <= 6
    try_files $uri /index.php?$query_string; # For Drupal >= 7
  }

  location @rewrite {
    rewrite ^/(.*)$ /index.php?q=$1;
  }

  # Don't allow direct access to PHP files in the vendor directory.
  location ~ /vendor/.*\.php$ {
    deny all;
    return 404;
  }

  # In Drupal 8, we must also match new paths where the '.php' appears in
  # the middle, such as update.php/selection. The rule we use is strict,
  # and only allows this pattern with the update.php front controller.
  # This allows legacy path aliases in the form of
  # blog/index.php/legacy-path to continue to route to Drupal nodes. If
  # you do not have any paths like that, then you might prefer to use a
  # laxer rule, such as:
  #   location ~ \.php(/|$) {
  # The laxer rule will continue to work if Drupal uses this new URL
  # pattern with front controllers other than update.php in a future
  # release.
  location ~ '\.php$|^/update.php' {
    fastcgi_split_path_info ^(.+?\.php)(|/.*)$;
    # Security note: If you're running a version of PHP older than the
    # latest 5.3, you should have "cgi.fix_pathinfo = 0;" in php.ini.
    # See http://serverfault.com/q/627903/94922 for details.
    fastcgi_param APP_ENV GOCLOUD-LIVE;
    include fastcgi_params;
    # Block httpoxy attacks. See https://httpoxy.org/.
    fastcgi_param HTTP_PROXY "";
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param PATH_INFO $fastcgi_path_info;
    fastcgi_param QUERY_STRING $query_string;
    fastcgi_intercept_errors on;
    fastcgi_pass 127.0.0.1:9000;
  }

  # Fighting with Styles? This little gem is amazing.
  # location ~ ^/sites/.*/files/imagecache/ { # For Drupal <= 6
  location ~ ^/sites/.*/files/styles/ { # For Drupal >= 7
    try_files $uri @rewrite;
  }

  # Handle private files through Drupal. Private file's path can come
  # with a language prefix.
  location ~ ^(/[a-z\-]+)?/system/files/ { # For Drupal >= 7
    try_files $uri /index.php?$query_string;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    try_files $uri @rewrite;
    expires max;
    log_not_found off;
  }


  listen 443 ssl; # managed by Certbot
  ssl_certificate /etc/letsencrypt/live/gorannikolovski.com/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/gorannikolovski.com/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
  if ($host = gorannikolovski.com) {
    return 301 https://$host$request_uri;
  } # managed by Certbot


  server_name gorannikolovski.com;
  listen 80;
  return 404; # managed by Certbot
}

server {
  listen 80;
  listen 443 ssl;
  server_name www.gorannikolovski.com;
  return 301 https://gorannikolovski.com$request_uri;
}
```

Блоки с комментарием `# managed by Certbot` вставлены автоматически Cetbot'ом. Cetbot это утилита установленная на ваш сервер и запускается простой командой:
```bash
certbot
```

Вы можете выбрать домен для которого получить сертификат Let's Encrypt. Выгладит это примерно так:

![](https://fairu.totaku.ru/Image_xw1CwPeP2u.jpg)

Все и это круто!

Certbot обновит ваш конфигурационный файл если вы не хотите делать это ручками. Я использую Ubuntu 18.04 на своем сервере, для установки Certbot'а можно использовать эту [инструкцию](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx). Так же там есть инструкции и под другие операционные системы.

[Оригинал](https://gorannikolovski.com/blog/drupal-8-nginx-and-lets-encrypt).
