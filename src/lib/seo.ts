import { env } from './env';

export function absoluteUrl(path = '/') {
  return `${env.siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ROVIK',
    url: env.siteUrl,
    logo: absoluteUrl('/favicon.svg'),
    sameAs: [],
    description: 'ROVIK is a technology agency for web, mobile, SaaS, AI, automation, e-commerce, cloud, design and growth.'
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.url) }))
  };
}
