import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import satori from 'satori';
import sharp from 'sharp';

const fontRegular = readFileSync(
  join(process.cwd(), 'src/assets/fonts/Manrope-Regular.ttf')
);
const fontBold = readFileSync(
  join(process.cwd(), 'src/assets/fonts/Manrope-Bold.ttf')
);

// Grab all cover images so we can resolve FS paths
const coverImages = import.meta.glob<{ default: { src: string } }>(
  '/src/content/posts/images/cover/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

// Build a map: basename (without extension) → absolute FS path
const coverPathMap: Record<string, string> = {};
for (const [vitePath] of Object.entries(coverImages)) {
  // vitePath looks like /src/content/posts/images/cover/foo.jpg
  const fsPath = join(process.cwd(), vitePath.replace(/^\//, ''));
  const basename = vitePath.replace(/.*\/([^/]+)\.[^.]+$/, '$1');
  // store by basename, prefer jpg over png if both exist (last write wins — fine)
  coverPathMap[basename] = fsPath;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => {
    // Try to find cover image by matching slug to cover filename
    const coverPath = post.data.featuredImage
      ? coverPathMap[post.id] ?? null
      : null;

    return {
      params: { slug: post.id },
      props: {
        title: post.data.title,
        category: post.data.categories?.[0] ?? '',
        coverPath,
      },
    };
  });
};

export const GET: APIRoute = async ({ props }) => {
  const { title, category, coverPath } = props as {
    title: string;
    category: string;
    coverPath: string | null;
  };

  const hasCover = !!coverPath && existsSync(coverPath);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          background: hasCover ? 'transparent' : '#0f0f0f',
          fontFamily: 'Manrope',
        },
        children: [
          // Top: site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#e8a87c',
                      flexShrink: 0,
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 400,
                      color: hasCover ? '#ddd' : '#ccc',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    },
                    children: 'totaku.ru',
                  },
                },
              ],
            },
          },
          // Middle: category + title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                flex: 1,
                justifyContent: 'center',
              },
              children: [
                ...(category
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 400,
                            color: '#e8a87c',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          },
                          children: category,
                        },
                      },
                    ]
                  : []),
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize:
                        title.length > 60 ? '42px' : title.length > 40 ? '50px' : '58px',
                      fontWeight: 700,
                      color: '#f0ece4',
                      lineHeight: 1.2,
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // Bottom: author
          {
            type: 'span',
            props: {
              style: {
                fontSize: '18px',
                fontWeight: 400,
                color: hasCover ? '#ccc' : '#aaa',
              },
              children: 'Пермяк на Неве',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Manrope', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Manrope', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  );

  const overlayBuffer = Buffer.from(svg);

  if (!hasCover) {
    const png = await sharp(overlayBuffer).png().toBuffer();
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
  }

  // Composite: cover → dark overlay → text
  const png = await sharp(coverPath)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .composite([
      {
        input: {
          create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0.72 },
          },
        },
        blend: 'over',
      },
      {
        input: overlayBuffer,
        blend: 'over',
      },
    ])
    .png()
    .toBuffer();

  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
