import { clsx } from 'clsx';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx('rounded-[var(--radius)] border border-soft bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-glass', className)}>{children}</div>;
}

export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx('glass rounded-[var(--radius)] p-6 shadow-glass', className)}>{children}</div>;
}
