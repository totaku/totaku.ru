---
title: "Установка Docker и Docker-compose на Ubuntu 18.04"
date: 2018-06-07T07:07:48+03:00
lastmod: 2020-11-03T05:17:32+03:00
draft: false
keywords: "рукоблудие, docker, docker-compose, ubuntu"
description: "В этом посте я расскажу как быстро и просто установить Docker и Docker-compose на Ubuntu 18.04"

tags: ["docker", "docker-compose", "ubuntu"]
categories: ["dev"]

hiddenFromHomePage: false

toc: true
featuredImage: "./images/cover/ustanovka-docker-i-docker-compose-v-ubuntu-18-04.png"
---

Нет смысла расказывать, что такое Docker раз вы читаете это. В этом посте я расскажу как быстро и просто установить [Docker](https://www.docker.com) и Docker-compose на [Ubuntu 18.04](https://www.ubuntu.com).

Существует 2 способа установить Docker: из репозитории Ubuntu, из официального репозитория Docker'а. Расскажу про оба.

<div class="admonition info">
<p class="admonition-title">Info</p>

[Установка Docker и Docker-compose на Ubuntu 20.04](/ustanovka-docker-i-docker-compose-na-ubuntu-20-04/)

</div>

## Установка Docker из репозитория Ubuntu

Тут все просто. Вооружаемся `apt` или `apt-get` и ставим как обычное приложение:
```bash
sudo apt update
sudo apt install docker.io
```    

Запускаем службу докер и включаем автозапуск при старте системы:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```    

Проверяем, какая версия докер установилась:
```bash
docker --version
```    

На выходе видим плюс минус такую картину:
```bash
Docker version 17.12.1-ce, build 7390fc6
```    

## Установка Docker из официального репозитория

Докер доступен в 2 вариантах:

- Community Edition (CE)
- Enterprise Edition (EE)

Мы будем ставить **Docker Community Edition (CE)**.

### Перед началом

Если у вас стоит один из следующих пакетов: `docker` или `docker-engine` или `docker.io`, то их надо удалить.

*Если же докера в системе нет, то скипайте этот шаг.*
```bash
sudo apt-get -y remove docker docker-engine docker.io
```    

### Подключаем Docker репозиторий

Для начала нужно установить все необходимые зависимости:
```bash
sudo apt update
sudo apt-get install -y apt-transport-https software-properties-common ca-certificates curl wget
```    

Добавляем GPG ключ репов докера в систему:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```    

Теперь добавляем непосредственно сами репозитории. Выбираем одну из подходяших команд и выполняем ее в терминале.

*На момент написания не работали репы STABLE и EDGE, но вы попробуйте вдруг уже все заработало*
```bash
### STABLE - Ubuntu 18.04 - НЕ РАБОТАЕТ ###
echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable" | sudo tee /etc/apt/sources.list.d/docker.list

### EDGE - Ubuntu 18.04 - НЕ РАБОТАЕТ ###
echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic edge" | sudo tee /etc/apt/sources.list.d/docker.list

### NIGHTLY - Ubuntu 18.04 ###
echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic nightly" | sudo tee /etc/apt/sources.list.d/docker.list
```

Обновляем кэш репов:
```bash
sudo apt update
```    

Убедитесь, что вы устанавливаете докер из официального репозитория:
```bash
sudo apt-cache policy docker-ce
```    

На выходе:
```bash
docker-ce:
 Installed: (none)
 Candidate: 18.06.0~ce~dev~git20180504.170722.0.0e0adf0-0~ubuntu
 Version table:
 18.06.0~ce~dev~git20180504.170722.0.0e0adf0-0~ubuntu 500
 500 https://download.docker.com/linux/ubuntu bionic/nightly amd64 Packages
 18.06.0~ce~dev~git20180503.170717.0.9bc9d40-0~ubuntu 500
 500 https://download.docker.com/linux/ubuntu bionic/nightly amd64 Packages
```

### Устанавливаем Docker CE

Опять таки теперь все просто, ставим как обычную программу:
```bash
sudo apt -y install docker-ce
```    

Запускаем службу докер и включаем автозапуск при старте системы:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```    

Проверяем, какая версия докер установилась:
```bash
docker --version
```    

На выходе видим плюс миниус такую картину:
```bash
Docker version 18.06.0-ce-dev, build 0e0adf0
```    

### Проверяем работает ли Docker

Запускаем докер контейнер для проверки:
```bash
sudo docker run hello-world
```    

Видим следующее:
```bash
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
78445dd45222: Pull complete 
Digest: sha256:c5515758d4c5e1e838e9cd307f6c6a0d620b5e07e6f927b07d05f6d12a1ac8d7
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
```

Радуемся, машем руками, все работает! Если нет - RTFM.

## Устанавливаем Docker-compose

Запускаем эту команду для установки последней версии docker-compose, проверить какая версия является последней можно [тут](https://github.com/docker/compose/releases):
```bash
sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
```    

Делаем файл запускаемым:
```bash
sudo chmod +x /usr/local/bin/docker-compose
```    

При желании можно настроить [автодополнение](https://docs.docker.com/compose/completion/) команды для `bash` или `zsh`.

Проверяем, как все работает:
```bash
docker-compose --version
```    

Увидим плюс минус:
```bash
docker-compose version 1.21.2, build 1719ceb
```    

## Разрешаем не root пользователю запускать Docker

По умолчанию обычные пользователи не могут запускать докер без использования `sudo`, но все поправимо.

<div class="admonition danger">
<p class="admonition-title">Лучше не стоит</p>

Никогда так не делайте на продакшине! Это практически выдача рутовых прав пользователю

</div>

Создаем группу `docker`, если ее еще нет:
```bash
sudo groupadd docker
```

Добавляем своего пользователя в группу `docker`:
```bash
sudo usermod -aG docker username
``` 

Перелогиваемся и смело выполняем:
```bash
docker run hello-world
```    

На этом все.
