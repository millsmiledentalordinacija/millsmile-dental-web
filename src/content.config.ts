import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const usluge=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/usluge'}),schema:z.object({title:z.string(),description:z.string(),image:z.string(),seo_title:z.string()})});
const blog=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/blog'}),schema:z.object({title:z.string(),description:z.string(),date:z.coerce.date(),image:z.string().optional(),draft:z.boolean().default(false)})});
// Prijevodi usluga: src/content/usluge-i18n/<jezik>/<usluga>.md
const usluge_i18n=defineCollection({loader:glob({pattern:'*/*.md',base:'./src/content/usluge-i18n'}),schema:z.object({title:z.string(),description:z.string(),seo_title:z.string(),faq_eyebrow:z.string().optional(),faq_title:z.string().optional(),faq_intro:z.string().optional(),faq:z.array(z.object({q:z.string(),a:z.string()})).optional()})});
export const collections={usluge,blog,usluge_i18n};
