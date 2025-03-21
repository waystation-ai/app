import { registry } from '../tools/core/registry';

// Import the main entry point to ensure all providers are registered
import '@/app/tools/main';

export async function GET() {
  // Get current date for lastmod
  const currentDate = new Date().toISOString();
  
  // Base domain from env
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  if (!domain) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
  }

  // Start XML content
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static routes
  const staticRoutes = [
    '',                    // Homepage
    '/connect/chatgpt',
    '/connect/claude',
    '/connect/mcp-server',
    '/legal/privacy-policy', // Privacy Policy
    '/legal/terms',        // Terms
  ];

  // Add static URLs
  for (const route of staticRoutes) {
    xml += `
  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  }

  // Define supported apps
  const apps = ['chatgpt', 'claude', 'mcp-server'];

  // Get all providers from registry
  const allProviders = registry.getAllProviders();

  // Add provider-specific routes for each app
  for (const provider of allProviders) {
    const providerKey = provider.id;
    xml += `
    <url>
      <loc>${domain}/connect/${providerKey}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`;
      for (const app of apps) {
      xml += `
  <url>
    <loc>${domain}/connect/${app}/${providerKey}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }
  }

  // Close XML
  xml += '\n</urlset>';

  // Return response with correct headers
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    },
  });
}
