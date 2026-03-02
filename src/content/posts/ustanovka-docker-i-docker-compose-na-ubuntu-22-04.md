---
title: "Установка Docker и Docker-compose на Ubuntu 22.04"
date: 2022-05-30T15:35:19+03:00
lastmod: 2022-05-31T06:42:01+03:00
draft: false
keywords: "рукоблудие, docker, docker-compose, ubuntu"
description: "В этом посте я расскажу как быстро и просто установить Docker и Docker-compose на Ubuntu 22.04"

tags: ["docker", "docker-compose", "ubuntu"]
categories: ["Рукоблудие"]

hiddenFromHomePage: false

toc: true
featuredImage: "./images/cover/ustanovka-docker-i-docker-compose-na-ubuntu-22-04.jpg"
---

Совершенно в этот раз завтыкал и пропустил момент, но традиции нарушать нельзя. Все еще нет смысла рассказывать, что такое Docker раз вы читаете это. В этом посте я расскажу как быстро и просто установить [Docker](https://www.docker.com) и [Docker-compose](https://github.com/docker/compose) на [Ubuntu 22.04](https://www.ubuntu.com).

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
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```    

Добавляем репозиторий Docker:
```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
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
  Candidate: 5:20.10.14~3-0~ubuntu-jammy
  Version table:
     5:20.10.14~3-0~ubuntu-jammy 500
        500 https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages
     5:20.10.13~3-0~ubuntu-jammy 500
        500 https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages
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
     Active: active (running) since Fri 2022-04-01 21:30:25 UTC; 22s ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 7854 (dockerd)
      Tasks: 7
     Memory: 38.3M
        CPU: 340ms
     CGroup: /system.slice/docker.service
             └─7854 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```    

Отлично! Все завелось и прекрасно работает. Давайте попробуем запустить какой нибудь контейнер:
```bash
sudo docker run hello-world
```    

Если все хорошо, то на выходе увидим:
```bash
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete
Digest: sha256:bfea6278a0a267fad2634554f4f0c6f31981eea41c553fdf5a83e95a41d40c38
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

...
```

### Разрешаем не root пользователю запускать Docker

По умолчанию обычные пользователи не могут запускать докер без использования `sudo`, но все поправимо.

<div class="admonition danger">
<p class="admonition-title">Лучше не стоит</p>

Никогда так не делайте на продакшине! Это практически выдача рутовых прав пользователю

</div>

Добавляем своего пользователя в группу `docker`:
```bash
sudo usermod -aG docker ${USER}
```    

Перелогиваемся и смело выполняем:
```bash
docker run hello-world
```    

## Устанавливаем Docker-compose

Запускаем эту команду для установки последней версии docker-compose, проверить какая версия является последней можно [тут](https://github.com/docker/compose/releases):
```bash
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.14.2/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
```    

Делаем файл запускаемым:
```bash
chmod +x ~/.docker/cli-plugins/docker-compose
```    

При желании можно настроить [автодополнение](https://docs.docker.com/compose/completion/) команды для `bash` или `zsh`.

Проверяем, как все работает:
```bash
docker compose version
```    

Увидим плюс минус:
```bash
Docker Compose version v2.14.2
```    

Собственно все. Удачи!
