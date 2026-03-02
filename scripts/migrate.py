#!/usr/bin/env python3
"""
Скрипт миграции постов Hugo → Astro.

Что делает:
  1. Копирует featured-image → src/content/posts/images/cover/{slug}.{ext}
  2. Копирует img/* → src/content/posts/images/content/
  3. Трансформирует frontmatter (удаляет Hugo-специфичные поля, добавляет featuredImage)
  4. Заменяет Hugo шорткоды:
     - {{< figure >}}   → ![alt](./images/content/...)  или внешний URL
     - {{< admonition >}} → <div> или <details>
     - {{< youtube >}}  → <YouTube id="..." /> (только в .mdx)
     - {{< pen >}}      → <CodePen id="..." /> (только в .mdx)
  5. Посты с youtube/pen шорткодами сохраняются как .mdx с импортами
"""

import os
import re
import shutil
import sys
from pathlib import Path

# Пути
REPO_ROOT = Path(__file__).parent.parent
OLD_POSTS = REPO_ROOT / "old" / "content" / "posts"
NEW_POSTS = REPO_ROOT / "src" / "content" / "posts"
NEW_COVER = NEW_POSTS / "images" / "cover"
NEW_CONTENT = NEW_POSTS / "images" / "content"

# Поля frontmatter которые удаляем
REMOVE_FIELDS = {"subtitle", "author", "authorLink", "resources", "lightgallery",
                 "hiddenFromSearch"}

# Счётчики для отчёта
stats = {"total": 0, "md": 0, "mdx": 0, "cover_copied": 0,
         "img_copied": 0, "no_cover": 0, "errors": []}


def ensure_dirs():
    NEW_COVER.mkdir(parents=True, exist_ok=True)
    NEW_CONTENT.mkdir(parents=True, exist_ok=True)


def find_cover(post_dir: Path) -> Path | None:
    for ext in ("jpg", "jpeg", "png", "gif", "webp"):
        p = post_dir / f"featured-image.{ext}"
        if p.exists():
            return p
    return None


def copy_cover(post_dir: Path, slug: str) -> str | None:
    """Копирует cover, возвращает относительный путь для frontmatter."""
    src = find_cover(post_dir)
    if not src:
        return None
    ext = src.suffix  # .jpg / .png / ...
    dst = NEW_COVER / f"{slug}{ext}"
    shutil.copy2(src, dst)
    stats["cover_copied"] += 1
    return f"./images/cover/{slug}{ext}"


def copy_img_dir(post_dir: Path) -> dict[str, str]:
    """
    Копирует все файлы из img/ в images/content/.
    Возвращает маппинг старое_имя → новый_путь_относительный.
    """
    mapping: dict[str, str] = {}
    img_dir = post_dir / "img"
    if not img_dir.exists():
        return mapping
    for f in img_dir.iterdir():
        if f.is_file():
            dst = NEW_CONTENT / f.name
            shutil.copy2(f, dst)
            mapping[f.name] = f"./images/content/{f.name}"
            stats["img_copied"] += 1
    return mapping


# ── Frontmatter ──────────────────────────────────────────────────────────────

def parse_frontmatter(text: str) -> tuple[str, str]:
    """Разделяет текст на (frontmatter_block, body). frontmatter без ---."""
    m = re.match(r"^---\n(.*?)\n---\n?(.*)", text, re.DOTALL)
    if not m:
        return "", text
    return m.group(1), m.group(2)


