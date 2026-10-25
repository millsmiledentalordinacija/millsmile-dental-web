import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const usluge=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/usluge'}),schema:z.object({title:z.string(),description:z.string(),image:z.string(),seo_title:z.string()})});
const blog=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/blog'}),schema:z.object({title:z.string(),description:z.string(),date:z.coerce.date(),image:z.string().optional(),draft:z.boolean().default(false)})});
export const collections={usluge,blog};
