import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    const posts = await getCollection('posts', ({ data }) => !data.draft);
    posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

    return rss({
        title: 'Пермяк на Неве',
        description: 'Пишу про разное в том числе и про АйТи',
        site: context.site!,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.description,
            link: `/${post.id}/`,
        })),
        customData: `<language>ru</language>`,
        stylesheet: false,
    });
}
