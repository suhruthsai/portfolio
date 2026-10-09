// "Digital twin of me": the portrait is split by a scanner line.
// Left of the line is the real photo; right of it is a live dot-matrix twin
// (halftone dots sized by brightness + glowing edge wireframe).
// Intro: ~20k particles fly in and assemble the twin, then the scanner sweeps
// across and turns the twin into the real photo. Afterwards the line follows
// the cursor (or a finger drag); click / tap dissolves and rebuilds it.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

type Props = { src: string; ready: boolean; alt: string };

const SAMPLE = 210; // particle grid across the photo
const SIZE = 4; // world units the portrait spans
const CELLS = 92; // halftone cells across the twin

// shared colour ramp for the twin (used by particles and the twin shader)
const TWIN_RAMP = /* glsl */ `
  vec3 twinRamp(float L) {
    vec3 slate = vec3(0.22, 0.31, 0.43);
    vec3 amber = vec3(1.0, 0.70, 0.25);
    vec3 hot   = vec3(1.0, 0.93, 0.80);
    vec3 c = mix(slate, amber, smoothstep(0.10, 0.55, L));
    return mix(c, hot, smoothstep(0.72, 0.96, L));
  }
`;

const pointsVert = /* glsl */ `
  attribute vec3 aStart;
  attribute vec4 aColor;
  attribute float aRand;
  uniform float uProgress;
  uniform float uSize;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec4 vColor;
  varying float vSettle;
  void main() {
    float d = clamp((uProgress - aRand * 0.4) / 0.6, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - d, 3.0);
    vec3 p = mix(aStart, position, e);
    p.x += sin(uTime * 1.3 + aRand * 40.0) * 0.05 * (1.0 - e);
    p.y += cos(uTime * 1.1 + aRand * 30.0) * 0.05 * (1.0 - e);
    vec2 diff = p.xy - uMouse;
    p.xy += normalize(diff + 1e-4) * smoothstep(0.55, 0.0, length(diff)) * 0.12;
    vColor = aColor;
    vSettle = e;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (1.0 + (1.0 - e) * 1.6);
  }
`;

const pointsFrag = /* glsl */ `
  uniform float uFade;
  varying vec4 vColor;
  varying float vSettle;
  ${TWIN_RAMP}
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float L = dot(vColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(vec3(1.0, 0.70, 0.25), twinRamp(L), smoothstep(0.55, 1.0, vSettle));
    gl_FragColor = vec4(col, vColor.a * smoothstep(0.5, 0.2, r) * uFade);
  }
`;

const photoVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const photoFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uSplit;
  uniform float uLine;
  uniform float uTime;
  uniform float uCells;
  varying vec2 vUv;
  ${TWIN_RAMP}
  float luma(vec2 uv) { return dot(texture2D(uMap, uv).rgb, vec3(0.299, 0.587, 0.114)); }
  float sobel(vec2 uv) {
    vec2 d = vec2(1.6 / 800.0);
    float tl = luma(uv + vec2(-d.x,  d.y)), t = luma(uv + vec2(0.0,  d.y)), tr = luma(uv + vec2(d.x,  d.y));
    float l  = luma(uv + vec2(-d.x, 0.0)),                                   r  = luma(uv + vec2(d.x, 0.0));
    float bl = luma(uv + vec2(-d.x, -d.y)), b = luma(uv + vec2(0.0, -d.y)), br = luma(uv + vec2(d.x, -d.y));
    float gx = -tl - 2.0 * l - bl + tr + 2.0 * r + br;
    float gy = -tl - 2.0 * t - tr + bl + 2.0 * b + br;
    return length(vec2(gx, gy));
  }
  void main() {
    vec3 amber = vec3(1.0, 0.70, 0.25);
    vec4 src = texture2D(uMap, vUv);

    // ── twin: halftone dots + edge wireframe ──
    vec2 g = vUv * uCells;
    vec4 cs = texture2D(uMap, (floor(g) + 0.5) / uCells);
    float L = dot(cs.rgb, vec3(0.299, 0.587, 0.114));
    float rad = mix(0.12, 0.47, pow(L, 0.75));
    float dotm = (1.0 - smoothstep(rad - 0.08, rad, length(fract(g) - 0.5))) * cs.a;
    float edge = smoothstep(0.16, 0.5, sobel(vUv)) * src.a;
    float scan = 0.82 + 0.18 * sin(vUv.y * 620.0 - uTime * 4.0);
    vec3 twinCol = mix(twinRamp(L) * scan, amber, edge);
    float twinA = max(dotm * 0.95, edge * 0.9);

    // ── compose: real photo left of the line, twin right of it ──
    float side = smoothstep(uSplit - 0.0015, uSplit + 0.0015, vUv.x);
    vec3 col = mix(src.rgb, twinCol, side);
    float a = mix(src.a, twinA, side);

    // scanner line + glow spilling onto the twin side
    float ld = abs(vUv.x - uSplit);
    float vfade = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
    float line = smoothstep(0.0035, 0.0, ld) * vfade * uLine;
    float glow = smoothstep(0.07, 0.0, ld) * step(uSplit, vUv.x) * vfade * uLine * 0.35;
    col = mix(col, vec3(1.0, 0.86, 0.6), line);
    col += amber * glow * (1.0 - a);
    a = max(a, max(line, glow));

    gl_FragColor = vec4(col, a * uOpacity);
  }
