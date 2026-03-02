---
title: "Убийственная коллекция CSS Reset — стилей"
date: 2016-02-10T17:01:00+03:00
lastmod: 2020-10-27T02:58:59+03:00
draft: false
keywords: "рукоблудие, CSS"
description: "Использование CSS-стилей в семантической разметке (X)HTML является важным ключом к современным методам веб-дизайна. В идеальном мире каждый браузер будет интерпретировать и применять все CSS правила одинаково."

tags: ["css"]
categories: ["dev"]

hiddenFromHomePage: false

toc: true
featuredImage: "./images/cover/ubiistviennaia-kolliektsiia-css-reset-stiliei.jpg"
---

Использование CSS-стилей в семантической разметке (X)HTML является важным ключом к современным методам веб-дизайна. В идеальном мире каждый браузер будет интерпретировать и применять все CSS правила одинаково. Тем не менее, в несовершенном мире, в котором мы живем, наоборот, часто бывает так: многие стили CSS отображаются по-разному практически в каждом браузере.

Многие, если не все, крупные современные браузеры (например, Firefox, Opera, Internet Explorer, Netscape, и др.) применяют свои, обобщенные правила CSS, которые часто вступают в противоречие со стилями дизайнера. Другие браузеры не в состоянии выполнять должным образом различные CSS-правила, вносят беспорядок в страницы, которые выглядят совершенно в других браузерах. Хуже того, некоторые браузеры полностью игнорируют конкретные аспекты CSS вообще, полностью игнорируя широкое признание CSS атрибутов и свойств. 

Излишне говорить, что для браузера, в котором реализация CSS непредсказуема, требуется найти реалистичные стратегии исправления. Не опираясь на JavaScript, мы сосредоточим наши усилия по нейтрализации правил браузера полностью на CSS. С помощью соответствующим образом подобранного определенного набора CSS "перезагрузки" правил, можно переопределить стили браузера по умолчанию и эффективно нейтрализовать его действия, что позволит нам построить наши стили CSS на единой основе.

## Минималистичный Reset - версия 1

В качестве основы, как видите, это глобальный сброс для отступов и полей всех элементов страницы к нулю. Это наиболее часто используемый CSS сброс.
```css
* {
	padding: 0;
	margin: 0;
	}
```

## Минималистичный Reset - версия 2

Этот сброс идентичен предыдущему, но также учитывает все границы по умолчанию, которые эффективно нейтрализуются до нуля.
```css
* {
	padding: 0;
	margin: 0;
	border: 0;
	}
```

## Минималистичный Reset - Версия 3

Это последняя версия "минималистичного" сброса похожа на два предыдущих, но дополнительно убивает стили по умолчанию для внешних границ элементов.
```css
* {
	outline: 0;
	padding: 0;
	margin: 0;
	border: 0;
	}
```

## Сокращенный Универсальный сброс

Обрабатывает все необходимое, а также обеспечивает относительную универсальность браузерам в плане единообразия.
```css
* {
	vertical-align: baseline;
	font-weight: inherit;
	font-family: inherit;
	font-style: inherit;
	font-size: 100%;
	border: 0 none;
	outline: 0;
	padding: 0;
	margin: 0;
	}
```    

## Еще один сброс (набор reset-стилей)

Данный набор стилей CSS сбрасывает отступы и поля только для HTML и элементов body; гарантирует, что все размеры шрифтов сбрасываются, и устраняет границы у картинок в ссылках.
```css
html, body {
	padding: 0;
	margin: 0;
	}
html {
	font-size: 1em;
	}
body {
	font-size: 100%;
	}
a img, :link img, :visited img {
	border: 0;
	}
```

## Siolon's Global Reset