def transform_frontmatter(fm: str, slug: str, cover_path: str | None) -> str:
    lines = fm.split("\n")
    result = []
    skip_block = False  # для многострочных блоков типа resources/toc

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Пропускаем блок resources: (многострочный)
        if re.match(r"^resources:", stripped):
            skip_block = True
            i += 1
            continue

        # Пропускаем блок toc: и заменяем на простое toc: true/false
        if re.match(r"^toc:", stripped):
            # Смотрим следующие строки чтобы понять enable
            toc_enable = False
            j = i + 1
            while j < len(lines) and lines[j].startswith(" "):
                if re.search(r"enable:\s*true", lines[j]):
                    toc_enable = True
                j += 1
            result.append(f"toc: {'true' if toc_enable else 'false'}")
            i = j
            continue

        # Конец пропускаемого блока (следующий ключ верхнего уровня без отступа)
        if skip_block:
            if re.match(r"^\w", line) or stripped == "":
                skip_block = False
            else:
                i += 1
                continue

        # Удаляемые поля
        field_match = re.match(r"^(\w+):", stripped)
        if field_match and field_match.group(1) in REMOVE_FIELDS:
            i += 1
            continue

        result.append(line)
        i += 1

    # Добавляем featuredImage если есть cover
    if cover_path:
        result.append(f'featuredImage: "{cover_path}"')

    # Убираем повторные пустые строки
    cleaned = []
    prev_empty = False
    for line in result:
        if line.strip() == "":
            if not prev_empty:
                cleaned.append(line)
            prev_empty = True
        else:
            cleaned.append(line)
            prev_empty = False

    return "\n".join(cleaned)


# ── Shortcodes ────────────────────────────────────────────────────────────────

def replace_md_images(body: str, img_mapping: dict[str, str]) -> str:
    """![alt](img/foo.png "title") → ![alt](./images/content/foo.png "title")"""
    def replacer(m: re.Match) -> str:
        alt = m.group(1)
        src = m.group(2)
        title = m.group(3) or ''
        fname = Path(src).name
        new_path = img_mapping.get(fname, f'./images/content/{fname}')
        if title:
            return f'![{alt}]({new_path} {title})'
        return f'![{alt}]({new_path})'

    return re.sub(r'!\[([^\]]*)\]\(img/([^)\s]+)(\s+"[^"]*")?\)', replacer, body)


def replace_figure(body: str, img_mapping: dict[str, str]) -> str:
    """{{< figure src="img/foo.png" title="" alt="bar" >}} → ![bar](path)"""
    def replacer(m: re.Match) -> str:
        attrs = m.group(1)

        src_m = re.search(r'src="([^"]+)"', attrs)
        alt_m = re.search(r'alt="([^"]*)"', attrs)
        title_m = re.search(r'title="([^"]*)"', attrs)

        src = src_m.group(1) if src_m else ""
        alt = alt_m.group(1) if alt_m else (title_m.group(1) if title_m else "")

        # Внешний URL — оставляем как есть
        if src.startswith("http://") or src.startswith("https://"):
            return f"![]({src})"

        # Локальный файл — берём только имя файла
        fname = Path(src).name
        new_path = img_mapping.get(fname, f"./images/content/{fname}")
        return f"![{alt}]({new_path})"

    return re.sub(r'\{\{<\s*figure\s+(.*?)\s*>\}\}', replacer, body)


def replace_admonition(body: str) -> str:
    """
    {{< admonition type "title" >}}...{{< /admonition >}}
    {{< admonition type "title" false >}}...{{< /admonition >}}  → <details>
    {{< admonition type >}}...{{< /admonition >}}  → без заголовка
    """
    def replacer(m: re.Match) -> str:
        params = m.group(1).strip()
        content = m.group(2).strip()

        # Парсим: type ["title"] [false]
        # Примеры: danger "Спойлер" false  |  tip "Совет"  |  info  |  tip
        # Захватываем либо строку в кавычках, либо слово без кавычек
        parts = re.findall(r'"([^"]+)"|(\S+)', params)
        parts = [a or b for a, b in parts]  # берём непустую группу
        adm_type = parts[0] if parts else "note"
        collapsed = parts[-1] == "false" if parts else False
        # Заголовок — второй элемент если он не булев флаг
        if len(parts) >= 2 and parts[1] not in ("true", "false"):
            title = parts[1]
        else:
            title = adm_type.capitalize()

        if collapsed:
            return f'<details class="admonition {adm_type}">\n<summary>{title}</summary>\n\n{content}\n\n</details>'
        else:
            return f'<div class="admonition {adm_type}">\n<p class="admonition-title">{title}</p>\n\n{content}\n\n</div>'

    return re.sub(
        r'\{\{<\s*admonition\s+(.*?)\s*>\}\}(.*?)\{\{<\s*/admonition\s*>\}\}',
        replacer,
        body,
        flags=re.DOTALL,
    )


