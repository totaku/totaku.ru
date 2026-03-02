---
title: "Установка Oh My ZSH в Ubuntu"
date: 2016-08-17T17:46:00+03:00
lastmod: 2020-10-27T03:32:23+03:00
draft: false
keywords: "рукоблудие, линукс, ubuntu, zsh, консоль"
description: "Oh My ZSH! — это фреймворк с открытым исходным кодом, предназначенный для управления конфигурацией оболочки ZSH."

tags: ["linux","zsh","terminal"]
categories: ["dev"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/ustanovka-oh-my-zsh-v-ubuntu.jpg"
---

Oh My ZSH! — это фреймворк с открытым исходным кодом, предназначенный для управления конфигурацией оболочки ZSH.

<div class="admonition info">
<p class="admonition-title">Info</p>

Z shell, zsh — одна из современных командных оболочек UNIX, может использоваться как интерактивная оболочка, либо как мощный скриптовой интерпретатор. Zsh является расширенным bourne shell с большим количеством улучшений.

</div>

Для начала нам потребуется установить ZSH (в Ubuntu он не установлен, а вот в macOS этот шаг можно пропустить), выполняем следующие команды:
```bash
sudo apt-get update
sudo apt-get install zsh
```

Теперь установим сам [Oh My ZSH](http://ohmyz.sh/). Тут все еще проще, существуют 2 пути установки. Первый путь использую `curl`:
```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

Если curl не установлен, воспользуйтесь вторым способом через `wget`:
```bash
sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```   

После этого собственно все, вы увидите Oh My ZSH. Для закрепление материал нужно перезагрузить терминал и все чудо случилось. Основные настройки находятся в файле `.zshrc` который лежит в корне вашей домашней директории.

### Полезные ссылочки:

1. [Официальный сайт Oh My ZSH!](http://ohmyz.sh/)
2. [Темы](http://zshthem.es/all/)
3. [Плагины](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins)
4. [Z-Shell Wiki](http://zshwiki.org/home/)
5. [An Introduction to the Z-Shell](http://zsh.sourceforge.net/Intro/intro_toc.html)
6. [Zsh: лучший в мире шелл](http://fossbook.info/subproj/shell/1102)
7. [Делаем из zsh мороженку](http://dobroserver.ru/delaem-iz-zsh-morozhenku)
