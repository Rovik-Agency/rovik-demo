import { clsx } from 'clsx';

export function SectionHeader({ eyebrow, title, children, center = false }: { eyebrow?: string; title: string; children?: React.ReactNode; center?: boolean }) {
  return (
    <div className={clsx('mb-10 max-w-3xl', center && 'mx-auto text-center')}>
      {eyebrow ? <p className="kicker mb-3">{eyebrow}</p> : null}
      <h2 className="h2">{title}</h2>
      {children ? <div className="mt-5 text-lg leading-8 text-muted">{children}</div> : null}
    </div>
  );
}
