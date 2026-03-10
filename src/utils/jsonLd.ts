import type { CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'posts'>;

export function generateWebSiteSchema(siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Totaku',
        description: 'Личный блог. Пишу про IT, игры, сериалы, аниме и места.',
        url: siteUrl,
        publisher: {
            '@type': 'Person',
            name: 'Totaku',
            url: siteUrl,
        },
        inLanguage: 'ru-RU',
    };
}

export function generateArticleSchema(
    post: PostEntry,
    siteUrl: string,
    currentUrl: string
) {
    const imageUrl = post.data.featuredImage
        ? `${siteUrl}${(post.data.featuredImage as { src: string }).src}`
        : `${siteUrl}/favicon.ico`;

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.data.title,
        description: post.data.description,
        image: imageUrl,
        datePublished: post.data.date.toISOString(),
        dateModified: post.data.date.toISOString(),
        author: {
            '@type': 'Person',
            name: 'Totaku',
            url: siteUrl,
        },
        url: currentUrl,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': currentUrl,
        },
        keywords: post.data.tags?.join(', ') ?? '',
        inLanguage: 'ru-RU',
    };
}

export function generateBreadcrumbSchema(
    items: Array<{ name: string; url: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function serializeJsonLd(
    schema: Record<string, unknown> | Array<Record<string, unknown>>
): string {
    return JSON.stringify(schema, null, 0);
}
