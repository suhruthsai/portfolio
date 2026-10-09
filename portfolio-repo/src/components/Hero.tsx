import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Portrait from "./Portrait";
import { profile } from "../data/profile";

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span className="ch" key={i}><span>{ch}</span></span>
      ))}
    </>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [roleIdx, setRoleIdx] = useState(0);

  // intro sequence after the loader lifts
  useEffect(() => {
    if (!ready || !ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-name .ch > span", { yPercent: 110, duration: 1.1, stagger: 0.04 })
        .from(".hero-kicker, .hero-role, .hero-tagline, .hero-ctas, .hero-meta > *", {
          y: 24, opacity: 0, duration: 0.9, stagger: 0.08,
        }, "-=0.7");
    }, ref);
    return () => ctx.revert();
  }, [ready]);

  // rotating role line
  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % profile.roles.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker mono"><i className="pulse" /> {profile.status}</p>
          <h1 className="hero-name">
            <span className="line"><Letters text={profile.firstName} /></span>
            <span className="line outline"><Letters text={profile.lastName} /></span>
          </h1>
          <p className="hero-role">
            <span className="role-track" key={roleIdx}>{profile.roles[roleIdx]}</span>
          </p>
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="hero-ctas">
            <a className="btn btn-solid" href="#work">See my work</a>
            {profile.links.resume ? (
              <a className="btn" href={profile.links.resume} target="_blank" rel="noopener">Résumé ↗</a>
            ) : (
              <a className="btn" href="#contact">Get in touch</a>
            )}
          </div>
        </div>

        <div className="hero-stage">
          <Portrait src={profile.photo} ready={ready} alt={`Portrait of ${profile.fullName}`} />
        </div>
      </div>

      <div className="hero-meta mono">
        <span>17.39°N 78.49°E</span>
        <span>{profile.location}</span>
        <span>B.Tech IT · 2027</span>
        <a href="#about" className="scroll-cue">Scroll <i /></a>
      </div>
    </section>
  );
}
