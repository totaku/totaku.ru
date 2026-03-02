---
title: "Создания Nginx VirtualHost и установка Drupal одной командой"
date: 2017-03-28T10:18:00+03:00
lastmod: 2020-11-03T03:16:15+03:00
draft: false
keywords: "рукоблудие, drupal, bash"
description: "Если ты ленивый и безумный, то этот пост для тебя! Одна команда как которая сделает все за тебя, но лучше исключительно на локалхосте."

tags: ["drupal","terminal"]
categories: ["Рукоблудие"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/sozdaniia-nginx-virtualhost-i-ustanovka-drupal-odnoi-komandoi.jpg"
---
Если ты ленивый и безумный, то этот пост для тебя! Одна команда как которая сделает все за тебя, но лучше исключительно на локалхосте.

Для начала нам нужно создать файл с конфигом Nginx для Drupal. Создадим папку `conf`. В ней файл `drupal` и в вставим в него:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name www.example.com;
    return 301 $scheme://example.com$request_uri;
}

server {
    listen 80;
        listen [::]:80;

        server_name example.com;
        root /var/www/example.com; 

        client_max_body_size 100m;

        access_log off;
        error_log /home/username/logs/nginx-example.com-error.log; ## username заменить на ваше имя пользователя

        # Enable compression, this will help if you have for instance advagg‎ module
        # by serving Gzip versions of the files.
        gzip_static on;

        location = /favicon.ico {
                log_not_found off;
                access_log off;
        }

        location = /robots.txt {
                allow all;
                log_not_found off;
                access_log off;
        }

        # This matters if you use drush prior to 5.x
        # After 5.x backups are stored outside the Drupal install.
        #location = /backup {
        #        deny all;
        #}

        # Very rarely should these ever be accessed outside of your lan
        location ~* \.(txt|log)$ {
                allow 192.168.0.0/16;
                deny all;
        }

        location ~ \..*/.*\.php$ {
                return 403;
        }

        # No no for private
        location ~ ^/sites/.*/private/ {
                return 403;
        }

        # Block access to "hidden" files and directories whose names begin with a
        # period. This includes directories used by version control systems such
        # as Subversion or Git to store control files.
        location ~ (^|/)\. {
                return 403;
        }

        location / {
                # This is cool because no php is touched for static content
                try_files $uri @rewrite;
        }

        location @rewrite {
                # You have 2 options here
                # For D7 and above:
                # Clean URLs are handled in drupal_environment_initialize().
                rewrite ^ /index.php;
                # For Drupal 6 and bwlow:
                # Some modules enforce no slash (/) at the end of the URL
                # Else this rewrite block wouldn't be needed (GlobalRedirect)
                #rewrite ^/(.*)$ /index.php?q=$1;
        }

        location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php7.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        }

        # Fighting with Styles? This little gem is amazing.
        # This is for D6
        #location ~ ^/sites/.*/files/imagecache/ {
        # This is for D7 and D8
        location ~ ^/sites/.*/files/styles/ {
                try_files $uri @rewrite;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
                expires max;
                log_not_found off;
        }
}
```

Установим `pwgen`:
```bash
apt-get install pwgen
```

Создаем в файл `si.sh` в папке пользователя `/home/username/`.
```bash
#!/bin/bash
sd=/var/www # папка где будет создан сайт
sc=/home/username/conf # папка с конфигом
PASS=`pwgen -s 30 1` # генерируем пароль
echo "Creating virtual host $1"
sudo cp $sc/drupal /etc/nginx/conf.d/$1.conf
echo "Updating vhost confin for $1"
sudo sed -i s,example.com,$1,g /etc/nginx/conf.d/$1.conf
sudo sed -i s,$sd/example.com,$sd/$1,g /etc/nginx/conf.d/$1.conf
echo "Restarting Nginx"
sudo systemctl reload nginx
echo "Create database $2"
mysql -u root -p << EOF
CREATE DATABASE $2 CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER '$2'@'localhost' IDENTIFIED BY '$PASS';
GRANT ALL PRIVILEGES ON $2.* TO '$2'@'localhost';
FLUSH PRIVILEGES;
EOF
echo "Instal Drupal"
cd $sd
drush dl drupal-7.54
mv drupal-7.54 $1
cd $1
git clone https://github.com/totaku/fellema-dev.git profiles/fellema # мой профиль для Drupal
drush si fellema --locale=ru --site-name=$1  --db-url=mysql://$2:$PASS@localhost/$2 --account-name=admin --account-pass=admin--account-mail=admin@admin.admin
chmod 0777 -R $sd/$1/sites/default/files
echo "Finished!"
echo "MySQL user created."
echo "Username: $2"
echo "Password: $PASS"
echo "Local address: $sd/$1"
echo "Web address: http://$1"
```

Сохраним и дадим файлу права на исполнение:
```bash
sudo chmod a+x si.sh
```

Скрипт готов к работе, запускаем его с помощью команды:
```bash
./si test.com test
``` 

Где `test.com` название вашего сайта, `test` база данных сайта и имя пользователя.

**UPD**: Пользователь [@multpix](http://drupal.ru/username/multpix) на форуме [Д.ру](http://drupal.ru)[предлагает](http://drupal.ru/comment/688921#comment-688921) более простое решение для локальной разработки:
```bash
drush dl drupal && mv drupal-8.2.7 drupal && cd drupal
drush si minimal --db-url=sqlite://sites/default/files/.ht.sqlite
drush rs
```