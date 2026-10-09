import { useEffect, useState } from "react";
import { profile } from "../data/profile";

const LINKS = [
  ["About", "#about"],
  ["What I do", "#services"],
  ["Work", "#work"],
  ["Journey", "#journey"],
  ["Contact", "#contact"],
];

export default function Navbar() {
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fmt = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));
    fmt();
    const id = setInterval(fmt, 15000);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearInterval(id); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#top" className="nav-logo" aria-label="Back to top">
        {profile.initials}<span>.</span>
      </a>
      <nav className="nav-links mono" aria-label="Sections">
        {LINKS.map(([label, href]) => (
          <a key={href} href={href} className="hover-swap">
            <span data-text={label}>{label}</span>
          </a>
        ))}
      </nav>
      <span className="nav-time mono">HYD · {time} IST</span>
    </header>
  );
}
