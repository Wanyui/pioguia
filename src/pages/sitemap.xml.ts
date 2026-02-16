export const prerender = true;

export const GET = ({ site }: { site?: URL }) => {
  const origin = site?.origin ?? "http://localhost:4321";
  const now = new Date().toISOString();

  const urls = [
    {
      loc: `${origin}/`,
      changefreq: "daily",
      priority: "1.0",
      lastmod: now,
    },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
