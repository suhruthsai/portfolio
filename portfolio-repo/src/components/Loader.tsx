// Pre-flight loading screen: a systems-check counter, then the panel lifts away.
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CHECKS = ["Avionics", "Neural core", "Telemetry", "Thrusters", "Comms"];

export default function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const counter = { v: 0 };
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve();
    let finished = false;

    const tween = gsap.to(counter, {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => setPct(Math.round(counter.v)),
      onComplete: () => {
        fonts.then(() => {
          if (finished || !ref.current) return;
          finished = true;
          gsap.to(ref.current, {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
            delay: 0.15,
            onStart: () => doneRef.current(),
            onComplete: () => setGone(true),
          });
        });
      },
    });
    return () => { finished = true; tween.kill(); };
  }, []);

  if (gone) return null;
  const done = Math.floor(pct / (100 / CHECKS.length));

  return (
    <div className="loader" ref={ref} aria-live="polite">
      <div className="loader-inner">
        <p className="mono loader-tag">Pre-flight systems check</p>
        <ul className="loader-checks mono">
          {CHECKS.map((c, i) => (
            <li key={c} className={i < done ? "ok" : ""}>
              <span>{c}</span>
              <span>{i < done ? "GO" : "···"}</span>
            </li>
          ))}
        </ul>
        <div className="loader-num">{String(pct).padStart(3, "0")}<span>%</span></div>
        <div className="loader-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
      </div>
    </div>
  );
}
