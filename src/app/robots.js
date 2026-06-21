export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/'], // Keep AI bots out of private dashboard areas
    },
    // We explicitly allow common AI bots to crawl our public pages
    sitemap: 'https://kenyan.menu/sitemap.xml',
  }
}
