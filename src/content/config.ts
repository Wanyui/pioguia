import { defineCollection, z } from "astro:content";

const localizedString = z.object({
  es: z.string(),
  ca: z.string().optional(),
  en: z.string().optional(),
  fr: z.string().optional(),
  ru: z.string().optional(),
});

const localizedStringArray = z.object({
  es: z.array(z.string()),
  ca: z.array(z.string()).optional(),
  en: z.array(z.string()).optional(),
  fr: z.array(z.string()).optional(),
  ru: z.array(z.string()).optional(),
});

const benefitSchema = z.object({
  id: z.string(),
  title: localizedString,
  description: localizedString,
  tags: localizedStringArray,
  category: localizedString.optional(),
  address: z.string(),
  city: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logo: z.string().optional(),
  web: z.string().url().optional(),
  googleMapsUrl: z.string().url().optional(),
  languages: z.array(z.string()).default(["es"]),
});

const benefits = defineCollection({
  type: "content",
  schema: benefitSchema,
});

const benefitsArchived = defineCollection({
  type: "content",
  schema: benefitSchema,
});

export const collections = {
  benefits,
  "benefits-archived": benefitsArchived,
};
