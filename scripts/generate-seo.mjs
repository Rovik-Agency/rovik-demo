import fs from 'node:fs';
import path from 'node:path';

const siteUrl = (process.env.VITE_SITE_URL || 'https://rovik.example').replace(/\/$/, '');
const publicDir = path.resolve('public');

const routes = [
  ['/', '1.0'],
  ['/services', '0.9'],
  ['/services/web-apps', '0.8'],
  ['/services/mobile-apps', '0.8'],
  ['/services/saas', '0.8'],
  ['/services/ai-automation', '0.8'],
  ['/services/ecommerce', '0.8'],
  ['/services/ui-ux', '0.8'],
  ['/services/cloud-devops', '0.8'],
  ['/services/qa-testing', '0.7'],
  ['/services/seo-marketing', '0.7'],
  ['/services/support', '0.7'],
  ['/work', '0.9'],
  ['/work/sindhu-heritage-of-sindh', '0.8'],
  ['/work/busal-os', '0.8'],
  ['/work/swift-trip-holidays', '0.8'],
  ['/work/idraak', '0.8'],
  ['/work/codadaily', '0.8'],
  ['/work/codavybes', '0.8'],
  ['/work/codatools', '0.8'],
  ['/solutions', '0.8'],
  ['/about', '0.8'],
  ['/pricing', '0.8'],
  ['/insights', '0.8'],
  ['/insights/hybrid-ai-agents-for-business-websites', '0.7'],
  ['/insights/portfolio-led-agency-positioning', '0.7'],
  ['/insights/technical-seo-for-modern-react-sites', '0.7'],
  ['/project-builder', '0.9'],
  ['/havali', '0.8'],
  ['/contact', '0.8'],
  ['/legal/privacy', '0.4'],
  ['/legal/terms', '0.4'],
  ['/legal/cookies', '0.4']
];

fs.mkdirSync(publicDir, { recursive: true });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map(([route, priority]) => `  <url><loc>${siteUrl}${route}</loc><priority>${priority}</priority></url>`)
  .join('\n')}\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /portal\nSitemap: ${siteUrl}/sitemap.xml\n`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
console.info(`[seo] Generated robots.txt and sitemap.xml for ${siteUrl}`);
