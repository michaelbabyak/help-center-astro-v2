import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const VALID_COLLECTIONS = ['articles', 'categories', 'playbooks', 'flowers', 'venues'] as const;
type CollectionName = (typeof VALID_COLLECTIONS)[number];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toFrontmatter(data: Record<string, unknown>, indent = 0): string {
  const prefix = '  '.repeat(indent);
  const lines: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${prefix}${key}: []`);
      } else if (typeof value[0] === 'object' && value[0] !== null) {
        lines.push(`${prefix}${key}:`);
        for (const item of value) {
          const entries = Object.entries(item as Record<string, unknown>);
          lines.push(`${prefix}  - ${entries[0][0]}: ${JSON.stringify(entries[0][1])}`);
          for (const [k, v] of entries.slice(1)) {
            lines.push(`${prefix}    ${k}: ${JSON.stringify(v)}`);
          }
        }
      } else {
        lines.push(`${prefix}${key}:`);
        for (const item of value) {
          lines.push(`${prefix}  - ${JSON.stringify(item)}`);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${prefix}${key}:`);
      lines.push(toFrontmatter(value as Record<string, unknown>, indent + 1));
    } else if (typeof value === 'string' && value.includes('\n')) {
      lines.push(`${prefix}${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${prefix}${key}: ${JSON.stringify(value)}`);
    }
  }

  return lines.join('\n');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { collection, slug, frontmatter, content } = body;

    if (!collection || !VALID_COLLECTIONS.includes(collection)) {
      return new Response(
        JSON.stringify({
          error: `Invalid collection. Must be one of: ${VALID_COLLECTIONS.join(', ')}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!frontmatter || typeof frontmatter !== 'object') {
      return new Response(
        JSON.stringify({ error: 'frontmatter is required and must be an object' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const fileName = slug ? slugify(slug) : slugify(
      frontmatter.title || frontmatter.name || 'untitled',
    );

    const collectionDir = join(process.cwd(), 'src', 'content', collection as CollectionName);
    await mkdir(collectionDir, { recursive: true });

    const filePath = join(collectionDir, `${fileName}.mdx`);
    const fileContent = `---\n${toFrontmatter(frontmatter)}\n---\n\n${content || ''}\n`;

    await writeFile(filePath, fileContent, 'utf-8');

    return new Response(
      JSON.stringify({
        success: true,
        path: `src/content/${collection}/${fileName}.mdx`,
        slug: fileName,
        collection,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
