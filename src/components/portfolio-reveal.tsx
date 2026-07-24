"use client";

import { type ReactNode, useEffect, useRef } from "react";

export function MotionStyles() {
  useEffect(() => {
    const navigation = document.querySelector<HTMLElement>(
      "header:has(.header-shell)",
    );

    if (!navigation) return;

    let previousY = window.scrollY;
    let frame = 0;

    const updateNavigation = () => {
      const currentY = window.scrollY;
      const distance = currentY - previousY;

      navigation.classList.toggle("nav-scrolled", currentY > 16);

      if (currentY < 96 || distance < -4) {
        navigation.classList.remove("nav-hidden");
      } else if (currentY > 160 && distance > 4) {
        navigation.classList.add("nav-hidden");
      }

      previousY = currentY;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
        background: #f7f8fc;
      }
      .portfolio-main {
        background:
          radial-gradient(
            circle at 80% -10%,
            rgba(96, 165, 250, 0.17),
            transparent 29rem
          ),
          radial-gradient(
            circle at -5% 38%,
            rgba(196, 181, 253, 0.15),
            transparent 27rem
          ),
          #f7f8fc;
      }
      .aurora {
        pointer-events: none;
        position: fixed;
        z-index: 0;
        width: 34rem;
        height: 34rem;
        border-radius: 999px;
        filter: blur(84px);
        opacity: 0.17;
      }
      .aurora-one {
        top: -12rem;
        right: -13rem;
        background: #60a5fa;
      }
      .aurora-two {
        left: -17rem;
        top: 38rem;
        background: #c4b5fd;
      }
      .motion-grid {
        pointer-events: none;
        position: fixed;
        inset: 0;
        z-index: 0;
        opacity: 0.22;
        background-image:
          linear-gradient(rgba(71, 85, 105, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(71, 85, 105, 0.07) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: linear-gradient(to bottom, black, transparent 58%);
      }
      .motion-aurora-one {
        animation: drift-one 17s ease-in-out infinite alternate;
      }
      .motion-aurora-two {
        animation: drift-two 21s ease-in-out infinite alternate;
      }
      @keyframes drift-one {
        from {
          transform: translate3d(-2%, -1%, 0) scale(1);
        }
        to {
          transform: translate3d(7%, 5%, 0) scale(1.13);
        }
      }
      @keyframes drift-two {
        from {
          transform: translate3d(1%, 0, 0) scale(1.04);
        }
        to {
          transform: translate3d(-8%, -6%, 0) scale(0.94);
        }
      }
      .header-shell {
        border: 1px solid rgba(226, 232, 240, 0.88);
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.88);
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.07);
        backdrop-filter: blur(16px);
        transition:
          padding 0.3s cubic-bezier(0.16, 1, 0.3, 1),
          background-color 0.3s ease,
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }
      .brand-mark {
        transition: transform 0.25s ease;
      }
      .brand-mark:hover {
        transform: rotate(-5deg) scale(1.06);
      }
      header nav a {
        position: relative;
        transition: color 0.2s ease;
      }
      header nav a::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -7px;
        width: 100%;
        height: 2px;
        border-radius: 999px;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.25s ease;
        background: #2563eb;
      }
      header nav a:hover {
        color: #1d4ed8;
      }
      header nav a:hover::after {
        transform: scaleX(1);
        transform-origin: left;
      }
      .hero-kicker {
        animation: rise-in 0.55s both ease-out;
      }
      .hero-title {
        animation: rise-in 0.7s 0.08s both cubic-bezier(0.16, 1, 0.3, 1);
      }
      .hero-role {
        animation: rise-in 0.7s 0.18s both cubic-bezier(0.16, 1, 0.3, 1);
      }
      .hero-body {
        animation: rise-in 0.7s 0.28s both cubic-bezier(0.16, 1, 0.3, 1);
      }
      .hero-actions {
        animation: rise-in 0.7s 0.38s both cubic-bezier(0.16, 1, 0.3, 1);
      }
      .focus-card {
        animation:
          float-in 0.8s 0.32s both cubic-bezier(0.16, 1, 0.3, 1),
          float-card 5.5s 1.2s ease-in-out infinite;
      }
      .profile-photo-card {
        position: relative;
        width: min(100%, 22rem);
        animation:
          float-in 0.8s 0.24s both cubic-bezier(0.16, 1, 0.3, 1),
          float-card 6.5s 1.1s ease-in-out infinite;
      }
      .profile-photo-ring {
        padding: 0.55rem;
        border-radius: 999px;
        background: linear-gradient(
          140deg,
          #2563eb 0%,
          #60a5fa 48%,
          #c4b5fd 100%
        );
        box-shadow:
          0 26px 52px rgba(30, 64, 175, 0.25),
          0 0 0 8px rgba(255, 255, 255, 0.72);
      }
      .profile-photo-frame {
        position: relative;
        overflow: hidden;
        border: 5px solid #fff;
        border-radius: 999px;
        aspect-ratio: 1 / 1;
        background: #dbeafe;
      }
      .profile-photo-frame::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.18),
          transparent 45%,
          rgba(37, 99, 235, 0.1)
        );
        pointer-events: none;
      }
      .profile-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .profile-photo-card:hover .profile-photo {
        transform: scale(1.055);
      }
      @keyframes rise-in {
        from {
          opacity: 0;
          transform: translateY(22px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes float-in {
        from {
          opacity: 0;
          transform: translate3d(26px, 22px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      @keyframes float-card {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }
      .primary-cta,
      .secondary-cta {
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease,
          background-color 0.25s ease,
          border-color 0.25s ease;
      }
      .primary-cta:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 18px 35px rgba(37, 99, 235, 0.28);
      }
      .primary-cta span {
        display: inline-block;
        transition: transform 0.2s ease;
      }
      .primary-cta:hover span {
        transform: translateX(4px);
      }
      .secondary-cta:hover {
        transform: translateY(-4px);
        border-color: #bfdbfe;
        color: #1d4ed8;
        box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
      }
      .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition:
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .reveal-visible {
        opacity: 1;
        transform: translateY(0);
      }
      .glass-card {
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 1.2rem;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 9px 24px rgba(15, 23, 42, 0.045);
        backdrop-filter: blur(8px);
      }
      .section-shell {
        position: relative;
        z-index: 10;
        max-width: 80rem;
        margin: 0 auto;
        padding: 5.5rem 1.5rem;
      }
      @media (min-width: 1024px) {
        .section-shell {
          padding-right: 2rem;
          padding-left: 2rem;
        }
      }
      .section-rule::before {
        content: "";
        position: absolute;
        top: 0;
        right: 1.5rem;
        left: 1.5rem;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          #cbd5e1 13%,
          #cbd5e1 87%,
          transparent
        );
      }
      @media (min-width: 1024px) {
        .section-rule::before {
          right: 2rem;
          left: 2rem;
        }
      }
      .lift-card {
        transition:
          transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.35s ease,
          border-color 0.35s ease;
      }
      .lift-card:hover {
        transform: translateY(-6px);
        border-color: rgba(96, 165, 250, 0.55);
        box-shadow: 0 22px 42px rgba(30, 64, 175, 0.11);
      }
      .project-card {
        transition:
          transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.35s ease;
      }
      .project-card:hover {
        transform: translateY(-7px);
        box-shadow: 0 25px 46px rgba(30, 64, 175, 0.13);
      }
      .project-line {
        transform-origin: left;
        transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .project-card:hover .project-line {
        transform: scaleX(0.76);
      }
      .skill-tag {
        transition:
          transform 0.2s ease,
          background-color 0.2s ease,
          border-color 0.2s ease;
      }
      .skill-tag:hover {
        transform: translateY(-2px);
        background: #dbeafe;
        border-color: #bfdbfe;
      }
      .inline-link {
        transition:
          color 0.2s ease,
          transform 0.2s ease;
      }
      .inline-link:hover {
        color: #1d4ed8;
        transform: translateX(3px);
      }
      .contact-card {
        position: relative;
        overflow: hidden;
      }
      .contact-card::after {
        content: "";
        position: absolute;
        width: 18rem;
        height: 18rem;
        right: -6rem;
        top: -11rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.13);
        filter: blur(2px);
        animation: contact-orb 8s ease-in-out infinite alternate;
      }
      @keyframes contact-orb {
        to {
          transform: translate(-60px, 80px) scale(1.18);
        }
      }

      /* Cobalt Studio — a light, high-contrast palette for long-form reading. */
      html {
        background: #f8fafc;
        color-scheme: light;
        scroll-padding-top: 6.5rem;
      }
      body {
        background: #f8fafc;
      }
      .portfolio-main {
        color: #172033;
        background:
          radial-gradient(
            circle at 82% -10%,
            rgba(96, 165, 250, 0.22),
            transparent 32rem
          ),
          radial-gradient(
            circle at -8% 38%,
            rgba(191, 219, 254, 0.42),
            transparent 28rem
          ),
          #f8fafc !important;
      }
      .aurora {
        opacity: 0.22;
      }
      .aurora-one {
        background: #60a5fa;
      }
      .aurora-two {
        background: #93c5fd;
      }
      .motion-grid {
        opacity: 0.32;
        background-image:
          linear-gradient(rgba(30, 64, 175, 0.075) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30, 64, 175, 0.075) 1px, transparent 1px);
      }
      .header-shell {
        border-color: rgba(148, 163, 184, 0.58);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 14px 38px rgba(15, 23, 42, 0.1);
      }
      /* Keep only the portfolio navigation in view while section links scroll. */
      header:has(.header-shell) {
        position: sticky;
        top: 0.75rem;
        z-index: 70;
        padding: 0 1.5rem;
        will-change: transform;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      header:has(.header-shell) .header-shell {
        background: rgba(255, 255, 255, 0.96);
        border-color: rgba(96, 165, 250, 0.45);
        box-shadow: 0 16px 42px rgba(15, 23, 42, 0.13);
      }
      header:has(.header-shell).nav-scrolled .header-shell {
        background: rgba(255, 255, 255, 0.98);
        border-color: rgba(59, 130, 246, 0.48);
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16);
      }
      header:has(.header-shell).nav-hidden {
        pointer-events: none;
        transform: translateY(calc(-100% - 1.5rem));
      }
      .portfolio-main .brand-mark,
      .portfolio-main .text-slate-950,
      .portfolio-main .text-slate-900,
      .portfolio-main .text-slate-800,
      .portfolio-main .text-slate-700 {
        color: #0f172a !important;
      }
      .portfolio-main .text-slate-600,
      .portfolio-main .text-slate-500 {
        color: #475569 !important;
      }
      .portfolio-main .text-slate-300 {
        color: #64748b !important;
      }
      .portfolio-main .text-blue-700,
      .portfolio-main .text-blue-600 {
        color: #1d4ed8 !important;
      }
      .portfolio-main .text-blue-200 {
        color: #bfdbfe !important;
      }
      .portfolio-main .border-slate-200,
      .portfolio-main .border-slate-200\/80 {
        border-color: rgba(148, 163, 184, 0.6) !important;
      }
      .portfolio-main .divide-slate-200\/80 > :not([hidden]) ~ :not([hidden]) {
        border-color: rgba(148, 163, 184, 0.6) !important;
      }
      .portfolio-main .bg-white,
      .portfolio-main .bg-white\/80,
      .portfolio-main .bg-white\/95,
      .portfolio-main .bg-slate-50,
      .portfolio-main .bg-slate-100 {
        background-color: #ffffff !important;
      }
      .portfolio-main .bg-slate-950 {
        background-color: #0f172a !important;
      }
      .portfolio-main .bg-blue-50,
      .portfolio-main .bg-blue-50\/80 {
        background-color: #dbeafe !important;
      }
      .portfolio-main .bg-violet-100 {
        background-color: #ede9fe !important;
      }
      .portfolio-main .bg-emerald-50 {
        background-color: #ecfdf5 !important;
      }
      .portfolio-main .border-emerald-200 {
        border-color: #a7f3d0 !important;
      }
      .portfolio-main .text-emerald-700 {
        color: #047857 !important;
      }
      .portfolio-main .bg-emerald-100 {
        background-color: #d1fae5 !important;
      }
      .portfolio-main .bg-amber-100 {
        background-color: #fef3c7 !important;
      }
      .portfolio-main .text-amber-700,
      .portfolio-main .text-amber-800 {
        color: #92400e !important;
      }
      .portfolio-main .bg-blue-600 {
        background-color: #2563eb !important;
      }
      .portfolio-main .hover\:bg-blue-700:hover {
        background-color: #1d4ed8 !important;
      }
      header nav a {
        color: #334155 !important;
      }
      header nav a:hover {
        color: #1d4ed8 !important;
      }
      header nav a::after {
        background: #2563eb;
      }
      .hero-kicker {
        box-shadow:
          0 0 0 1px rgba(16, 185, 129, 0.12),
          0 8px 28px rgba(5, 150, 105, 0.12);
      }
      .hero-role {
        color: #1d4ed8 !important;
      }
      .primary-cta {
        background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
        box-shadow: 0 16px 34px rgba(37, 99, 235, 0.24) !important;
      }
      .primary-cta:hover {
        box-shadow: 0 20px 42px rgba(37, 99, 235, 0.34) !important;
      }
      .secondary-cta {
        border-color: #bfdbfe !important;
        background: #ffffff !important;
        color: #1e293b !important;
      }
      .secondary-cta:hover {
        border-color: #60a5fa !important;
        color: #1d4ed8 !important;
        box-shadow: 0 14px 28px rgba(30, 64, 175, 0.12);
      }
      .glass-card {
        border-color: rgba(203, 213, 225, 0.92);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
      }
      .lift-card:hover {
        border-color: rgba(96, 165, 250, 0.82);
        box-shadow: 0 24px 48px rgba(30, 64, 175, 0.14);
      }
      .project-card:hover {
        box-shadow: 0 27px 52px rgba(30, 64, 175, 0.16);
      }
      .section-rule::before {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(148, 163, 184, 0.7) 13%,
          rgba(148, 163, 184, 0.7) 87%,
          transparent
        );
      }
      .profile-photo-ring {
        background: linear-gradient(
          140deg,
          #60a5fa 0%,
          #2563eb 52%,
          #4f46e5 100%
        );
        box-shadow:
          0 26px 56px rgba(37, 99, 235, 0.22),
          0 0 0 8px rgba(255, 255, 255, 0.9);
      }
      .profile-photo-frame {
        border-color: #ffffff;
        background: #dbeafe;
      }
      .hero-floating-note {
        border-color: rgba(203, 213, 225, 0.92) !important;
        background: rgba(255, 255, 255, 0.97) !important;
        box-shadow: 0 18px 38px rgba(15, 23, 42, 0.13) !important;
      }
      .skill-tag {
        border-color: #bfdbfe !important;
        background: #eff6ff !important;
        color: #1e40af !important;
      }
      .skill-tag:hover {
        background: #dbeafe !important;
        border-color: #60a5fa !important;
      }
      .icon-tile {
        display: inline-flex;
        height: 2.75rem;
        width: 2.75rem;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        border: 1px solid #bfdbfe;
        border-radius: 0.8rem;
        background: #eff6ff;
        color: #1d4ed8;
      }
      .icon-tile-1 {
        border-color: #bfdbfe;
        background: #eff6ff;
        color: #2563eb;
      }
      .icon-tile-2 {
        border-color: #ddd6fe;
        background: #f5f3ff;
        color: #6d28d9;
      }
      .icon-tile-3 {
        border-color: #99f6e4;
        background: #f0fdfa;
        color: #0f766e;
      }
      .timeline {
        position: relative;
        padding-left: 2.5rem;
      }
      .timeline::before {
        content: "";
        position: absolute;
        top: 0.75rem;
        bottom: 0.75rem;
        left: 0.68rem;
        width: 1px;
        background: linear-gradient(#2563eb, rgba(147, 197, 253, 0.3));
      }
      .timeline-item {
        position: relative;
        padding-bottom: 1.25rem;
      }
      .timeline-dot {
        position: absolute;
        z-index: 1;
        left: -2.5rem;
        top: 1.4rem;
        display: inline-flex;
        height: 2.35rem;
        width: 2.35rem;
        align-items: center;
        justify-content: center;
        border: 1px solid #93c5fd;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        box-shadow: 0 0 0 5px #f8fafc;
      }
      .inline-link {
        color: #1d4ed8 !important;
      }
      .inline-link:hover {
        color: #1e40af !important;
      }
      .contact-card {
        border: 1px solid rgba(37, 99, 235, 0.4);
        background: linear-gradient(
          120deg,
          #0f172a,
          #1e3a8a 58%,
          #1d4ed8
        ) !important;
        box-shadow: 0 28px 60px rgba(30, 64, 175, 0.28);
      }
      .contact-card::after {
        background: rgba(147, 197, 253, 0.18);
      }
      .icon-button {
        display: inline-flex;
        height: 3.1rem;
        width: 3.1rem;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(219, 234, 254, 0.5);
        border-radius: 0.75rem;
        color: #eff6ff;
        transition:
          transform 0.2s ease,
          background-color 0.2s ease;
      }
      .icon-button:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.16);
      }
      @media (max-width: 640px) {
        header:has(.header-shell) {
          top: 0.25rem;
          padding: 0 0.75rem;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .reveal {
          opacity: 1;
          transform: none;
        }
        header:has(.header-shell) {
          transition: none;
        }
        header:has(.header-shell).nav-hidden {
          transform: none;
          pointer-events: auto;
        }
      }
    `}</style>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = element.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          target.classList.add("reveal-visible");
          observer.unobserve(target);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={element}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
