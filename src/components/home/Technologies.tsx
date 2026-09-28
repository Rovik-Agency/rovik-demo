import { technologies } from '@/data/technologies';

export function Technologies() {
  return (
    <section className="border-y border-soft bg-card py-10">
      <div className="container">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="min-w-[240px]"><p className="kicker">Technologies</p><h2 className="mt-2 font-display text-2xl font-black">Modern stack, practical delivery</h2></div>
          <div className="flex flex-wrap gap-3">{technologies.map((tech) => <span key={tech} className="rounded-full border border-soft bg-white px-4 py-2 text-sm font-bold shadow-sm dark:bg-white/5">{tech}</span>)}</div>
        </div>
      </div>
    </section>
  );
}
