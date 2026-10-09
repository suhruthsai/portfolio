import { useState } from "react";
import { profile } from "../data/profile";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const { github, linkedin, email, resume } = profile.links;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the address is visible and selectable */
    }
  };

  const channels = [
    github && { label: "GitHub", value: github.replace("https://", ""), href: github },
    linkedin && { label: "LinkedIn", value: linkedin.replace(/^https:\/\/(www\.)?/, ""), href: linkedin },
    resume && { label: "Résumé", value: "Open PDF", href: resume },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <p className="eyebrow mono">Contact</p>
        <h2 className="contact-title">
          Let's build<br />something that <em>flies.</em>
        </h2>

        <div className="contact-grid">
          <div className="contact-mail">
            {email ? (
              <>
                <p className="mono dim">Email</p>
                <p className="mail-addr">{email}</p>
                <button className="btn" onClick={copy}>{copied ? "Copied ✓" : "Copy address"}</button>
              </>
            ) : (
              <p className="dim">Open to AI/ML internships and full-time roles from 2027. The fastest way to reach me is GitHub.</p>
            )}
          </div>
          <ul className="contact-links">
            {channels.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noopener" className="contact-row">
                  <span className="mono dim">{c.label}</span>
                  <span className="contact-val">{c.value}</span>
                  <span className="contact-arrow">↗</span>
                </a>
              </li>
            ))}
            <li>
              <div className="contact-row static">
                <span className="mono dim">Base</span>
                <span className="contact-val">{profile.location}</span>
                <span className="contact-arrow">◎</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <footer className="footer wrap mono">
        <span>© {new Date().getFullYear()} {profile.fullName}</span>
        <span>
          Designed &amp; built by {profile.fullName}. Inspired by{" "}
          <a href="https://github.com/MoncyDev/Portfolio-Website" target="_blank" rel="noopener">Moncy Yohannan</a>.
        </span>
      </footer>
    </section>
  );
}
