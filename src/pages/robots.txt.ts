export const prerender = true;

export const GET = ({ site }: { site?: URL }) => {
  const origin = site?.origin ?? "http://localhost:4321";
  const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
