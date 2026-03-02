---
title: "Drupal Commerce и Total order"
date: 2018-12-12T08:40:00+03:00
lastmod: 2020-11-03T05:45:41+03:00
draft: false
keywords: "рукоблудие, drupal"
description: "Если вы хоть раз делали сайт на Drupal Commerce, то сталкивались с непереводимой строкой Order Total. В сети достаточно решений этой проблемы, но вот самое простое."

tags: ["drupal"]
categories: ["dev"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/drupal-commerce-i-total-order.jpg"
---

Если вы хоть раз делали сайт на Drupal Commerce, то сталкивались с непереводимой строкой Order Total. В сети достаточно решений этой проблемы, но вот самое простое. Прописываем в `template.php` следующую конструкцию:

```php
function theme_name_commerce_price_formatted_components($vars) {
  $vars['components']['commerce_price_formatted_amount']['title'] = t('Order total');
  return theme_commerce_price_formatted_components($vars);
}
```

Обновляем кэш и все работает!
