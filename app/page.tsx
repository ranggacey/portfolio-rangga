"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import type {
  SakugaButtonElement,
  SakugaProgressElement,
  SakugaToastElement,
} from "../sakuga-elements";

const PROJECTS = [
  {
    name: "Street Fight Tournament Hub",
    url: "https://streetfight.ranggafigo.com",
    img: "/projects/streetfight.jpg",
    alt: "Tangkapan layar Street Fight Tournament Hub",
    desc: "Platform turnamen stickman: daftar, buat fighter, bracket otomatis, pemenang diundi, dan tiap laga jadi video.",
    tags: ["Next.js", "MongoDB", "Tailwind"],
  },
  {
    name: "Parfumefy",
    url: "https://parfumefy.ranggafigo.com",
    img: "/projects/parfumefy.jpg",
    alt: "Tangkapan layar Parfumefy",
    desc: "Situs pengenalan brand parfum: eksplorasi aroma, cerita tiap varian, dan pengalaman browsing yang editorial.",
    tags: ["Next.js", "GSAP", "Vite"],
  },
  {
    name: "ManhwaHub",
    url: "https://manhwahub.ranggafigo.blog",
    img: "/projects/manhwahub.jpg",
    alt: "Tangkapan layar ManhwaHub",
    desc: "Perpustakaan manhwa: judul trending, jelajah genre, dan daftar skor tertinggi dengan rating.",
    tags: ["Next.js", "API", "Responsif"],
  },
  {
    name: "Stok Gudang",
    url: "https://stokgudang.ranggafigo.blog",
    img: "/projects/stokgudang.jpg",
    alt: "Tangkapan layar Stok Gudang",
    desc: "Monitoring stok gudang real-time: cari barang, pantau status tersedia, menipis, dan habis.",
    tags: ["Next.js", "Realtime", "Dashboard"],
  },
  {
    name: "Presensi Magang",
    url: "https://presensi.ranggafigo.blog",
    img: "/projects/presensi.jpg",
    alt: "Tangkapan layar Presensi Magang",
    desc: "Sistem presensi magang berbasis pengenalan wajah (face-api.js) untuk mendigitalisasi absensi manual.",
    tags: ["Next.js", "face-api.js", "MongoDB"],
  },
  {
    name: "Geser — Kanban Board",
    url: "https://kanban.ranggafigo.blog",
    img: "/projects/kanban.jpg",
    alt: "Tangkapan layar Geser Kanban",
    desc: "Papan Kanban realtime dengan drag-and-drop yang halus, label, dan tenggat di tiap kartu tugas.",
    tags: ["Next.js", "Drag & Drop", "Realtime"],
  },
];

const SKILLS_TICKER = [
  "Next.js", "React", "TypeScript", "Laravel", "PHP", "MySQL",
  "PostgreSQL", "MongoDB", "Node.js", "REST API", "Git",
];

const HERO_COLS = 16;
const HERO_ROWS = 8;
const DOT_COLS = 12;
const DOT_ROWS = 5;

