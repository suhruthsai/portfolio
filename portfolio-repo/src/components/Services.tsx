// What I do: three panels that expand on hover (desktop) or tap (touch).
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { services } from "../data/profile";

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".svc", {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".svc-row", start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section services" id="services" ref={ref}>
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow mono">What I do</p>
          <h2 className="sec-title">Three systems,<br /><em>one engineer.</em></h2>
        </div>
        <div className="svc-row">
          {services.map((s, i) => (
            <article
              key={s.title}
              className={`svc ${open === i ? "is-open" : ""}`}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              tabIndex={0}
              data-hover
            >
              <span className="svc-idx mono">SYS-{String.fromCharCode(65 + i)}</span>
              <h3>{s.title}</h3>
              <div className="svc-more">
                <p>{s.blurb}</p>
                <ul className="mono">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <span className="svc-plus" aria-hidden="true">+</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
