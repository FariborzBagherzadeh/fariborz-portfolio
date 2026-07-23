"use client";

import { type ReactNode, useEffect, useRef } from "react";

export function MotionStyles() {
  return (
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
      .aurora {
        pointer-events: none;
        position: fixed;
        z-index: 0;
        width: 34rem;
        height: 34rem;
        border-radius: 999px;
        filter: blur(80px);
        opacity: 0.22;
      }
      .aurora-one {
        top: -12rem;
        right: -12rem;
        background: #60a5fa;
      }
      .aurora-two {
        left: -16rem;
        top: 42rem;
        background: #c4b5fd;
      }
      .motion-grid {
        pointer-events: none;
        position: fixed;
        inset: 0;
        z-index: 0;
        opacity: 0.45;
        background-image:
          linear-gradient(rgba(148, 163, 184, 0.11) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148, 163, 184, 0.11) 1px, transparent 1px);
        background-size: 40px 40px;
        mask-image: linear-gradient(to bottom, black, transparent 55%);
      }
      .motion-aurora-one {
        animation: drift-one 16s ease-in-out infinite alternate;
      }
      .motion-aurora-two {
        animation: drift-two 20s ease-in-out infinite alternate;
      }
      @keyframes drift-one {
        to {
          transform: translate(-5%, 8%) scale(1.1);
        }
      }
      @keyframes drift-two {
        to {
          transform: translate(12%, -6%) scale(0.93);
        }
      }
      .header-shell {
        border: 1px solid rgba(226, 232, 240, 0.85);
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.82);
        box-shadow: 0 10px 32px rgba(15, 23, 42, 0.07);
        backdrop-filter: blur(16px);
      }
      .nav-link {
        position: relative;
        transition: color 0.2s ease;
      }
      .nav-link::after {
        content: "";
        position: absolute;
        right: 0;
        bottom: -0.55rem;
        left: 0;
        height: 2px;
        border-radius: 99px;
        background: #2563eb;
        transform: scaleX(0);
        transition: transform 0.2s ease;
      }
      .nav-link:hover {
        color: #1d4ed8;
      }
      .nav-link:hover::after {
        transform: scaleX(1);
      }
      .hero-kicker {
        animation: rise 0.55s both ease-out;
      }
      .hero-role {
        animation: rise 0.65s 0.06s both ease-out;
      }
      .hero-title {
        animation: rise 0.75s 0.12s both cubic-bezier(0.16, 1, 0.3, 1);
      }
      .hero-body {
        animation: rise 0.75s 0.2s both cubic-bezier(0.16, 1, 0.3, 1);
      }
      .hero-actions {
        animation: rise 0.75s 0.27s both cubic-bezier(0.16, 1, 0.3, 1);
      }
      .profile-photo-card {
        animation:
          photo-in 0.8s 0.15s both cubic-bezier(0.16, 1, 0.3, 1),
          soft-float 7s 1s ease-in-out infinite;
        box-shadow: 0 28px 65px rgba(30, 64, 175, 0.16);
      }
      .profile-photo-frame {
        overflow: hidden;
        border-radius: 1rem;
        background: linear-gradient(135deg, #dbeafe, #ede9fe);
      }
      .profile-photo {
        height: 100%;
        width: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .profile-photo-card:hover .profile-photo {
        transform: scale(1.045);
      }
      @keyframes rise {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes photo-in {
        from {
          opacity: 0;
          transform: translate3d(22px, 22px, 0) scale(0.96);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes soft-float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-7px);
        }
      }
      .section-shell {
        position: relative;
        z-index: 10;
        margin: 0 auto;
        max-width: 80rem;
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
        left: 1.5rem;
        right: 1.5rem;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          #cbd5e1 12%,
          #cbd5e1 88%,
          transparent
        );
      }
      @media (min-width: 1024px) {
        .section-rule::before {
          left: 2rem;
          right: 2rem;
        }
      }
      .glass-card {
        border: 1px solid rgba(226, 232, 240, 0.9);
        border-radius: 1.25rem;
        background: rgba(255, 255, 255, 0.82);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.045);
        backdrop-filter: blur(12px);
      }
      .lift-card,
      .skill-card,
      .project-card {
        transition:
          transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.3s ease,
          border-color 0.3s ease;
      }
      .lift-card:hover,
      .skill-card:hover,
      .project-card:hover {
        transform: translateY(-5px);
        border-color: rgba(96, 165, 250, 0.38);
        box-shadow: 0 24px 45px rgba(30, 64, 175, 0.11);
      }
      .primary-cta,
      .secondary-cta {
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }
      .primary-cta:hover {
        transform: translateY(-3px);
        box-shadow: 0 17px 30px rgba(15, 23, 42, 0.23);
      }
      .secondary-cta:hover {
        transform: translateY(-3px);
        box-shadow: 0 14px 25px rgba(15, 23, 42, 0.08);
      }
      .skill-tag {
        transition:
          transform 0.18s ease,
          background-color 0.18s ease,
          border-color 0.18s ease;
      }
      .skill-tag:hover {
        transform: translateY(-2px);
        border-color: #bfdbfe;
        background: #dbeafe;
      }
      .inline-link {
        transition:
          color 0.2s ease,
          transform 0.2s ease;
      }
      .inline-link:hover {
        transform: translateX(3px);
        color: #1d4ed8;
      }
      .icon-tile {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        height: 2.75rem;
        width: 2.75rem;
        border-radius: 0.85rem;
      }
      .icon-tile-0 {
        color: #1d4ed8;
        background: #dbeafe;
      }
      .icon-tile-1 {
        color: #7c3aed;
        background: #ede9fe;
      }
      .icon-tile-2 {
        color: #047857;
        background: #d1fae5;
      }
      .icon-tile-3 {
        color: #b45309;
        background: #fef3c7;
      }
      .timeline {
        position: relative;
        padding-left: 1.25rem;
      }
      .timeline::before {
        content: "";
        position: absolute;
        top: 1rem;
        bottom: 1rem;
        left: 0.55rem;
        width: 1px;
        background: #cbd5e1;
      }
      .timeline-item {
        position: relative;
        padding: 0 0 1.25rem 1.75rem;
      }
      .timeline-item:last-child {
        padding-bottom: 0;
      }
      .timeline-dot {
        position: absolute;
        z-index: 1;
        left: 0;
        top: 1.5rem;
        display: flex;
        height: 2.2rem;
        width: 2.2rem;
        align-items: center;
        justify-content: center;
        border: 4px solid #f8fafc;
        border-radius: 999px;
        background: #2563eb;
        color: white;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.28);
      }
      .contact-card::after {
        content: "";
        position: absolute;
        right: -7rem;
        top: -9rem;
        height: 23rem;
        width: 23rem;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(96, 165, 250, 0.38),
          transparent 68%
        );
      }
      .icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 3.2rem;
        width: 3.2rem;
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-radius: 0.75rem;
        color: #fff;
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      }
      .icon-button:hover {
        transform: translateY(-3px);
        background: rgba(255, 255, 255, 0.1);
      }
      .reveal {
        opacity: 0;
        transform: translateY(22px);
        transition:
          opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .reveal-visible {
        opacity: 1;
        transform: none;
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
      { threshold: 0.1 },
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
