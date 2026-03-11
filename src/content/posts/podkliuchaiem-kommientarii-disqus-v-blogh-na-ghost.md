---
title: "Подключаем комментарии Disqus в блог на Ghost"
date: 2016-12-28T18:50:00+03:00
draft: false
description: "Для начала нужно зарегистрировать на сайте Disqus. Там нет ничего сложного, думаю вы справитесь."
tags: ["ghost", "disqus"]
categories: ["Рукоблудие"]
toc: false
featuredImage: "./images/cover/podkliuchaiem-kommientarii-disqus-v-blogh-na-ghost.jpg"
---

Для начала нужно [зарегистрировать](http://disqus.com/register) на сайте Disqus. Там нет ничего сложного, думаю вы справитесь.

## Подключение Disqus

1. Находим файл `post.hbs` , он находится в папке `/content/themes/casper/`, если вы используете не стандартную тему то вместо папки `casper` ищите его в папке вашей темы.
2. Размещаем этот код между `{{/post}}` и `</article>`:
```js
var disqus_shortname = 'example'; // required: replace example with your forum shortname
var disqus_identifier = '{{post.id}}';
<pre><code>/* * * DON'T EDIT BELOW THIS LINE * * */
(function() {
var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();
Please enable JavaScript to view the [comments powered by Disqus.](http://disqus.com/?ref_noscript)[comments powered by Disqus](http://disqus.com)
```
3. В строке `var disqus_shortname = 'example’;`  незабудьте заменить [shortname](http://help.disqus.com/customer/portal/articles/466208-what-s-a-shortname-) на ваш.
4. Перезапускаем Ghost.

## Счетчик комментариев

1. Открываем файл `default.hbs` и размещаем перед тегом `</body>` следующий код:
```js
/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
var disqus_shortname = 'example'; // required: replace example with your forum shortname
/* * * DON'T EDIT BELOW THIS LINE * * */
(function () {
var s = document.createElement('script'); s.async = true;
s.type = 'text/javascript';
s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
(document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
}());
```
2. Заменяем `example` на ваш shortname
3. Открываем файл `index.hbs`, находим в нем `post-meta` и изменяем на это:
```hbs
{{date format="DD MMM YYYY"}} 
    {{#if tags}}on {{tags}}{{/if}} 
    [Comments]({{url}}#disqus_thread)
```
4. Перезапускаем Ghost. Если счетчик сразу не обновится, ничего страшного. Просто подождите не много.

Как это все работает можно посмотреть [тут](https://totaku.ru).
