---
title: "Установка Docker и Docker-compose на Ubuntu 20.04"
date: 2020-06-09T15:35:19+03:00
lastmod: 2020-11-03T06:42:01+03:00
draft: false
keywords: "рукоблудие, docker, docker-compose, ubuntu"
description: "В этом посте я расскажу как быстро и просто установить Docker и Docker-compose на Ubuntu 20.04"

tags: ["docker", "docker-compose", "ubuntu"]
categories: ["Рукоблудие"]

hiddenFromHomePage: false

toc: true
featuredImage: "./images/cover/ustanovka-docker-i-docker-compose-na-ubuntu-20-04.jpg"
---

Все еще нет смысла рассказывать, что такое Docker раз вы читаете это. В этом посте я расскажу как быстро и просто установить [Docker](https://www.docker.com) и [Docker-compose](https://github.com/docker/compose) на [Ubuntu 20.04](https://www.ubuntu.com).

## Установка Docker

В репозитории Ubuntu может быть не самая последняя версия Docker. По этому мы будем устанавливать его из официального репозитория Docker.

Сначала обновите существующий список пакетов:
```bash
sudo apt update
```

Затем установите несколько обязательных пакетов, которые позволяют `apt` использовать пакеты по HTTPS:
```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```    

Добавляем ключ GPG официального репозитория Docker в вашу систему:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```    

Добавляем репозиторий Docker:
```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
```    

Обновляем список пакетов:
```bash
sudo apt update
```    

Теперь надо убедится, что все нормально и установка будет из репозитория Docker, а не Ubuntu:
```bash
apt-cache policy docker-ce
```    

На выходе видим плюс минус такую картину:
```bash
docker-ce:
  Installed: (none)
  Candidate: 5:19.03.9~3-0~ubuntu-focal
  Version table:
     5:19.03.9~3-0~ubuntu-focal 500
        500 https://download.docker.com/linux/ubuntu focal/stable amd64 Packages
```    

Если все так, то прекрасно! Установится откуда надо и все будет хорошо.

Ну и финальный штрих, установим Docker:
```bash
sudo apt install docker-ce
```    

### Проверяем работает ли Docker

Для начала узнаел, что там с Docker’ом:
```bash
sudo systemctl status docker
```    

На выходе:
```bash
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2020-05-19 17:00:41 UTC; 17s ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 24321 (dockerd)
      Tasks: 8
     Memory: 46.4M
     CGroup: /system.slice/docker.service
             └─24321 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```    

Отлично! Все завелось и прекрасно работает. Давайте попробуем запустить какой нибудь контейнер:
```bash
sudo docker run hello-world
```    

Если все хорошо, то на выходе увидим:
```bash
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
0e03bdcc26d7: Pull complete
Digest: sha256:6a65f928fb91fcfbc963f7aa6d57c8eeb426ad9a20c7ee045538ef34847f44f1
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
```

### Разрешаем не root пользователю запускать Docker

По умолчанию обычные пользователи не могут запускать докер без использования `sudo`, но все поправимо.

<div class="admonition danger">
<p class="admonition-title">Лучше не стоит</p>

Никогда так не делайте на продакшине! Это практически выдача рутовых прав пользователю

</div>

Добавляем своего пользователя в группу `docker`:
```bash
sudo usermod -aG docker username
```    

Перелогиваемся и смело выполняем:
```bash
docker run hello-world
```    

## Устанавливаем Docker-compose

Запускаем эту команду для установки последней версии docker-compose, проверить какая версия является последней можно [тут](https://github.com/docker/compose/releases):
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
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
docker-compose version 1.26.0, build 8a1c60f6
```    

Собственно все. Удачи!
