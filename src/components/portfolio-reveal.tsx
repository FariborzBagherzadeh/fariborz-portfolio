"use client";

import { type ReactNode, useEffect, useRef } from "react";

export function MotionStyles() {
  return (
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
      .motion-grid {
        pointer-events: none;
        position: fixed;
        inset: 0;
        z-index: 0;
        opacity: 0.35;
        background-image:
          linear-gradient(rgba(37, 99, 235, 0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(37, 99, 235, 0.045) 1px, transparent 1px);
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
      .brand-mark {
        transition: transform 0.25s ease;
      }
      .brand-mark:hover {
        transform: rotate(-8deg) scale(1.08);
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
        background: linear-gradient(90deg, #2563eb, #8b5cf6);
      }
      header nav a:hover {
        color: #2563eb;
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
      .lift-card {
        transition:
          transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.35s ease,
          border-color 0.35s ease;
      }
      .lift-card:hover {
        transform: translateY(-7px);
        border-color: rgba(96, 165, 250, 0.42);
        box-shadow: 0 24px 45px rgba(30, 64, 175, 0.12);
      }
      .project-card {
        transition:
          transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.35s ease;
      }
      .project-card:hover {
        transform: translateY(-9px);
        box-shadow: 0 28px 52px rgba(30, 64, 175, 0.16);
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
          background-color 0.2s ease;
      }
      .skill-tag:hover {
        transform: translateY(-3px);
        background: #dbeafe;
      }
      .inline-link {
        transition:
          color 0.2s ease,
          transform 0.2s ease;
      }
      .inline-link:hover {
        color: #1e40af;
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
