import type { ProjectBrief, ProjectBuilderForm } from '@/types';

const featureWeights: Record<string, number> = {
  'Authentication': 350,
  'Admin dashboard': 500,
  'Payments': 450,
  'CMS': 400,
  'AI assistant': 700,
  'Booking': 300,
  'Analytics': 300,
  'E-commerce': 700,
  'Client portal': 650,
  'Automation': 550
};

export function generateBrief(form: ProjectBuilderForm): ProjectBrief {
  const base = form.service === 'AI & Automation' ? 1400 : form.service === 'SaaS' ? 1800 : form.service === 'E-commerce' ? 1200 : 900;
  const features = form.features.reduce((sum, feature) => sum + (featureWeights[feature] || 250), base);
  const designMultiplier = form.designLevel === 'Premium custom' ? 1.55 : form.designLevel === 'Advanced' ? 1.25 : 1;
  const low = Math.round((features * designMultiplier) / 100) * 100;
  const high = Math.round((low * 1.55) / 100) * 100;
  const timelineRange = form.timeline === 'Urgent' ? '2–4 weeks with focused scope' : form.timeline === 'Standard' ? '4–8 weeks' : '8–14 weeks';

  return {
    title: `${form.businessType || 'Business'} ${form.service} Brief`,
    recommendedServices: [form.service, ...(form.features.includes('AI assistant') ? ['AI & Automation'] : []), ...(form.features.includes('CMS') ? ['CMS architecture'] : [])],
    scope: [
      `Primary build: ${form.service}`,
      `Business type: ${form.businessType}`,
      `Features: ${form.features.join(', ') || 'Discovery needed'}`,
      `Design level: ${form.designLevel}`
    ],
    timelineRange,
    priceRange: `£${low.toLocaleString()}–£${high.toLocaleString()}+`,
    assumptions: [
      'Final pricing depends on content, integrations, third-party APIs and acceptance criteria.',
      'Security, responsive QA, technical SEO and launch support are included in the recommended delivery approach.',
      'External software fees, paid AI usage and payment processor fees are not included.'
    ],
    nextSteps: ['Review the generated brief', 'Book a discovery call', 'Confirm scope and timeline', 'Receive a proposal']
  };
}

export function briefToMarkdown(brief: ProjectBrief, form: ProjectBuilderForm) {
  return `# ${brief.title}\n\n## Contact\n- Name: ${form.name}\n- Email: ${form.email}\n- Company: ${form.company || 'Not provided'}\n\n## Recommended Services\n${brief.recommendedServices.map((i) => `- ${i}`).join('\n')}\n\n## Scope\n${brief.scope.map((i) => `- ${i}`).join('\n')}\n\n## Timeline\n${brief.timelineRange}\n\n## Estimated Range\n${brief.priceRange}\n\n## Assumptions\n${brief.assumptions.map((i) => `- ${i}`).join('\n')}\n\n## Next Steps\n${brief.nextSteps.map((i) => `- ${i}`).join('\n')}\n\n## Notes\n${form.message || 'No notes provided.'}`;
}
