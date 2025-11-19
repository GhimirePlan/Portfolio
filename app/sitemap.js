export default async function sitemap() {
  const baseUrl = 'https://planghimire.com';
  const staticRoutes = [
    '',
    '/blog',
    '/offline',
    '/planbot',
    '/profile',
    '/visitor-test',
  ];

  const entries = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1.0 : 0.7,
  }));

  return entries;
}