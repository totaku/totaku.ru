---
title: "Отключение прокрутки на Google картах"
date: 2016-08-31T17:53:00+03:00
lastmod: 2020-10-27T03:36:32+03:00
draft: false
keywords: "Google, карты"
description: "Скорее всего каждый из нас хоть один раз вставлял Google карты на свои страницы. Тогда вы не могли не столкнуться с проблемой: во время прокрутки страницы, если курсор попадал на карту Google, то вместо смещения страницы, начинала масштабироваться карта."

tags: ["google","maps"]
categories: ["Рукоблудие"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/otkliuchieniie-prokrutki-na-google-kartakh.png"
---

Скорее всего каждый из нас хоть один раз вставлял Google карты на свои страницы. Тогда вы не могли не столкнуться с проблемой: во время прокрутки страницы, если курсор попадал на карту Google, то вместо смещения страницы, начинала масштабироваться карта. Мы ответим на вопрос о том, как отключить прокрутку в Google картах.

В Google Maps API версии 3, вы можете задать значение `false` опции `scrollwheel`:
```js
options = $.extend({
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
}, options);
``` 

Если по какой-то причине вы всё ещё пользуетесь версией 2, то можете вызвать метод `disableScrollWheelZoom()`:
```js
map.disableScrollWheelZoom();
```

По умолчанию масштабирование карты включено в 3 версии API.

[Источник](http://ruseller.com/lessons.php?rub=32&amp;id=2787)