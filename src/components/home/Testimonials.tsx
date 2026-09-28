import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const proofCards = [
  { title: 'Portfolio-first trust', body: 'Visitors see real ROVIK products such as SINDHU, Busal OS, IDRAAK, CodaDaily, CodaVybes and CodaTools.' },
  { title: 'No fake testimonials', body: 'The CMS is ready for verified client quotes, but the public site does not invent names, revenue or satisfaction metrics.' },
  { title: 'Lead-ready AI experience', body: 'Havali AI can answer from controlled knowledge and turn discovery conversations into structured CRM leads.' }
];

export function Testimonials() {
  return (
    <section className="bg-ink py-20 text-white sm:py-24">
      <div className="container">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker text-cyan">Client proof system</p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">What ROVIK Shows Instead of Fake Claims</h2>
          </div>
          <Link to="/work" className="inline-flex items-center gap-2 text-sm font-black text-white/70 transition hover:text-white">Open case studies <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {proofCards.map((card) => (
            <div key={card.title} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 shadow-glass">
              <CheckCircle2 className="h-6 w-6 text-cyan" />
              <h3 className="mt-6 font-display text-2xl font-black">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/60">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
