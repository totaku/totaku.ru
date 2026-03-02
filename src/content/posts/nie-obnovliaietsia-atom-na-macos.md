---
title: "Не обновляется Atom на macOS? Чиним это дерьмо!"
date: 2018-01-18T07:35:16+03:00
lastmod: 2020-11-03T04:44:55+03:00
draft: false
keywords: "рукоблудие, Atom, macOS"
description: "Решаем проблему Could not create temporary directory: Permission denied при обновление Atom на macOS. "

tags: ["atom","macos"]
categories: ["Рукоблудие"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/nie-obnovliaietsia-atom-na-macos.png"
---

Запустил сегодня Atom. Смотрю горит значек обновлений. Жму кнопку, а оно на меня чуть ли не матом “The was an error checking for update. Could not create temporary directory: Permission denied”. Суть проблемы ясна, думать лень лезем в гугл и на первой же странице видим [решение](https://discuss.atom.io/t/i-am-unable-to-update-to-the-latest-version-of-atom-on-macos-how-do-i-fix-this/40054).

Для решения проблемы надо пофиксить права в одной или больше из следующих папок:

- `/Applications/Atom.app/`
- `~/Library/Caches/com.github.atom.ShipIt`
- `~/Library/Application Support/com.github.atom.ShipIt`

Делаем следующее:

1. Закрываем Atom
2. Открываем терминал
3. Если вы помните имя вашего пользователя вы красавец, если нет используем команду `whoami`
4. Выполняем: `stat -f "%Su" [directory]`
5. Если выводится имя вашего пользователя то отлично
6. Если `root`, то выполняем следующую команду: `sudo chown -R $(whoami) [directory]`

Запускаем Atom и все должно прекрасно работать.
