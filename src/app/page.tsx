import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { MotionStyles, Reveal } from "@/components/portfolio-reveal";
import { ProfilePhoto } from "@/components/profile-photo";

type Project = {
  id: number;
  title: string;
  summary: string;
  tech_stack: string[];
  demo_url: string | null;
  repository_url: string | null;
  is_featured: boolean;
};
type ProfileContent = {
  name?: string;
  role?: string;
  hero_description?: string;
  about?: string;
  email?: string;
  github_url?: string;
  linkedin_url?: string;
  availability?: string;
};
type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
};
type LanguageItem = { language: string; proficiency: string };
type SkillGroup = { title: string; skills: string[] };
type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details: string;
};
type Publication = {
  title: string;
  date: string;
  status: "Published" | "Submitted";
  doi: string;
};
type Certification = { name: string; issuer: string };
type ResumeContent = {
  experience: ExperienceItem[];
  languages: LanguageItem[];
  skill_groups: SkillGroup[];
  education: EducationItem[];
  publications: Publication[];
  certifications: Certification[];
};

const fallbackProfile: Required<ProfileContent> = {
  name: "Fariborz Bagherzadeh",
  role: "Full-stack developer",
  hero_description:
    "Building responsive interfaces, useful APIs, and reliable data-driven products.",
  about:
    "I combine full-stack web development with experience in data workflows and renewable-energy analytics. I enjoy transforming complex needs into clear, responsive, and maintainable software.",
  email: "fariborzbagherzad@gmail.com",
  github_url: "https://github.com/FariborzBagherzadeh",
  linkedin_url: "https://www.linkedin.com/in/fariborzbagherzadeh",
  availability: "Available immediately",
};
const fallbackResume: Required<ResumeContent> = {
  experience: [
    {
      role: "AI Software Engineer (Part-time)",
      company: "TU Berlin – Hermann-Rietschel-Institut",
      location: "Berlin, Germany",
      period: "Sep 2024 – Jun 2026",
      description:
        "Developed data and machine-learning workflows for energy-load forecasting and research applications.",
    },
    {
      role: "Software Developer (Freelance)",
      company: "Self-employed",
      location: "Remote",
      period: "Oct 2019 – Jan 2021",
      description:
        "Built web applications and practical software solutions for clients.",
    },
  ],
  languages: [
    { language: "English", proficiency: "C2" },
    { language: "German", proficiency: "B2 (currently in a course)" },
  ],
  skill_groups: [
    {
      title: "AI & LLM Engineering",
      skills: [
        "React js",
        "Javascript",
        "TensorFlow",
        "Hugging Face",
        "LangChain",
        "RAG",
        "LLM APIs",
      ],
    },
    {
      title: "Software & APIs",
      skills: [
        "TypeScript",
        "JavaScript",
        "Node.js",
        "Express",
        "REST APIs",
        "PostgreSQL",
        "SQL",
      ],
    },
    {
      title: "MLOps & Quality",
      skills: [
        "MLflow",
        "Docker",
        "Git",
        "GitHub Actions",
        "CI/CD",
        "Drift detection",
      ],
    },
    {
      title: "Data & Cloud",
      skills: [
        "pandas",
        "NumPy",
        "scikit-learn",
        "PySpark",
        "Databricks",
        "Azure",
        "Google Cloud",
      ],
    },
  ],
  education: [
    {
      degree: "M.Sc. Artificial Intelligence | GPA: 1.8",
      institution: "Brandenburg University of Technology Cottbus-Senftenberg",
      location: "Cottbus-Senftenberg, Germany",
      period: "Oct 2022 – Mar 2026",
      details: "Master's degree in Artificial Intelligence.",
    },
    {
      degree: "B.Sc. Computer Science",
      institution: "Khayyam University",
      location: "Mashhad, Iran",
      period: "Sep 2017 – Feb 2021",
      details: "Bachelor's degree in Computer Science.",
    },
  ],
  publications: [
    {
      title:
        "Influence of Occupancy Data on Heating and Electricity Load Forecasting Using Machine Learning",
      date: "May 2025",
      status: "Published",
      doi: "",
    },
    {
      title:
        "Comparative Evaluation of Drift Detection Methods for Incremental Fine-Tuning in Heat Load Forecasting",
      date: "2026",
      status: "Submitted",
      doi: "",
    },
  ],
  certifications: [
    {
      name: "Microsoft Azure Fundamentals (AZ-900)",
      issuer: "Coursera / Microsoft Azure",
    },
  ],
};

