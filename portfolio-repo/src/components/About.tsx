// About: a large statement whose words light up as you scroll through it.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { profile, projects } from "../data/profile";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-text .w",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 45%", scrub: true },
        });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="wrap about-grid">
        <p className="eyebrow mono">About</p>
        <p className="about-text">
          {profile.about.split(" ").map((w, i) => <span className="w" key={i}>{w} </span>)}
        </p>
        <dl className="about-stats">
          <div><dt className="mono">Projects built</dt><dd>{String(projects.length).padStart(2, "0")}</dd></div>
          <div><dt className="mono">SIH 2026 rank</dt><dd>Top 50</dd></div>
          <div><dt className="mono">Graduating</dt><dd>2027</dd></div>
        </dl>
      </div>
    </section>
  );
}
