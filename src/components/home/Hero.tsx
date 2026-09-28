import { ArrowRight, Play, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { HeroOrb } from '@/components/visuals/HeroOrb';

const proof = ['SINDHU', 'BUSAL OS', 'IDRAAK'];

export function Hero() {
  return (
    <section className="hero-reference relative isolate min-h-[760px] overflow-hidden bg-ink text-white">
      <HeroOrb />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(91,108,255,.32),transparent_30%),radial-gradient(circle_at_70%_54%,rgba(138,92,255,.18),transparent_34%),linear-gradient(180deg,rgba(5,6,10,.18),#05060a_96%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      <div className="container relative z-10 grid min-h-[760px] items-center gap-10 pb-20 pt-28 lg:grid-cols-[.88fr_1.12fr]">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[.18em] text-white/75 shadow-glass backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-cyan" /> Digital partner for growing businesses
          </div>
          <h1 className="font-display text-[3.4rem] font-black leading-[.92] tracking-[-.055em] sm:text-7xl lg:text-[5.9rem]">
            Ideas to Impact Through <span className="gradient-text">Technology</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/70 sm:text-xl">
            ROVIK is a full-service technology agency that helps businesses build, improve and grow with modern websites, apps, AI, automation and digital solutions.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <LinkButton to="/project-builder" variant="secondary" className="bg-white text-ink hover:bg-white/90">Start Your Project <ArrowRight className="h-4 w-4" /></LinkButton>
            <LinkButton to="/work" variant="secondary" className="border-white/20 bg-white/5 text-white hover:bg-white/10"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-electric"><Play className="h-4 w-4 fill-current" /></span> See Our Work</LinkButton>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {proof.map((p, i) => <span key={p} className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-white text-[10px] font-black text-ink shadow-glass">{p.slice(0,2)}</span>)}
            </div>
            <div>
              <p className="text-sm font-bold text-white/75">Trusted through real shipped ROVIK products</p>
              <p className="text-xs tracking-[.25em] text-amber-300">★★★★★</p>
            </div>
          </div>
        </div>

        <div className="hero-device-wrap relative hidden min-h-[560px] lg:block">
          <div className="absolute left-[4%] top-[11%] h-[380px] w-[560px] -rotate-6 rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-[0_40px_140px_rgba(0,0,0,.55)] backdrop-blur-xl">
            <div className="relative h-full overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#05060a] p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,rgba(91,108,255,.45),transparent_28%),linear-gradient(135deg,rgba(255,255,255,.08),transparent_48%)]" />
              <div className="relative z-10 flex items-center justify-between text-[10px] font-black uppercase tracking-[.2em] text-white/40"><span>ROVIK</span><span>Build · AI · Grow</span></div>
              <h2 className="relative z-10 mt-20 max-w-sm font-display text-4xl font-black leading-[1.02] tracking-tight">Powering Businesses With Technology</h2>
              <LinkButton to="/project-builder" variant="secondary" className="relative z-10 mt-8 bg-white px-4 py-2 text-xs text-ink">Let's Talk <ArrowRight className="h-3 w-3" /></LinkButton>
              <div className="gem-shard absolute right-16 top-12 h-48 w-40" />
            </div>
          </div>
          <div className="absolute right-[3%] top-[24%] h-[390px] w-[215px] rotate-5 rounded-[2.2rem] border border-white/10 bg-white/10 p-3 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-xl">
            <div className="h-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#070914] p-5">
              <div className="mb-7 flex justify-between"><span className="h-2 w-12 rounded-full bg-white/20"/><span className="h-2 w-2 rounded-full bg-white/40"/></div>
              <p className="text-xs font-bold text-white/40">Growth OS</p>
              <h3 className="mt-2 font-display text-2xl font-black leading-tight">Smarter Solutions for Bigger Growth.</h3>
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
                <TrendingUp className="h-5 w-5 text-cyan" />
                <p className="mt-4 text-3xl font-black">AI</p>
                <p className="text-xs text-white/50">Automation ready</p>
                <div className="mt-5 h-20 rounded-2xl bg-[linear-gradient(135deg,rgba(91,108,255,.38),rgba(103,232,249,.16))]" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-16 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white/75 backdrop-blur-xl"><Sparkles className="h-4 w-4 text-cyan" /> Havali AI qualifies leads from conversations</div>
        </div>
      </div>
    </section>
  );
}