`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

export default function Portrait({ src, ready, alt }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ assemble: () => void; rebuild: () => void } | null>(null);
  const [fallback, setFallback] = useState(false);
  const [touch] = useState(() => typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches);
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let img: HTMLImageElement;
      let renderer: THREE.WebGLRenderer;
      try {
        img = await loadImage(src);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false });
      } catch {
        setFallback(true);
        return;
      }
      if (disposed) { renderer.dispose(); return; }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // pass the photo's sRGB colours straight through
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      const group = new THREE.Group();
      scene.add(group);

      // ── particles sampled from the photo ───────────────────
      const cv = document.createElement("canvas");
      cv.width = cv.height = SAMPLE;
      const ctx = cv.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
      const data = ctx.getImageData(0, 0, SAMPLE, SAMPLE).data;
      const pos: number[] = [], start: number[] = [], col: number[] = [], rnd: number[] = [];
      const step = SIZE / SAMPLE;
      for (let y = 0; y < SAMPLE; y++) {
        for (let x = 0; x < SAMPLE; x++) {
          const i = (y * SAMPLE + x) * 4;
          const a = data[i + 3] / 255;
          if (a < 0.35) continue;
          const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          pos.push(-SIZE / 2 + x * step, SIZE / 2 - y * step, (lum - 0.4) * 0.12);
          const ang = Math.random() * Math.PI * 2, rad = 2.2 + Math.random() * 3.2;
          start.push(Math.cos(ang) * rad, Math.sin(ang) * rad * 0.8, (Math.random() - 0.5) * 4);
          col.push(r, g, b, a);
          rnd.push(Math.random());
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("aStart", new THREE.Float32BufferAttribute(start, 3));
      geo.setAttribute("aColor", new THREE.Float32BufferAttribute(col, 4));
      geo.setAttribute("aRand", new THREE.Float32BufferAttribute(rnd, 1));
      const pUni = {
        uProgress: { value: 0 }, uSize: { value: 3 }, uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(99, 99) }, uFade: { value: 1 },
      };
      const points = new THREE.Points(geo, new THREE.ShaderMaterial({
        vertexShader: pointsVert, fragmentShader: pointsFrag, uniforms: pUni, transparent: true, depthWrite: false,
      }));
      group.add(points);

      // ── photo / twin plane ──────────────────────────────────
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.NoColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.needsUpdate = true;
      const phUni = {
        uMap: { value: tex }, uOpacity: { value: 0 }, uSplit: { value: 0 }, uLine: { value: 0 },
        uTime: { value: 0 }, uCells: { value: CELLS },
      };
      const photo = new THREE.Mesh(
        new THREE.PlaneGeometry(SIZE, SIZE),
        new THREE.ShaderMaterial({ vertexShader: photoVert, fragmentShader: photoFrag, uniforms: phUni, transparent: true, depthWrite: false }),
      );
      photo.position.z = 0.01;
      group.add(photo);

      // ── amber backlight ─────────────────────────────────────
      const glowCv = document.createElement("canvas");
      glowCv.width = glowCv.height = 256;
      const gctx = glowCv.getContext("2d")!;
      const grd = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grd.addColorStop(0, "rgba(255,179,64,0.40)");
      grd.addColorStop(0.45, "rgba(255,138,31,0.11)");
      grd.addColorStop(1, "rgba(255,138,31,0)");
      gctx.fillStyle = grd;
      gctx.fillRect(0, 0, 256, 256);
      const glowTex = new THREE.CanvasTexture(glowCv);
      const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: 0 });
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(SIZE * 1.15, SIZE * 1.15), glowMat);
      glow.position.set(0, SIZE * 0.08, -0.6);
      group.add(glow);

      // ── sizing ──────────────────────────────────────────────
      const view = { w: 1, h: 1 };
      const resize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        if (!w || !h) return;
        view.w = w; view.h = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const distH = (SIZE * 1.06) / 2 / Math.tan(vFov / 2);
        camera.position.set(0, 0, Math.max(distH, distH / Math.min(1, camera.aspect)));
        camera.updateProjectionMatrix();
        const visibleH = 2 * Math.tan(vFov / 2) * camera.position.z;
        pUni.uSize.value = ((h * renderer.getPixelRatio()) / visibleH) * step * 1.35;
      };
      const ro = new ResizeObserver(resize);
      ro.observe(mount);
      resize();

      // ── pointer: tilt, particle push, and split control ────
      const mouse = { x: 0, y: 0 };
      let hoverUntil = 0, splitTarget = 0.5;
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const hitP = new THREE.Vector3();
      const onMove = (e: PointerEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        const b = renderer.domElement.getBoundingClientRect();
        ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(zPlane, hitP)) pUni.uMouse.value.set(hitP.x, hitP.y);
        const hits = ray.intersectObject(photo);
        if (hits[0]?.uv) {
          splitTarget = THREE.MathUtils.clamp(hits[0].uv.x, 0.03, 0.97);
          hoverUntil = performance.now() + 1600;
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // ── sequences ───────────────────────────────────────────
      let busy = true;
      const reveal = (tl: gsap.core.Timeline) =>
        tl.set(phUni.uSplit, { value: 0 })
          .to(phUni.uOpacity, { value: 1, duration: 0.8, ease: "power2.out" }, "-=0.3")
          .to(pUni.uFade, { value: 0, duration: 0.8, ease: "power2.out" }, "<")
          .to(phUni.uLine, { value: 1, duration: 0.3 }, "-=0.2")
          .to(phUni.uSplit, { value: 1, duration: 1.5, ease: "power2.inOut" })
          .to(phUni.uSplit, { value: 0.5, duration: 0.9, ease: "power3.out" });

      const assemble = () => {
        if (reduce) {
          pUni.uProgress.value = 1; pUni.uFade.value = 0;
          phUni.uOpacity.value = 1; phUni.uLine.value = 1; phUni.uSplit.value = 0.5;
          glowMat.opacity = 1; busy = false;
          return;
        }
        busy = true;
        const tl = gsap.timeline({ onComplete: () => { busy = false; splitTarget = phUni.uSplit.value; } });
        tl.to(pUni.uProgress, { value: 1, duration: 2.4, ease: "power2.inOut" })
          .to(glowMat, { opacity: 1, duration: 1.6 }, 0.4);
        reveal(tl);
      };
      const rebuild = () => {
        if (busy || reduce) return;
        busy = true;
        const tl = gsap.timeline({ onComplete: () => { busy = false; splitTarget = phUni.uSplit.value; } });
        tl.to(phUni.uLine, { value: 0, duration: 0.2 })
          .to(phUni.uOpacity, { value: 0, duration: 0.35 }, "<")
          .to(pUni.uFade, { value: 1, duration: 0.25 }, "<")
          .to(pUni.uProgress, { value: 0.25, duration: 0.9, ease: "power2.in" })
          .to(pUni.uProgress, { value: 1, duration: 1.4, ease: "power2.out" });
        reveal(tl);
      };
      api.current = { assemble, rebuild };
      if (readyRef.current) assemble();

      // ── loop ────────────────────────────────────────────────
      const clock = new THREE.Clock();
      const tagPos = new THREE.Vector3();
      let raf = 0;
      const tick = () => {
        const t = clock.getElapsedTime();
        pUni.uTime.value = t;
        phUni.uTime.value = t;

        if (!busy) {
          const idle = performance.now() > hoverUntil;
          const target = idle && !reduce ? 0.5 + Math.sin(t * 0.55) * 0.14 : splitTarget;
          phUni.uSplit.value += (target - phUni.uSplit.value) * (idle ? 0.03 : 0.16);
        }
        group.rotation.y += (mouse.x * 0.12 - group.rotation.y) * 0.06;
        group.rotation.x += (mouse.y * 0.07 - group.rotation.x) * 0.06;
        if (!reduce) group.position.y = Math.sin(t * 0.9) * 0.02;

        renderer.render(scene, camera);

        // keep the REAL | TWIN tag riding on top of the scanner line
        if (tagRef.current) {
          tagPos.set((phUni.uSplit.value - 0.5) * SIZE, SIZE * 0.47, 0).applyMatrix4(photo.matrixWorld).project(camera);
          const px = ((tagPos.x + 1) / 2) * view.w, py = ((1 - tagPos.y) / 2) * view.h;
          tagRef.current.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, -100%)`;
          tagRef.current.style.opacity = String(phUni.uLine.value);
        }
        raf = requestAnimationFrame(tick);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        geo.dispose(); tex.dispose(); glowTex.dispose(); glowMat.dispose();
        (points.material as THREE.Material).dispose();
        (photo.material as THREE.Material).dispose(); photo.geometry.dispose(); glow.geometry.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        api.current = null;
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, [src]);

  useEffect(() => {
    if (ready) api.current?.assemble();
  }, [ready]);

  return (
    <div className="portrait" data-hover role="img" aria-label={alt} onClick={() => api.current?.rebuild()}>
      <div className="portrait-gl" ref={mountRef} />
      {fallback && <img className="portrait-fallback" src={src} alt="" />}

      <div className="split-tag mono" ref={tagRef} aria-hidden="true">
        <span>Real</span><i /><span>Twin</span>
      </div>

      <svg className="badge" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="badge-ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="58" className="badge-bg" />
        <g className="badge-spin">
          <text><textPath href="#badge-ring">AI/ML ENGINEER • DIGITAL TWINS • MULTI-AGENT AI •</textPath></text>
        </g>
        <text x="60" y="67" textAnchor="middle" className="badge-core">KSS</text>
      </svg>

      <span className="portrait-tag mono" aria-hidden="true">
        {touch ? "Drag across to compare · tap to rebuild" : "Move across to compare · click to rebuild"}
      </span>
    </div>
  );
}
