import { defineCollection, z } from "astro:content";
import { CATEGORY_KEYS } from "../lib/categories";

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
  category: z.enum(CATEGORY_KEYS),
  /** Short, scannable benefit shown as a tag: "−15%", "2x1", "Gratis". */
  highlight: localizedString.optional(),
  /** Who the benefit applies to, kept short: "tú + 3 acompañantes", "3–13 años". */
  appliesTo: localizedString.optional(),
  address: z.string(),
  city: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logo: z.string().optional(),
  /** Use "dark" for logos drawn in white on a transparent background. */
  logoBackground: z.enum(["light", "dark"]).optional(),
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
