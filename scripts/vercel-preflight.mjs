import fs from 'node:fs';

const requiredFiles = ['vercel.json', 'package.json', 'index.html', 'src/main.tsx', 'src/vite-env.d.ts', 'public/robots.txt', 'public/sitemap.xml'];
const missing = requiredFiles.filter((file) => !fs.existsSync(file));

if (missing.length) {
  console.error(`Missing production files: ${missing.join(', ')}`);
  process.exit(1);
}

const recommendedEnv = ['VITE_SITE_URL', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missingEnv = recommendedEnv.filter((key) => !process.env[key]);

console.info('ROVIK Vercel preflight');
console.info(`Files: ${requiredFiles.length - missing.length}/${requiredFiles.length} ready`);
if (missingEnv.length) {
  console.info(`Env still needed in Vercel for production: ${missingEnv.join(', ')}`);
} else {
  console.info('Recommended production env vars are present.');
}
