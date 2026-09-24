import { Reveal } from "@/components/Reveal";

const PRINCIPLES = [
  {
    title: "Curation over noise",
    body: "Every car earns its place. No endless catalogue — twelve machines that each changed what driving could feel like, on display for their story.",
  },
  {
    title: "Numbers with context",
    body: "Horsepower means little without weight, torque and the story of the engine behind it. We publish the full picture.",
  },
  {
    title: "Cinematic by default",
    body: "Photography graded to one mood: dark, metallic, focused. The screen should feel like a private museum after hours.",
  },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 border-t border-white/[0.06] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 md:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-hi">About</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg md:text-5xl">
              A magazine,
              <br />
              a museum,
              <br />
              a tribute.
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              AUTOMOTIVE is a tribute to machine design — built for people who
              idle on spec sheets and feel the throttle through the screen.
            </p>
          </Reveal>

          <div className="space-y-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="group rounded-3xl border border-white/[0.07] bg-charcoal/50 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-charcoal">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-accent-hi">0{i + 1}</span>
                    <h3 className="font-display text-xl font-semibold text-fg">{p.title}</h3>
                  </div>
                  <p className="mt-3 pl-9 text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
