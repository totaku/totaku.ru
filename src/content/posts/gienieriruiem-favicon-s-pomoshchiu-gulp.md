---
title: "Генерируем favicon с помощью Gulp"
date: 2017-02-10T10:00:31+03:00
lastmod: 2020-11-03T02:49:04+03:00
draft: false
keywords: "рукоблудие, gulp, favicon"
description: "Инструкция предполагает, что вы знакомы с Gulp и у вас уже есть проект. Если не знакомы, то для начала можете почитать как создать Gulp проект."

tags: ["gulp","favicon"]
categories: ["dev"]

hiddenFromHomePage: false

toc: false
featuredImage: "./images/cover/gienieriruiem-favicon-s-pomoshchiu-gulp.png"
---

Инструкция предполагает, что вы знакомы с Gulp и у вас уже есть проект. Если не знакомы, то для начала можете почитать как создать [Gulp проект](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md).

1. Устанавливаем `gulp-real-favicon`:
```bash
    npm install gulp-real-favicon --save-dev
```

2. Вставляем код в `gulpfile.js`:
```js
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: 'TODO: Path to your master picture',
        dest: 'TODO: Path to the directory where to store the icons',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
    return gulp.src([ 'TODO: List of the HTML files where to inject favicon markups' ])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('TODO: Path to the directory where to store the HTML files'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            throw err;
        }
    });
});
```

3. В коде выше, заменяем `TODO: Path to your master picture` на путь к папке с картинкой. Например, `assets/images/master_picture.png`.
4. Заменить `TODO: Path to the directory where to store the icons` на путь к директории, где будут лежать сгенерированные иконки и сопутствующие файлы. For example, `dist/images/icons`.
5. Заменить `TODO: List of the HTML files where to inject favicon markups` на путь к директории где лежат файлы в которые надо вставить наши иконки. Пример, `['dist/*.html', 'dist/misc/*.html']`.
6. Заменить `TODO: Path to the directory where to store the HTML files` на путь до каталога с обработанными файлами. Например, `dist`.
7. Генерируем иконки:
```bash
gulp generate-favicon
```   

8. Вставляем HTML код в наши страницы:
```bash
    gulp inject-favicon-markups
```

Инструкция скорей чтоб не забыть и взята [тут](http://realfavicongenerator.net). Можно еще например использовать [Gunt](http://gruntjs.com) и [grunt-favicons](https://github.com/gleero/grunt-favicons).