Chris Poteet вместе с "сотоварищи" создали этот замечательный метод для сброса [стилей браузера по умолчанию](http://www.siolon.com/blog/browser-reset-css/). Крис рекомендует помещать стили сброса в верхней части таблицы стилей для достижения оптимальных результатов каскадирования.

Этот метод не включает сброс стилей для inline-элементов и block display. Кроме того, помните, что нужно явно указывать поля и отступы для стилей после осуществления сброса. Обратите внимание на уникальный `margin-left 40px;` заявление для списков и цитат, и `margin 20px 0;` для заголовков, форм и других элементов.
```css
* {  
	vertical-align: baseline;  
	font-family: inherit;  
	font-style: inherit;  
	font-size: 100%;  
	border: none;  
	padding: 0;  
	margin: 0;  
	}  
body {  
	padding: 5px;  
	}  
h1, h2, h3, h4, h5, h6, p, pre, blockquote, form, ul, ol, dl {  
	margin: 20px 0;  
	}  
li, dd, blockquote {  
	margin-left: 40px;  
	}  
table {  
	border-collapse: collapse;  
	border-spacing: 0;  
	}
```

## Shaun Inman's Global Reset

Хотя нет уверенности, что Шон на самом деле написал эту подборку CSS правил (хотя, скорее всего, это он сделал), он использует этот сброс CSS для своего [Helvetica/монохромного сайта](http://perishablepress.com/press/2008/02/27/minimalist-web-design-showcase-shauninmancom/). Это довольно жесткий CSS, представляющий набор правил для сброса многих критических стилей браузеров, устанавливаемых по умолчанию.
```css
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, 
form, fieldset, input, p, blockquote, table, th, td, embed, object {
	padding: 0;
	margin: 0; 
	}
table {
	border-collapse: collapse;
	border-spacing: 0;
	}
fieldset, img, abbr {
	border: 0;
	}
address, caption, cite, code, dfn, em, 
h1, h2, h3, h4, h5, h6, strong, th, var {
	font-weight: normal;
	font-style: normal;
	}
ul {
	list-style: none;
	}
caption, th {
	text-align: left;
	}
h1, h2, h3, h4, h5, h6 {
	font-size: 1.0em;
	}
q:before, q:after {
	content: '';
	}
a, ins {
	text-decoration: none;
	}
```

## Yahoo CSS Reset

Люди в Yahoo! также разработали свои собственные стили сброса для браузеров. Как и в других стилях сброса [Yahoo! Reset CSS](http://developer.yahoo.com/yui/reset/) устраняет применяемые по умолчанию стили браузеров для многих ключевых (X)HTML элементов.
```css
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,p,blockquote,th,td { 
	padding: 0;
	margin: 0;
	}
table {
	border-collapse: collapse;
	border-spacing: 0;
	}
fieldset,img { 
	border: 0;
	}
address,caption,cite,code,dfn,em,strong,th,var {
	font-weight: normal;
	font-style: normal;
	}
ol,ul {
	list-style: none;
	}
caption,th {
	text-align: left;
	}
h1,h2,h3,h4,h5,h6 {
	font-weight: normal;
	font-size: 100%;
	}
q:before,q:after {
	content:'';
	}
abbr,acronym { border: 0;
	}
```

## Eric Meyer's CSS Reset

Как уже говорилось в [оригинальной статье](http://meyerweb.com/eric/thoughts/2007/04/18/reset-reasoning/) CSS гуру Эрика Мейера, это универсальный набор для [сброса стилей](http://meyerweb.com/eric/thoughts/2007/05/01/reset-reloaded/). Это мощная вещь, эффективно нейтрализующая практически каждый важный аспект применяемых по умолчанию CSS правил браузера.

Этот сброс правил имеет далеко идущие последствия, сбрасывает различные свойства CSS. Имейте это в виду при дальнейшем редактировании CSS. Если у вас возникли неожиданные, необъяснимые последствия для ваших стилей, ищите и удаляйте подозрительные аспекты этого кода (или любого добавленного сброса стилей) как возможного виновника.
```css
html, body, div, span, applet, object, iframe, table, caption, tbody, tfoot, thead, tr, th, td, 
del, dfn, em, font, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, 
h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, 
dl, dt, dd, ol, ul, li, fieldset, form, label, legend {
	vertical-align: baseline;
	font-family: inherit;
	font-weight: inherit;
	font-style: inherit;
	font-size: 100%;
	outline: 0;
	padding: 0;
	margin: 0;
	border: 0;
	}
/* remember to define focus styles! */
:focus {
	outline: 0;
	}
body {
	background: white;
	line-height: 1;
	color: black;
	}
ol, ul {
	list-style: none;
	}
/* tables still need cellspacing="0" in the markup */
table {
	border-collapse: separate;
	border-spacing: 0;
	}
caption, th, td {
	font-weight: normal;
	text-align: left;
	}
/* remove possible quote marks (") from <q> & <blockquote> */
blockquote:before, blockquote:after, q:before, q:after {
	content: "";
	}
blockquote, q {
	quotes: "" "";
	}
```

## Сокращенный Meyer Reset

Хотя я не уверен в конкретном источнике этого сброса CSS, похоже, что он представляет собой сжатую, слегка модифицированную версию сброса Мейера. Обратите внимание на повторяющиеся объявления для атрибутов заголовков (например, h1 - h6 ).
```css
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, 
pre, form, fieldset, input, textarea, p, blockquote, th, td { 
	padding: 0;
	margin: 0;
	}
fieldset, img { 
	border: 0;
	}
table {
	border-collapse: collapse;
	border-spacing: 0;
	}
ol, ul {
	list-style: none;
	}
address, caption, cite, code, dfn, em, strong, th, var {
	font-weight: normal;
	font-style: normal;
	}
caption, th {
	text-align: left;
	}
h1, h2, h3, h4, h5, h6 {
	font-weight: normal;
	font-size: 100%;
	}
q:before, q:after {
	content: '';
	}
abbr, acronym { 
	border: 0;
	}
```

## Tantek's CSS Reset

Названный "[undohtml.css](http://tantek.com/log/2004/undohtml.css)", CSS Reset Tantek является хорошим выбором для удаления многих самых навязчивых стилей браузера по умолчанию. Этот сброс удаляет подчеркивание у ссылок и границы для связанных изображений, устраняет отступы и поля для наиболее распространенных элементов уровня блока, а также устанавливает размер шрифта `1em` для заголовков, программного кода и абзацев. В качестве дополнительного бонуса, сброс Tantek также "de-italicizes" печально известный элемент `address`!

Версия с комментариями.
```css
/* undohtml.css */
/* (CC) 2004 Tantek Celik. Some Rights Reserved.                  */
/* http://creativecommons.org/licenses/by/2.0                     */
/* This style sheet is licensed under a Creative Commons License. */
/* Purpose: undo some of the default styling of common (X)HTML browsers */

/* link underlines tend to make hypertext less readable, 
   because underlines obscure the shapes of the lower halves of words */
:link,:visited { text-decoration:none }

/* no list-markers by default, since lists are used more often for semantics */
ul,ol { list-style:none }

/* avoid browser default inconsistent heading font-sizes */
/* and pre/code too */
h1,h2,h3,h4,h5,h6,pre,code { font-size:1em; }

/* remove the inconsistent (among browsers) default ul,ol padding or margin  */
/* the default spacing on headings does not match nor align with 
   normal interline spacing at all, so let's get rid of it. */
/* zero out the spacing around pre, form, body, html, p, blockquote as well */
/* form elements are oddly inconsistent, and not quite CSS emulatable. */
/*  nonetheless strip their margin and padding as well */
ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,body,html,p,blockquote,fieldset,input
{ margin:0; padding:0 }

/* whoever thought blue linked image borders were a good idea? */
a img,:link img,:visited img { border:none }

/* de-italicize address */
address { font-style:normal }

/* more varnish stripping as necessary... */
```
    
Версия, в которой комментарии удалены 
    
```css
/* undohtml.css */
/* (CC) 2004 Tantek Celik. Some Rights Reserved.                  */
/* http://creativecommons.org/licenses/by/2.0                     */
/* This style sheet is licensed under a Creative Commons License. */

:link, :visited {
	text-decoration: none;
	}
ul, ol {
	list-style: none;
	}
h1, h2, h3, h4, h5, h6, pre, code, p {
	font-size: 1em;
	}
ul, ol, dl, li, dt, dd, h1, h2, h3, h4, h5, h6, pre, 
form, body, html, p, blockquote, fieldset, input {
	padding: 0;
	margin: 0;
	}
a img, :link img, :visited img {
	border: none;
	}
address {
	font-style: normal;
	}
```

## The Tripoli Reset

Сброс Триполи от David Hellsing содержит полный стандарт CSS для (X)HTML-отображения. Сброс Триполи "является стабильныой, кросс-браузерной основой для веб-проектов." После сброса CSS стилей, Триполи generic.css правила могут быть использованы для "восстановления" содержимого типографики в браузере. Некоторые из наиболее характерных особенностей сброса включают в себя:

- пробелы в коде всех тегов
- отключение `<hr>` элемента
- весь текст сбросить так, что `1em` равен `10px`
- целевое отключение устаревших элементов: `<marquee>`, `<blink>` и `<nobr>`
- включение устаревших элементов: `<listing>`, `<xmp>` и `<plaintext>`
- отключение тегов `<font>` и других устаревших элементов
- ..и многое другое!

Это версия Дэвида как есть с комментариями.
```css
/*
    Tripoli is a generic CSS standard for HTML rendering. 
    Copyright (C) 2007  David Hellsing

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

* { margin: 0; padding: 0; text-decoration: none; font-size: 1em; outline: none; }
code, kbd, samp, pre, tt, var, textarea, input, select, isindex, listing, xmp, plaintext { font: inherit; font-size: 1em; white-space: normal; }
dfn, i, cite, var, address, em { font-style: normal; }
th, b, strong, h1, h2, h3, h4, h5, h6 { font-weight: normal; }
a, img, a img, iframe, form, fieldset, abbr, acronym, object, applet, table { border: none; }
table { border-collapse: collapse; border-spacing: 0; }
caption, th, td, center { text-align: left; vertical-align: top; }
body { line-height: 1; background: white; color: black; }
q { quotes: "" ""; }
ul, ol, dir, menu { list-style: none; }
sub, sup { vertical-align: baseline; }
a { color: inherit; }
hr { display: none; } /* we don't need a visual hr in layout */
font { color: inherit !important; font: inherit !important; color: inherit !important; } /* disables some nasty font attributes in standard browsers*/
marquee { overflow: inherit !important; -moz-binding: none; }
blink { text-decoration: none; }
nobr { white-space: normal; }

/*

CHANGELOG

23/8-07

Added deprecated tags <listing>, <xmp> and <plaintext> in the code block

Resorted to normal white-space in all code tags

Disabled the deprecated <marquee>, <blink> and <nobr> tag in some browsers

*/
```  

Это версия без комментариев.
```css
/*
    Tripoli is a generic CSS standard for HTML rendering. 
    Copyright (C) 2007  David Hellsing

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

* {
	text-decoration: none;
	font-size: 1em;
	outline: none;
	padding: 0;
	margin: 0;
	}
code, kbd, samp, pre, tt, var, textarea, 
input, select, isindex, listing, xmp, plaintext {
	white-space: normal;
	font-size: 1em;
	font: inherit;
	}
dfn, i, cite, var, address, em { 
	font-style: normal; 
	}
th, b, strong, h1, h2, h3, h4, h5, h6 { 
	font-weight: normal; 
	}
a, img, a img, iframe, form, fieldset, 
abbr, acronym, object, applet, table {
	border: none; 
	}
table {
	border-collapse: collapse;
	border-spacing: 0;
	}
caption, th, td, center { 
	vertical-align: top;
	text-align: left;
	}
body { 
	background: white; 
	line-height: 1; 
	color: black; 
	}
q { 
	quotes: "" ""; 
	}
ul, ol, dir, menu { 
	list-style: none; 
	}
sub, sup { 
	vertical-align: baseline; 
	}
a { 
	color: inherit; 
	}
hr { 
	display: none; 
	}
font { 
	color: inherit !important; 
	font: inherit !important; 
	color: inherit !important; /* editor's note: necessary? */ 
	}
marquee {
	overflow: inherit !important;
	-moz-binding: none;
	}
blink { 
	text-decoration: none; 
	}
nobr { 
	white-space: normal; 
	}
```