// Work: on desktop the section pins and the project cards travel sideways
// as you scroll; on phones it falls back to a vertical stack.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { projects } from "../data/profile";

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const dist = () => el.scrollWidth - window.innerWidth + 64;
      gsap.to(el, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(".work-progress i", {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: () => "+=" + dist(), scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="section work" id="work" ref={ref}>
      <div className="wrap work-head">
        <div className="sec-head">
          <p className="eyebrow mono">Selected work</p>
          <h2 className="sec-title">Mission <em>log.</em></h2>
        </div>
        <div className="work-progress" aria-hidden="true"><i /></div>
      </div>

      <div className="work-track" ref={track}>
        {projects.map((p, i) => (
          <article className="card" key={p.code} data-hover>
            <div className="card-top mono">
              <span>{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
              <span className="card-status">{p.status}</span>
            </div>
            <div className="card-code">{p.code}</div>
            <h3>{p.name}</h3>
            <p className="card-kind mono">{p.kind}</p>
            <p className="card-sum">{p.summary}</p>
            <p className="card-detail">{p.detail}</p>
            <div className="card-foot">
              {p.team && <span className="mono">{p.team}</span>}
              {p.link && (
                <a className="card-link mono" href={p.link} target="_blank" rel="noopener">
                  View code ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