async function getHomeData() {
  const supabase = await createClient();
  const [projectsResult, profileResult, resumeResult] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "id, title, summary, tech_stack, demo_url, repository_url, is_featured",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("content_blocks")
      .select("content")
      .eq("section_key", "profile")
      .eq("is_published", true)
      .maybeSingle(),
    supabase
      .from("content_blocks")
      .select("content")
      .eq("section_key", "resume")
      .eq("is_published", true)
      .maybeSingle(),
  ]);
  return {
    projects: (projectsResult.data ?? []) as Project[],
    profile: {
      ...fallbackProfile,
      ...((profileResult.data?.content ?? {}) as ProfileContent),
    },
    resume: mergeResume(resumeResult.data?.content),
  };
}

export default async function Home() {
  const { projects, profile, resume } = await getHomeData();
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7faff] text-slate-900">
      <MotionStyles />
      <div className="aurora aurora-one motion-aurora-one" />
      <div className="aurora aurora-two motion-aurora-two" />
      <div className="motion-grid" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <a href="#top" className="brand-mark text-xl font-bold tracking-tight">
          FB<span className="text-blue-600">.</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <section
        id="top"
        className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-28 lg:pt-20"
      >
        <div className="max-w-3xl hero-copy">
          <p className="hero-kicker text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            {profile.availability}
          </p>
          <h1 className="hero-title mt-5 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="hero-role mt-5 text-xl font-semibold text-blue-700 sm:text-2xl">
            {profile.role}
          </p>
          <p className="hero-body mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {profile.hero_description}
          </p>
          <div className="hero-actions mt-9 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="primary-cta rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              Explore my work <span>→</span>
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="secondary-cta rounded-full border border-slate-200 bg-white/70 px-6 py-3 font-semibold text-slate-800"
            >
              Get in touch
            </a>
          </div>
        </div>
        <aside className="glass-card focus-card self-start p-7 md:p-8">
          <img
            src="/profile.jpg"
            alt={`Portrait of ${profile.name}`}
            className="h-[360px] w-full rounded-2xl object-cover object-center"
          />
        </aside>
      </section>
      <Reveal>
        <section
          id="about"
          className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8"
        >
          <SectionTitle
            eyebrow="About"
            title="Useful software, thoughtfully built."
          />
          <div className="glass-card lift-card mt-10 max-w-4xl p-7 md:p-9">
            <p className="text-lg leading-8 text-slate-600">{profile.about}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {resume.skill_groups
                .flatMap((group) => group.skills)
                .slice(0, 6)
                .map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section
          id="experience"
          className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8"
        >
          <SectionTitle
            eyebrow="Experience"
            title="Building software and applied AI."
          />
          <div className="mt-10 grid gap-6">
            {resume.experience.map((item, index) => (
              <Reveal key={`${item.company}-${index}`} delay={index * 90}>
                <article className="glass-card lift-card p-7 md:p-8">
                  <ExperienceContent item={item} />
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section
          id="education"
          className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8"
        >
          <SectionTitle
            eyebrow="Education"
            title="A foundation in computer science and AI."
          />
          <div className="mt-10 grid gap-6">
            {resume.education.map((item, index) => (
              <Reveal key={`${item.institution}-${index}`} delay={index * 90}>
                <article className="glass-card lift-card p-7 md:p-8">
                  <EducationContent item={item} />
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section
          id="skills"
          className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8"
        >
          <SectionTitle
            eyebrow="Skills"
            title="Tools I use to turn ideas into reliable products."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {resume.skill_groups.map((group, index) => (
              <Reveal key={group.title} delay={index * 90}>
                <article className="glass-card lift-card h-full p-7">
                  <h3 className="text-xl font-bold">{group.title}</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section
          id="languages"
          className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8"
        >
          <SectionTitle
            eyebrow="Languages"
            title="Communicating across cultures."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {resume.languages.map((item, index) => (
              <Reveal key={item.language} delay={index * 90}>
                <article className="glass-card lift-card p-7">
                  <h3 className="text-xl font-bold">{item.language}</h3>
                  <p className="mt-3 font-semibold text-blue-600">
                    {item.proficiency}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section
          id="projects"
          className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8"
        >
          <SectionTitle
            eyebrow="Selected work"
            title="Projects from the portfolio."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {projects.length === 0 ? (
              <div className="glass-card p-7 text-slate-600 md:col-span-2">
                Published projects will appear here soon.
              </div>
            ) : (
              projects.map((project, index) => (
                <Reveal key={project.id} delay={index * 100}>
                  <article className="glass-card project-card group h-full overflow-hidden p-7">
                    <div
                      className={`project-line h-2 rounded-full ${index % 2 === 0 ? "bg-gradient-to-r from-blue-500 to-cyan-400" : "bg-gradient-to-r from-violet-500 to-fuchsia-400"}`}
                    />
                    <p className="mt-7 text-sm font-semibold text-blue-600">
                      {project.is_featured
                        ? "Featured work"
                        : "Portfolio project"}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">{project.title}</h3>
                    <p className="mt-4 leading-7 text-slate-600">
                      {project.summary}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </div>
                    {(project.demo_url || project.repository_url) && (
                      <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-link text-blue-600"
                          >
                            View demo ↗
                          </a>
                        )}
                        {project.repository_url && (
                          <a
                            href={project.repository_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-link text-blue-600"
                          >
                            View repository ↗
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                </Reveal>
              ))
            )}
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <SectionTitle
            eyebrow="Research & credentials"
            title="Learning, testing, and refining."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="glass-card lift-card p-7">
              <h3 className="text-xl font-bold">Publications</h3>
              <div className="mt-5 divide-y divide-slate-200/70">
                {resume.publications.map((publication) => (
                  <article key={publication.title} className="py-5 first:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${publication.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {publication.status}
                      </span>
                      <p className="text-sm font-semibold text-blue-600">
                        {publication.date}
                      </p>
                    </div>
                    <h4 className="mt-3 leading-7 font-bold">
                      {publication.title}
                    </h4>
                    {publication.doi && (
                      <a
                        href={doiHref(publication.doi)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-link mt-3 inline-block text-sm font-semibold text-blue-600"
                      >
                        DOI: {publication.doi} ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
            <div className="glass-card lift-card p-7">
              <h3 className="text-xl font-bold">Certifications</h3>
              <div className="mt-5 divide-y divide-slate-200/70">
                {resume.certifications.map((certification) => (
                  <article key={certification.name} className="py-5 first:pt-0">
                    <h4 className="font-bold">{certification.name}</h4>
                    <p className="mt-2 text-sm text-slate-600">
                      {certification.issuer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section
          id="contact"
          className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 lg:px-8"
        >
          <div className="contact-card rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-2xl shadow-blue-500/20 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
              Get in touch
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
              Let&apos;s build something useful.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-blue-100">
              I&apos;m open to full-stack software-development opportunities and
              collaborations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full bg-white px-6 py-3 font-semibold text-blue-700 transition hover:-translate-y-1"
              >
                Email me
              </a>
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                GitHub
              </a>
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function ExperienceContent({ item }: { item: ExperienceItem }) {
  return (
    <>
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div>
          <h3 className="text-2xl font-bold">{item.role}</h3>
          <p className="mt-2 font-semibold text-blue-600">{item.company}</p>
          <p className="mt-1 text-sm text-slate-500">{item.location}</p>
        </div>
        <p className="font-semibold text-slate-600">{item.period}</p>
      </div>
      <p className="mt-5 max-w-3xl leading-7 text-slate-600">
        {item.description}
      </p>
    </>
  );
}
function EducationContent({ item }: { item: EducationItem }) {
  return (
    <>
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div>
          <h3 className="text-2xl font-bold">{item.degree}</h3>
          <p className="mt-2 font-semibold text-blue-600">{item.institution}</p>
          <p className="mt-1 text-sm text-slate-500">{item.location}</p>
        </div>
        <p className="font-semibold text-slate-600">{item.period}</p>
      </div>
      {item.details && (
        <p className="mt-5 max-w-3xl leading-7 text-slate-600">
          {item.details}
        </p>
      )}
    </>
  );
}
type UnknownRecord = Record<string, unknown>;
function record(value: unknown): UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}
function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
function items(value: unknown) {
  return Array.isArray(value) ? value.map(record) : [];
}
function hasSection(value: UnknownRecord, key: string) {
  return Object.prototype.hasOwnProperty.call(value, key);
}
function normalizeResume(value: unknown): ResumeContent {
  const source = record(value);
  return {
    experience: items(source.experience)
      .map((item) => ({
        role: stringValue(item.role),
        company: stringValue(item.company),
        location: stringValue(item.location),
        period: stringValue(item.period),
        description: stringValue(item.description),
      }))
      .filter((item) => item.role || item.company),
    languages: items(source.languages)
      .map((item) => ({
        language: stringValue(item.language),
        proficiency: stringValue(item.proficiency),
      }))
      .filter((item) => item.language),
    skill_groups: items(source.skill_groups)
      .map((item) => ({
        title: stringValue(item.title),
        skills: Array.isArray(item.skills)
          ? item.skills.map(stringValue).filter(Boolean)
          : [],
      }))
      .filter((item) => item.title || item.skills.length),
    education: items(source.education)
      .map((item) => ({
        degree: stringValue(item.degree),
        institution: stringValue(item.institution),
        location: stringValue(item.location),
        period: stringValue(item.period),
        details: stringValue(item.details),
      }))
      .filter((item) => item.degree || item.institution),
    publications: items(source.publications)
      .map((item) => ({
        title: stringValue(item.title),
        date: stringValue(item.date),
        status:
          item.status === "Submitted"
            ? ("Submitted" as const)
            : ("Published" as const),
        doi: stringValue(item.doi),
      }))
      .filter((item) => item.title),
    certifications: items(source.certifications)
      .map((item) => ({
        name: stringValue(item.name),
        issuer: stringValue(item.issuer),
      }))
      .filter((item) => item.name),
  };
}
function mergeResume(value: unknown): ResumeContent {
  const source = record(value);
  const saved = normalizeResume(source);
  return {
    experience: hasSection(source, "experience")
      ? saved.experience
      : fallbackResume.experience,
    languages: hasSection(source, "languages")
      ? saved.languages
      : fallbackResume.languages,
    skill_groups: hasSection(source, "skill_groups")
      ? saved.skill_groups
      : fallbackResume.skill_groups,
    education: hasSection(source, "education")
      ? saved.education
      : fallbackResume.education,
    publications: hasSection(source, "publications")
      ? saved.publications
      : fallbackResume.publications,
    certifications: hasSection(source, "certifications")
      ? saved.certifications
      : fallbackResume.certifications,
  };
}
function doiHref(doi: string) {
  return doi.startsWith("http://") || doi.startsWith("https://")
    ? doi
    : `https://doi.org/${doi.replace(/^doi:\\s*/i, "")}`;
}
function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-title">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="skill-tag rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
      {children}
    </span>
  );
}