function splitLetters(text: string) {
  return text.split("").map((ch, i) => (
    <span key={i} className="t-letter">
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

export default function Home() {
  const heroGridRef = useRef<HTMLDivElement>(null);
  const dotGridRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SakugaProgressElement>(null);
  const toastRef = useRef<SakugaToastElement>(null);

  useEffect(() => {
    document.getElementById("year")!.textContent = String(new Date().getFullYear());
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Header: shrink saat scroll + progress bar */
    const header = document.getElementById("siteHeader")!;
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 24);
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const prog = progressRef.current;
      if (prog && typeof prog.set === "function") {
        prog.set(p);
        prog.classList.toggle("live", p > 0.005);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Menu mobile */
    const menuBtn = document.getElementById("menuBtn")!;
    const mainNav = document.getElementById("mainNav")!;
    const closeMenu = () => {
      mainNav.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    };
    const toggleMenu = () => {
      const open = mainNav.classList.toggle("open");
      menuBtn.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    };
    menuBtn.addEventListener("click", toggleMenu);
    mainNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    /* Nav aktif */
    const navLinks = Array.from(mainNav.querySelectorAll('a[href^="#"]'));
    const sections = navLinks
      .map((a) => document.querySelector(a.getAttribute("href")!))
      .filter((el): el is Element => !!el);
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));

    if (prefersReduced) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      document.querySelectorAll<HTMLElement>(".count").forEach((el) => {
        el.textContent = el.getAttribute("data-count") || "0";
      });
      document.querySelectorAll(".doodle-stroke, .scribble-path").forEach((el) => {
        (el as SVGPathElement).style.strokeDashoffset = "0";
      });
      return () => {
        window.removeEventListener("scroll", onScroll);
        menuBtn.removeEventListener("click", toggleMenu);
        navObserver.disconnect();
      };
    }

    /* ---------- HERO: stagger masuk ---------- */
    anime
      .timeline({ easing: "easeOutExpo" })
      .add({
        targets: ".hero .hero-el",
        translateY: [28, 0],
        opacity: [0, 1],
        duration: 900,
        delay: anime.stagger(110, { start: 150 }),
      })
      .add({ targets: ".scroll-hint", opacity: [0, 1], duration: 600 }, "-=500");

    /* Coretan tangan di hero */
    anime({
      targets: ".scribble-path",
      strokeDashoffset: [1, 0],
      duration: 1100,
      delay: 900,
      easing: "easeInOutQuad",
    });

    /* ---------- HERO GRID: gelombang stagger ala anime.js ---------- */
    const heroCells = () => Array.from(heroGridRef.current?.querySelectorAll(".hero-cell") || []);
    anime({
      targets: ".hero-cell",
      scale: [0, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(28, { grid: [HERO_COLS, HERO_ROWS], from: "center" }),
      easing: "easeOutExpo",
    });
    let lastWave = 0;
    const onHeroOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest(".hero-cell") as HTMLElement | null;
      if (!t || !heroGridRef.current) return;
      const now = Date.now();
      if (now - lastWave < 160) return;
      lastWave = now;
      const idx = Number(t.dataset.i || 0);
      anime({
        targets: heroCells(),
        scale: [1, 1.9, 1],
        backgroundColor: ["#16233a", "#b8f135", "#16233a"],
        duration: 700,
        delay: anime.stagger(45, { grid: [HERO_COLS, HERO_ROWS], from: idx }),
        easing: "easeOutQuad",
      });
    };
    heroGridRef.current?.addEventListener("mouseover", onHeroOver);

    /* Judul: huruf mental saat di-hover */
    const title = document.querySelector(".hero-title");
    const onTitleHover = () => {
      anime({
        targets: ".hero-title .t-letter",
        translateY: [0, -10, 0],
        rotate: [0, -4, 0],
        duration: 500,
        delay: anime.stagger(28),
        easing: "easeOutQuad",
      });
    };
    title?.addEventListener("mouseenter", onTitleHover);

    /* ---------- Reveal saat scroll (lebih hidup: naik + miring + zoom) ---------- */
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          revealObserver.unobserve(el);
          anime({
            targets: el,
            translateY: [44, 0],
            rotate: [1.6, 0],
            scale: [0.97, 1],
            opacity: [0, 1],
            duration: 850,
            easing: "easeOutExpo",
          });
          el.classList.add("in");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    /* ---------- Doodle stroke-by-stroke ---------- */
    const doodleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          doodleObserver.disconnect();
          anime({
            targets: ".doodle-stroke",
            strokeDashoffset: [1, 0],
            duration: 700,
            delay: anime.stagger(220),
            easing: "easeInOutQuad",
          });
        });
      },
      { threshold: 0.4 }
    );
    const doodle = document.getElementById("doodle");
    if (doodle) doodleObserver.observe(doodle);

    /* ---------- Playground: loop timer ---------- */
    const loopAnim = anime({
      targets: ".loop-shape",
      translateY: [0, -16, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.15, 1],
      duration: 2400,
      delay: anime.stagger(300),
      loop: true,
      direction: "alternate",
      easing: "easeInOutSine",
    });

    /* ---------- Counter statistik ---------- */
    let countersDone = false;
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || countersDone) return;
          countersDone = true;
          document.querySelectorAll<HTMLElement>(".count").forEach((el) => {
            const target = parseInt(el.getAttribute("data-count") || "0", 10);
            const obj = { v: 0 };
            anime({
              targets: obj,
              v: target,
              duration: 1200,
              easing: "easeOutExpo",
              update: () => {
                el.textContent = String(Math.round(obj.v));
              },
            });
          });
          statsObserver.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    const stats = document.querySelector(".hero-stats");
    if (stats) statsObserver.observe(stats);

    /* ---------- Tilt kartu proyek ---------- */
    const tiltHandlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
        const move = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -4;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
          anime({ targets: card, rotateX: rx, rotateY: ry, duration: 300, easing: "easeOutQuad" });
        };
        const leave = () => {
          anime({ targets: card, rotateX: 0, rotateY: 0, duration: 500, easing: "easeOutExpo" });
        };
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
        tiltHandlers.push({ el: card, move, leave });
      });
    }

    /* ---------- Klik kartu proyek: impact burst Sakuga (API publik window.SakugaFX) ---------- */
    const burstHandlers: Array<{ el: HTMLElement; fn: (e: PointerEvent) => void }> = [];
    document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
      const fn = (e: PointerEvent) => {
        const fx = window.SakugaFX;
        if (!fx) return;
        const x = e.clientX + window.scrollX;
        const y = e.clientY + window.scrollY;
        fx.burst(x, y, { r: 46 });
        fx.sfx("don", x, y - 64, { size: 120, rot: -0.1, life: 0.9 });
      };
      card.addEventListener("pointerdown", fn);
      burstHandlers.push({ el: card, fn });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      menuBtn.removeEventListener("click", toggleMenu);
      navObserver.disconnect();
      revealObserver.disconnect();
      doodleObserver.disconnect();
      statsObserver.disconnect();
      heroGridRef.current?.removeEventListener("mouseover", onHeroOver);
      title?.removeEventListener("mouseenter", onTitleHover);
      loopAnim.pause();
      tiltHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
      burstHandlers.forEach(({ el, fn }) => {
        el.removeEventListener("pointerdown", fn);
      });
    };
  }, []);

  /* ---------- Playground handlers (React props, bukan addEventListener) ---------- */
  const dragStateRef = useRef<{ startX: number; startY: number; x: number; y: number } | null>(null);

  const handleDotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = (e.target as HTMLElement).closest(".dot") as HTMLElement | null;
    if (!t || !dotGridRef.current) return;
    const idx = Number(t.dataset.i || 0);
    const dots = Array.from(dotGridRef.current.querySelectorAll(".dot"));
    anime({
      targets: dots,
      scale: [1, 2.1, 1],
      backgroundColor: ["#2a3a4d", "#ff5c38", "#2a3a4d"],
      duration: 800,
      delay: anime.stagger(55, { grid: [DOT_COLS, DOT_ROWS], from: idx }),
      easing: "easeOutQuad",
    });
  };

  const handleDragDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    dragStateRef.current = { startX: e.clientX, startY: e.clientY, x: 0, y: 0 };
    el.classList.add("dragging");
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current;
    if (!s) return;
    const el = e.currentTarget;
    s.x = e.clientX - s.startX;
    s.y = e.clientY - s.startY;
    el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.x * 0.04}deg)`;
  };

  const handleDragUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current;
    const el = e.currentTarget;
    if (!s) return;
    dragStateRef.current = null;
    el.classList.remove("dragging");
    // Animasikan objek biasa (bukan transform elemen) biar tidak ada balapan
    // antara anime.js dan style.transform yang ditulis manual.
    const obj = { x: s.x, y: s.y };
    anime({
      targets: obj,
      x: 0,
      y: 0,
      duration: 700,
      easing: "easeOutElastic(1, .5)",
      update: () => {
        el.style.transform = `translate(${obj.x}px, ${obj.y}px) rotate(${obj.x * 0.04}deg)`;
      },
      complete: () => {
        el.style.transform = "";
      },
    });
  };

  /* ---------- Aksi tombol Sakuga (custom element = <button> asli; navigasi via handler) ---------- */
  const scrollToId = (sel: string) => () => {
    document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
  };
  const openExternal = (url: string) => () => {
    window.open(url, "_blank", "noopener");
  };
  const downloadCV = (e: React.MouseEvent<SakugaButtonElement>) => {
    const btn = e.currentTarget;
    const a = document.createElement("a");
    a.href = "/CV-Rangga-Figo-Hidayat.pdf";
    a.download = "CV-Rangga-Figo-Hidayat.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (typeof btn.done === "function") btn.done();
  };
  const sendEmail = (e: React.MouseEvent<SakugaButtonElement>) => {
    const btn = e.currentTarget;
    window.location.href = "mailto:ranggadanceyong@gmail.com";
    if (typeof btn.done === "function") btn.done();
  };
  const copyEmail = async (e: React.MouseEvent<SakugaButtonElement>) => {
    const btn = e.currentTarget;
    const email = "ranggadanceyong@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toastRef.current?.show("Email disalin!");
    if (typeof btn.done === "function") btn.done();
  };

  return (
    <>
      {/* Sakuga progress: awan badai mengikuti posisi scroll; burst + ドン! di 100% */}
      <sakuga-progress
        ref={progressRef}
        className="scroll-progress-sakuga"
        label="Progress membaca halaman"
        done-label="Selesai dibaca ✓"
      />
      <header className="site-header" id="siteHeader">
        <div className="container header-inner">
          <a className="logo" href="#beranda">
            RF<span>.</span>
          </a>
          <nav className="main-nav" id="mainNav" aria-label="Navigasi utama">
            <a href="#tentang">Tentang</a>
            <a href="#proyek">Proyek</a>
            <a href="#pengalaman">Pengalaman</a>
            <a href="#keahlian">Keahlian</a>
            <sakuga-button variant="secondary" onClick={scrollToId("#kontak")}>
              Hubungi Saya
            </sakuga-button>
          </nav>
          <button className="menu-btn" id="menuBtn" aria-label="Buka menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="beranda">
          <div className="hero-bg" aria-hidden="true">
            <span className="orb orb-1"></span>
            <span className="orb orb-2"></span>
            <div className="hero-grid" ref={heroGridRef}>
              {Array.from({ length: HERO_COLS * HERO_ROWS }).map((_, i) => (
                <span key={i} className="hero-cell" data-i={i}></span>
              ))}
            </div>
          </div>
          <div className="container hero-inner">
            <div className="hero-text">
              <p className="eyebrow hero-el"><span className="dot"></span> Portofolio &middot; Demak, Jawa Tengah</p>
              <h1 className="hero-title">
                <span className="line hero-el">{splitLetters("Rangga Figo")}</span>
                <span className="line hero-el">{splitLetters("Hidayat")}<span className="accent">.</span></span>
              </h1>
              <svg className="scribble hero-el" viewBox="0 0 220 14" width="220" height="14" aria-hidden="true">
                <path
                  className="scribble-path"
                  d="M4 9 Q 30 3, 58 8 T 112 8 T 166 8 T 216 7"
                  pathLength={1}
                />
              </svg>
              <p className="hero-role hero-el">Full-Stack Web Developer</p>
              <p className="hero-desc hero-el">Saya membangun aplikasi web yang cepat, rapi, dan bisa dipakai beneran — dari landing page sampai sistem internal instansi. Next.js, React, Laravel, dan database yang terurus.</p>
              <div className="hero-actions hero-el">
                <sakuga-button onClick={scrollToId("#proyek")}>Lihat Proyek</sakuga-button>
                <sakuga-button variant="secondary" onClick={downloadCV}>Unduh CV</sakuga-button>
              </div>
              <dl className="hero-stats hero-el">
                <div><dt>Proyek live</dt><dd><span className="count" data-count="6">0</span>+</dd></div>
                <div><dt>Pengalaman kerja</dt><dd><span className="count" data-count="3">0</span></dd></div>
                <div><dt>Sertifikasi</dt><dd><span className="count" data-count="4">0</span></dd></div>
                <div><dt>IPK</dt><dd>3.81</dd></div>
              </dl>
            </div>
            <div
              className="hero-card hero-el"
              ref={dragRef}
              onPointerDown={handleDragDown}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragUp}
              onPointerCancel={handleDragUp}
            >
              <div className="photo-frame">
                <div className="photo-initials" aria-label="Rangga Figo Hidayat">RF</div>
                <span className="status-badge"><span className="pulse"></span> Open to work</span>
              </div>
              <div className="hero-card-body">
                <p className="hero-card-name">Rangga Figo Hidayat</p>
                <p className="hero-card-meta">S1 Teknik Informatika<br />Universitas Semarang &middot; 2022&ndash;2026</p>
                <div className="chip-row">
                  <span className="chip">Next.js</span>
                  <span className="chip">React</span>
                  <span className="chip">Laravel</span>
                  <span className="chip">MongoDB</span>
                </div>
                <p className="hero-card-hint">coba seret kartunya &mdash; lepas, dia mental balik</p>
              </div>
            </div>
          </div>
          <div className="hero-loops" aria-hidden="true">
            <span className="loop-shape loop-square"></span>
            <span className="loop-shape loop-circle"></span>
            <span className="loop-shape loop-triangle"></span>
          </div>
          <a className="scroll-hint" href="#tentang" aria-label="Scroll ke bawah">Scroll <span>&darr;</span></a>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...SKILLS_TICKER, ...SKILLS_TICKER].map((s, i) => (
              <span key={i} className="marquee-item">
                <span>{s}</span><i>&bull;</i>
              </span>
            ))}
          </div>
        </div>

        {/* TENTANG */}
        <section className="section section-light" id="tentang">
          <div className="container">
            <p className="section-eyebrow reveal">Tentang Saya</p>
            <h2 className="section-title reveal">Developer yang peduli sama <span className="accent">hasil akhir</span>.</h2>
            <div className="about-grid">
              <p className="about-lead reveal">Lulusan S1 Teknik Informatika Universitas Semarang dengan IPK 3.81. Saya sudah mengerjakan aplikasi web untuk bisnis dan instansi — dari sistem presensi berbasis pengenalan wajah, manajemen stok gudang, sampai platform turnamen. Saya terbiasa mengurus semuanya end-to-end: frontend, backend, database, sampai deploy.</p>
              <ul className="about-facts reveal">
                <li><span>Domisili</span><strong>Demak, Jawa Tengah</strong></li>
                <li><span>Pendidikan</span><strong>S1 Teknik Informatika, Universitas Semarang</strong></li>
                <li><span>Email</span><strong><a href="mailto:ranggadanceyong@gmail.com">ranggadanceyong@gmail.com</a></strong></li>
                <li><span>Telepon</span><strong><a href="tel:+6287821589222">0878-2158-9222</a></strong></li>
              </ul>
            </div>

            {/* Doodle: digambar garis demi garis, ala anidoodle */}
            <figure className="doodle-card reveal" id="doodle">
              <svg viewBox="0 0 360 220" role="img" aria-label="Ilustrasi garis laptop dengan kode, digambar stroke demi stroke">
                <g className="doodle-g">
                  <path className="doodle-stroke" pathLength={1} d="M72 50 H248 A12 12 0 0 1 260 62 V158 A12 12 0 0 1 248 170 H72 A12 12 0 0 1 60 158 V62 A12 12 0 0 1 72 50 Z" />
                  <path className="doodle-stroke" pathLength={1} d="M40 184 C 90 192, 230 192, 280 184" />
                  <path className="doodle-stroke" pathLength={1} d="M120 95 L95 112 L120 130" />
                  <path className="doodle-stroke" pathLength={1} d="M148 88 L174 136" />
                  <path className="doodle-stroke" pathLength={1} d="M198 95 L222 112 L198 130" />
                  <path className="doodle-stroke" pathLength={1} d="M292 82 H326 V108 A10 10 0 0 1 316 118 H302 A10 10 0 0 1 292 108 Z" />
                  <path className="doodle-stroke" pathLength={1} d="M326 90 Q 340 94, 326 104" />
                  <path className="doodle-stroke" pathLength={1} d="M302 70 Q 306 62, 302 54" />
                  <path className="doodle-stroke" pathLength={1} d="M314 70 Q 318 62, 314 54" />
                  <path className="doodle-stroke" pathLength={1} d="M30 26 L33 35 L42 38 L33 41 L30 50 L27 41 L18 38 L27 35 Z" />
                  <path className="doodle-stroke" pathLength={1} d="M60 204 Q 90 210, 120 204 T 180 204 T 240 204" />
                </g>
              </svg>
              <figcaption>Digambar garis demi garis, pakai kode — kayak anidoodle.</figcaption>
            </figure>

            <div className="about-cards">
              <article className="mini-card reveal">
                <h3>Frontend</h3>
                <p>Interface responsif yang enak dipakai di HP maupun desktop, dengan perhatian ke performa dan detail.</p>
              </article>
              <article className="mini-card reveal">
                <h3>Backend &amp; API</h3>
                <p>REST API, autentikasi, dan logika bisnis yang rapi — dari Laravel sampai Next.js API Routes.</p>
              </article>
              <article className="mini-card reveal">
                <h3>Database</h3>
                <p>Skema yang dipikirkan dulu sebelum koding: MySQL, PostgreSQL, dan MongoDB.</p>
              </article>
            </div>
          </div>
        </section>

        {/* PROYEK */}
        <section className="section section-dark" id="proyek">
          <div className="container">
            <p className="section-eyebrow reveal">Proyek Pilihan</p>
            <h2 className="section-title reveal">Kerjaan yang sudah <span className="accent">live</span>.</h2>
            <p className="section-sub reveal">Enam proyek yang bisa dibuka dan dicoba langsung. Klik kartunya untuk mengunjungi situsnya.</p>
            <div className="project-grid">
              {PROJECTS.map((p) => (
                <article className="project-card reveal" key={p.name}>
                  <a className="project-thumb" href={p.url} target="_blank" rel="noopener">
                    <img src={p.img} alt={p.alt} loading="lazy" />
                    <span className="project-go" aria-hidden="true">&nearr;</span>
                  </a>
                  <div className="project-body">
                    <h3><a href={p.url} target="_blank" rel="noopener">{p.name}</a></h3>
                    <p>{p.desc}</p>
                    <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PENGALAMAN */}
        <section className="section section-light" id="pengalaman">
          <div className="container">
            <p className="section-eyebrow reveal">Pengalaman</p>
            <h2 className="section-title reveal">Jejak <span className="accent">kerja</span>.</h2>
            <ol className="timeline">
              <li className="reveal">
                <span className="timeline-date">Agu 2026 &ndash; Okt 2026</span>
                <h3>Full-Stack Web Developer</h3>
                <p className="timeline-org">BRIDA Kota Semarang</p>
                <p>Mengembangkan dan memelihara website PPID BRIDA: penyesuaian frontend, pengembangan backend, dan pengelolaan database.</p>
              </li>
              <li className="reveal">
                <span className="timeline-date">Apr 2025 &ndash; Mei 2025</span>
                <h3>Frontend Web Developer (Freelance)</h3>
                <p className="timeline-org">Wiro Coffee, Kab. Semarang</p>
                <p>Membangun landing page responsif Next.js untuk green beans Desa Wirogomo, lengkap dengan galeri produk dan optimasi SEO.</p>
              </li>
              <li className="reveal">
                <span className="timeline-date">Feb 2025 &ndash; Apr 2025</span>
                <h3>Web Developer Magang</h3>
                <p className="timeline-org">BRIDA Kota Semarang</p>
                <p>Membangun sistem presensi digital berbasis web (Next.js + face-api.js) dan mengelola database MongoDB.</p>
              </li>
            </ol>
            <h3 className="cert-title reveal">Sertifikasi</h3>
            <ul className="cert-list reveal">
              <li>Information Technology Specialist (ITS): Databases <span>&middot; Feb 2026</span></li>
              <li>Developing Machine Learning Model to API <span>&middot; Apr 2026</span></li>
              <li>TOEFL Prediction Test <span>&middot; 2023</span></li>
              <li>Business English Course <span>&middot; 2023</span></li>
            </ul>
          </div>
        </section>

        {/* KEAHLIAN */}
        <section className="section section-dark" id="keahlian">
          <div className="container">
            <p className="section-eyebrow reveal">Keahlian</p>
            <h2 className="section-title reveal">Tools yang saya <span className="accent">pakai tiap hari</span>.</h2>
            <div className="skills-grid">
              <article className="skill-group reveal">
                <h3>Bahasa <sakuga-tooltip text="Bahasa pemrograman yang saya pakai tiap hari — dari antarmuka sampai query database." label="Tentang Bahasa" /></h3>
                <ul><li>JavaScript (ES6+)</li><li>TypeScript</li><li>PHP</li><li>SQL</li><li>HTML &amp; CSS</li></ul>
              </article>
              <article className="skill-group reveal">
                <h3>Framework &amp; Runtime <sakuga-tooltip text="Framework dan runtime untuk membangun aplikasi web — dari landing page sampai API." label="Tentang Framework dan Runtime" /></h3>
                <ul><li>Next.js</li><li>React.js</li><li>Node.js</li><li>Laravel</li><li>Svelte</li></ul>
              </article>
              <article className="skill-group reveal">
                <h3>Database <sakuga-tooltip text="Database yang saya kelola — skemanya dipikirkan dulu sebelum koding." label="Tentang Database" /></h3>
                <ul><li>MySQL</li><li>PostgreSQL</li><li>MongoDB</li></ul>
              </article>
              <article className="skill-group reveal">
                <h3>Tools &amp; Lainnya <sakuga-tooltip text="Peralatan kerja sehari-hari: version control, API testing, sampai optimasi database." label="Tentang Tools dan Lainnya" /></h3>
                <ul><li>Git &amp; GitHub</li><li>REST API</li><li>VS Code</li><li>Postman</li><li>Optimasi Database</li></ul>
              </article>
            </div>
          </div>
        </section>

        {/* KONTAK */}
        <section className="section contact" id="kontak">
          <div className="container contact-inner reveal">
            <p className="section-eyebrow">Kontak</p>
            <h2 className="section-title">Punya proyek atau lowongan?<br />Mari ngobrol.</h2>
            <p className="section-sub">Saya sedang mencari peluang kerja full-time. Paling cepat dibalas lewat email atau WhatsApp.</p>
            <div className="contact-actions">
              <sakuga-button onClick={sendEmail}>Kirim Email</sakuga-button>
              <sakuga-button variant="secondary" onClick={openExternal("https://wa.me/6287821589222")}>WhatsApp</sakuga-button>
              <sakuga-button variant="secondary" onClick={openExternal("https://github.com/ranggacey")}>GitHub</sakuga-button>
              <sakuga-button variant="secondary" onClick={copyEmail}>Salin Email</sakuga-button>
            </div>
            <div className="contact-dots-wrap reveal">
              <p className="contact-dots-hint">klik titiknya — gelombangnya nyebar</p>
              <div className="dot-grid" ref={dotGridRef} onClick={handleDotClick} role="button" aria-label="Grid titik interaktif">
                {Array.from({ length: DOT_COLS * DOT_ROWS }).map((_, i) => (
                  <span key={i} className="dot" data-i={i}></span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>&copy; <span id="year">2026</span> Rangga Figo Hidayat &middot; Demak, Jawa Tengah</p>
          <p><a href="https://ranggafigo.blog" target="_blank" rel="noopener">ranggafigo.blog</a></p>
        </div>
      </footer>

      {/* Sakuga toast: umpan balik aksi (mis. salin email) — pojok kiri bawah */}
      <sakuga-toast ref={toastRef} style={{ position: "fixed", left: 24, bottom: 84, zIndex: 100 }} />
    </>
  );
}
