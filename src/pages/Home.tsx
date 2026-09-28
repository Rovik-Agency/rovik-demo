import { SEO } from '@/components/ui/SEO';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { Methodology } from '@/components/home/Methodology';
import { Technologies } from '@/components/home/Technologies';
import { Testimonials } from '@/components/home/Testimonials';
import { PricingPreview } from '@/components/home/PricingPreview';
import { InsightsPreview } from '@/components/home/InsightsPreview';
import { CTA } from '@/components/home/CTA';

export function Home() {
  return <><SEO title="ROVIK — Ideas to Impact Through Technology" description="ROVIK builds premium web, mobile, SaaS, AI, automation, e-commerce, cloud, UI/UX, marketing and technology support platforms." /><Hero /><Stats /><ServicesGrid /><FeaturedWork /><Methodology /><Technologies /><Testimonials /><PricingPreview /><InsightsPreview /><CTA /></>;
}
