import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Poppy Flowers Team'),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    faqItems: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
    }).optional(),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
    color: z.string().optional(),
  }),
});

const playbooks = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/playbooks' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.object({
      title: z.string(),
      description: z.string(),
      timeframe: z.string().optional(),
    })),
    estimatedReadTime: z.number(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    publishedDate: z.coerce.date(),
  }),
});

const flowers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/flowers' }),
  schema: z.object({
    name: z.string(),
    scientificName: z.string().optional(),
    description: z.string(),
    seasons: z.array(z.enum(['spring', 'summer', 'fall', 'winter'])),
    colors: z.array(z.string()),
    varieties: z.array(z.object({
      name: z.string(),
      description: z.string(),
      color: z.string().optional(),
    })).optional(),
    careTips: z.array(z.string()).default([]),
    priceRange: z.object({
      min: z.number(),
      max: z.number(),
      unit: z.string().default('per stem'),
    }).optional(),
    weddingUses: z.array(z.string()).default([]),
    pviId: z.string().optional(),
  }),
});

const venues = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/venues' }),
  schema: z.object({
    name: z.string(),
    location: z.string(),
    description: z.string(),
    venueType: z.enum(['barn', 'garden', 'ballroom', 'beach', 'vineyard', 'estate', 'rooftop', 'other']),
    setting: z.string().optional(),
    style: z.string().optional(),
    bestSeasons: z.array(z.enum(['spring', 'summer', 'fall', 'winter'])).default([]),
    heroImage: z.string().optional(),
    images: z.array(z.string()).default([]),
    website: z.string().url().optional(),
    sources: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).default([]),
    capacity: z.object({
      min: z.number(),
      max: z.number(),
    }).optional(),
    logistics: z.object({
      loadInNotes: z.string().optional(),
      setupTime: z.string().optional(),
      restrictions: z.array(z.string()).default([]),
      contactInfo: z.string().optional(),
    }).optional(),
    recommendedFlowers: z.array(z.string()).default([]),
    seasonalNotes: z.string().optional(),
    faqItems: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    pviId: z.string().optional(),
  }),
});

export const collections = { articles, categories, playbooks, flowers, venues };