def has_embed_shortcodes(body: str) -> bool:
    return bool(re.search(r'\{\{<\s*(youtube|pen)\s', body))


def replace_youtube(body: str) -> str:
    """{{< youtube ID >}} → <YouTube id="ID" />"""
    return re.sub(
        r'\{\{<\s*youtube\s+(\S+)\s*>\}\}',
        lambda m: f'<YouTube id="{m.group(1)}" />',
        body,
    )


def replace_pen(body: str) -> str:
    """{{< pen id="ID" >}} → <CodePen id="ID" />"""
    return re.sub(
        r'\{\{<\s*pen\s+id="([^"]+)"\s*>\}\}',
        lambda m: f'<CodePen id="{m.group(1)}" />',
        body,
    )


MDX_IMPORTS = (
    'import { YouTube } from \'astro-embed\';\n'
    'import CodePen from \'@/components/CodePen.astro\';\n'
)


# ── Основная функция ──────────────────────────────────────────────────────────

def migrate_post(post_dir: Path):
    slug = post_dir.name
    index_file = post_dir / "index.md"
    if not index_file.exists():
        return

    stats["total"] += 1
    text = index_file.read_text(encoding="utf-8")

    fm_raw, body = parse_frontmatter(text)
    if not fm_raw:
        stats["errors"].append(f"{slug}: не удалось распарсить frontmatter")
        return

    # 1. Копируем изображения
    cover_path = copy_cover(post_dir, slug)
    if not cover_path:
        stats["no_cover"] += 1

    img_mapping = copy_img_dir(post_dir)

    # 2. Трансформируем frontmatter
    fm_new = transform_frontmatter(fm_raw, slug, cover_path)

    # 3. Заменяем шорткоды
    body = body.replace('<!--more-->', '')
    body = replace_md_images(body, img_mapping)
    body = replace_figure(body, img_mapping)
    body = replace_admonition(body)

    is_mdx = has_embed_shortcodes(body)
    if is_mdx:
        body = replace_youtube(body)
        body = replace_pen(body)

    # 4. Собираем итоговый текст
    if is_mdx:
        output = f"---\n{fm_new}\n---\n\n{MDX_IMPORTS}\n{body.lstrip()}"
        ext = ".mdx"
        stats["mdx"] += 1
    else:
        output = f"---\n{fm_new}\n---\n{body}"
        ext = ".md"
        stats["md"] += 1

    dst = NEW_POSTS / f"{slug}{ext}"
    dst.write_text(output, encoding="utf-8")


def print_report():
    print("\n── Миграция завершена ──────────────────────────────")
    print(f"  Постов обработано : {stats['total']}")
    print(f"  .md файлов        : {stats['md']}")
    print(f"  .mdx файлов       : {stats['mdx']}")
    print(f"  Cover скопировано : {stats['cover_copied']}")
    print(f"  Без cover         : {stats['no_cover']}")
    print(f"  Inline картинок   : {stats['img_copied']}")
    if stats["errors"]:
        print(f"\n  Ошибки ({len(stats['errors'])}):")
        for e in stats["errors"]:
            print(f"    ✗ {e}")
    else:
        print("  Ошибок нет ✓")
    print("────────────────────────────────────────────────────\n")


def main():
    if not OLD_POSTS.exists():
        print(f"Ошибка: папка {OLD_POSTS} не найдена")
        sys.exit(1)

    ensure_dirs()

    post_dirs = sorted(p for p in OLD_POSTS.iterdir() if p.is_dir())
    for post_dir in post_dirs:
        try:
            migrate_post(post_dir)
        except Exception as e:
            stats["errors"].append(f"{post_dir.name}: {e}")

    print_report()


if __name__ == "__main__":
    main()
