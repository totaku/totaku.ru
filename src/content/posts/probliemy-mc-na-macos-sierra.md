---
title: "Проблемы mc на macOS Sierra"
date: 2017-11-14T07:03:33+03:00
draft: false
description: "Проблема старая, а решил только что. С переездом на macOS Sierra у меня перестал запускаться Midnight Commander под рутом."

tags: ["macos", "mc", "terminal", "macOS", "bash", "shell", "рукоблудие"]
categories: ["Рукоблудие"]


toc: false
featuredImage: "./images/cover/probliemy-mc-na-macos-sierra.png"
---

Проблема старая, а решил только что. С переездом на macOS Sierra у меня перестал запускаться Midnight Commander под рутом. Команда `sudo mc` выдавала вот такую ошибку:

```bash
common.c: unimplemented subshell type 1
read (subshell_pty...): No such file or directory (2)
```    

Решение было найдено [тут](http://blog.dh.md/2016/09/mc-macos-sierra.html). Проверяем шел рута:
```bash
dscl . -read /Users/root UserShell
```    

Скорей всего увидим `/bin/sh`. Меняем это все на bash и проверяем:
```bash
sudo dscl . -change /Users/root UserShell /bin/sh /bin/bash
dscl . -read /Users/root UserShell
```    

Видим, что все сменилось на `/bin/bash`. Проблема решена, спасибо за внимание ^_~
