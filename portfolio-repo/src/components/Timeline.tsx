// Journey: a flight path that draws itself as you scroll, with a marker per milestone.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { timeline } from "../data/profile";

export default function Timeline() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".tl-fill", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".tl", start: "top 70%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((item) => {
        gsap.from(item, {
          x: 40, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 82%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section journey" id="journey" ref={ref}>
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow mono">Journey</p>
          <h2 className="sec-title">Flight <em>path.</em></h2>
        </div>
        <div className="tl">
          <span className="tl-line" aria-hidden="true"><span className="tl-fill" /></span>
          <ol className="tl-list">
          {timeline.map((t) => (
            <li className="tl-item" key={t.title}>
              <span className="tl-node" aria-hidden="true" />
              <p className="tl-when mono">{t.when}</p>
              <div className="tl-body">
                <h3>{t.title}</h3>
                <p className="tl-place mono">{t.place}</p>
                <p>{t.text}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
