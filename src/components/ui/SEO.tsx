import { Helmet } from 'react-helmet-async';
import { absoluteUrl, organizationSchema } from '@/lib/seo';

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

export function SEO({ title, description, path = '/', image = '/og-image.png', schema, noindex }: SEOProps) {
  const canonical = absoluteUrl(path);
  const jsonLd = Array.isArray(schema) ? [organizationSchema(), ...schema] : schema ? [organizationSchema(), schema] : [organizationSchema()];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteUrl(image)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
