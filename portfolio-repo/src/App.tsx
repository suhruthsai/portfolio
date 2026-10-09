import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Work from "./components/Work";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", !ready);
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Navbar />
      <main>
        <Hero ready={ready} />
        <About />
        <Services />
        <Work />
        <Timeline />
        <Contact />
      </main>
    </>
  );
}
