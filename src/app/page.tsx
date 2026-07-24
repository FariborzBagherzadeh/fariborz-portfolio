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
  profile_photo_url?: string;
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
  profile_photo_url: "/profile.jpg",
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
        "Python",
        "PyTorch",
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
  const savedProfile = (profileResult.data?.content ?? {}) as ProfileContent;
  return {
    projects: (projectsResult.data ?? []) as Project[],
    profile: {
      ...fallbackProfile,
      ...savedProfile,
      profile_photo_url:
        savedProfile.profile_photo_url?.trim() ||
        fallbackProfile.profile_photo_url,
    },
    resume: mergeResume(resumeResult.data?.content),
  };
}

export default async function Home() {
  const { projects, profile, resume } = await getHomeData();
  const highlights = resume.skill_groups
    .flatMap((group) => group.skills)
    .slice(0, 6);

  return (
    <main className="portfolio-main min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <MotionStyles />
      <div className="aurora aurora-one motion-aurora-one" />
      <div className="aurora aurora-two motion-aurora-two" />
      <div className="motion-grid" />

      <header className="sticky top-0 z-30 mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
        <div className="header-shell flex items-center justify-between px-4 py-3 sm:px-5">
          <a
            href="#top"
            className="brand-mark flex items-center gap-2 font-bold tracking-tight"
            aria-label="Back to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm text-white shadow-lg shadow-slate-950/15">
              FB
            </span>
            <span className="hidden text-lg sm:block">
              Fariborz<span className="text-blue-600">.</span>
            </span>
          </a>
          <nav
            className="hidden items-center gap-5 text-sm font-semibold text-slate-600 lg:flex"
            aria-label="Primary navigation"
          >
            <NavLink href="#about">About</NavLink>
            <NavLink href="#experience">Experience</NavLink>
            <NavLink href="#skills">Skills</NavLink>
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <Icon name="mail" className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Contact me</span>
          </a>
        </div>
      </header>

      <section
        id="top"
        className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 sm:pt-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-28"
      >
        <div className="max-w-3xl self-center">
          <div className="hero-kicker inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
            {profile.availability}
          </div>
          <p className="hero-role mt-7 flex items-center gap-2 text-sm font-bold uppercase tracking-[.18em] text-blue-700">
            <Icon name="sparkle" className="h-4 w-4" /> {profile.role}
          </p>
          <h1 className="hero-title mt-4 text-5xl font-black leading-[.98] tracking-[-.055em] text-slate-950 sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="hero-body mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            {profile.hero_description}
          </p>
          <div className="hero-actions mt-9 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="primary-cta inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-bold text-white shadow-xl shadow-slate-900/15"
            >
              Explore my work <Icon name="arrow" className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="secondary-cta inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3.5 font-bold text-slate-800"
            >
              <Icon name="mail" className="h-4 w-4 text-blue-600" /> Get in
              touch
            </a>
          </div>
          <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-slate-200/80 pt-6">
            <Metric icon="code" label="Full-stack" />
            <Metric icon="user" label="Front-end" />
            <Metric icon="cloud" label="Backend" />
          </div>
        </div>
        <div className="relative mx-auto flex w-full max-w-md justify-center lg:mx-0 lg:justify-self-end">
          <div className="profile-photo-card">
            <div className="profile-photo-ring">
              <div className="profile-photo-frame">
                <ProfilePhoto
                  src={profile.profile_photo_url}
                  alt={`Portrait of ${profile.name}`}
                  className="profile-photo"
                />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-3 text-center">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  {profile.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">Based in Germany</p>
              </div>
              <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                <Icon name="location" className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section id="about" className="section-shell">
          <SectionHeading
            icon="user"
            eyebrow="About me"
            title="Focused on clear, useful web experiences."
            text="A practical approach to frontend quality, solid APIs, and maintainable products."
          />
          <div className="mt-9 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <article className="glass-card lift-card p-7 md:p-9">
              <p className="text-lg leading-8 text-slate-600">
                {profile.about}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {highlights.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </article>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <FocusCard
                icon="code"
                title="Build"
                text="Responsive interfaces and full-stack products"
              />
              <FocusCard
                icon="brain"
                title="Connect"
                text="APIs, databases, and practical workflows"
              />
              <FocusCard
                icon="leaf"
                title="Improve"
                text="Data-informed software for real problems"
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="experience" className="section-shell section-rule">
          <SectionHeading
            icon="briefcase"
            eyebrow="Experience"
            title="Work with practical impact."
            text="Roles and projects where software, data, and real-world requirements meet."
          />
          <div className="timeline mt-10">
            {resume.experience.map((item, index) => (
              <Reveal key={`${item.company}-${index}`} delay={index * 80}>
                <article className="timeline-item">
                  <span className="timeline-dot">
                    <Icon name="briefcase" className="h-4 w-4" />
                  </span>
                  <div className="glass-card lift-card p-6 md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-950 md:text-2xl">
                          {item.role}
                        </h3>
                        <p className="mt-2 font-bold text-blue-700">
                          {item.company}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <Icon name="location" className="h-4 w-4" />
                          {item.location}
                        </p>
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
                        <Icon name="calendar" className="h-4 w-4" />
                        {item.period}
                      </span>
                    </div>
                    <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="skills" className="section-shell section-rule">
          <SectionHeading
            icon="tool"
            eyebrow="Skills"
            title="A focused toolkit, grouped for clarity."
            text="The technologies I use to design, build, ship, and improve reliable applications."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {resume.skill_groups.map((group, index) => (
              <Reveal key={group.title} delay={index * 75}>
                <article className="glass-card skill-card h-full p-6">
                  <div className="flex items-start gap-4">
                    <span className={`icon-tile icon-tile-${index % 4}`}>
                      <Icon
                        name={
                          index === 0
                            ? "brain"
                            : index === 1
                              ? "code"
                              : index === 2
                                ? "check"
                                : "cloud"
                        }
                        className="h-5 w-5"
                      />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        {group.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {group.skills.length} technologies
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
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
        <section id="projects" className="section-shell section-rule">
          <SectionHeading
            icon="folder"
            eyebrow="Selected work"
            title="Projects that turn ideas into products."
            text="A selection of published work, each with its own stack and outcome."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {projects.length === 0 ? (
              <div className="glass-card flex items-center gap-4 p-7 text-slate-600 md:col-span-2">
                <span className="icon-tile icon-tile-1">
                  <Icon name="folder" className="h-5 w-5" />
                </span>
                <p>Published projects will appear here soon.</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <Reveal key={project.id} delay={index * 90}>
                  <article className="glass-card project-card group flex h-full flex-col overflow-hidden p-7">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black tracking-[.16em] text-slate-300">
                        0{index + 1}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${project.is_featured ? "bg-amber-100 text-amber-800" : "bg-blue-50 text-blue-700"}`}
                      >
                        {project.is_featured ? "Featured" : "Project"}
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
                      {project.title}
                    </h3>
                    <p className="mt-4 leading-7 text-slate-600">
                      {project.summary}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </div>
                    {(project.demo_url || project.repository_url) && (
                      <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-200/80 pt-5 text-sm font-bold">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-link inline-flex items-center gap-1.5 text-blue-700"
                          >
                            <Icon name="external" className="h-4 w-4" /> Live
                            demo
                          </a>
                        )}
                        {project.repository_url && (
                          <a
                            href={project.repository_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-link inline-flex items-center gap-1.5 text-slate-700"
                          >
                            <Icon name="github" className="h-4 w-4" />{" "}
                            Repository
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
        <section id="education" className="section-shell section-rule">
          <SectionHeading
            icon="graduation"
            eyebrow="Education & languages"
            title="Learning continuously and communicating clearly."
          />
          <div className="mt-9 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <div className="space-y-4">
              {resume.education.map((item, index) => (
                <Reveal key={`${item.institution}-${index}`} delay={index * 80}>
                  <article className="glass-card lift-card p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-bold text-blue-700">
                          <Icon name="graduation" className="h-4 w-4" />
                          Education
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-slate-950">
                          {item.degree}
                        </h3>
                        <p className="mt-2 font-semibold text-slate-700">
                          {item.institution}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <Icon name="location" className="h-4 w-4" />
                          {item.location}
                        </p>
                      </div>
                      <span className="inline-flex h-fit w-fit items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
                        <Icon name="calendar" className="h-4 w-4" />
                        {item.period}
                      </span>
                    </div>
                    {item.details && (
                      <p className="mt-5 leading-7 text-slate-600">
                        {item.details}
                      </p>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
            <aside className="glass-card p-6">
              <div className="flex items-center gap-3">
                <span className="icon-tile icon-tile-2">
                  <Icon name="language" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Languages
                  </p>
                  <h3 className="mt-1 text-xl font-bold">Communication</h3>
                </div>
              </div>
              <div className="mt-5 divide-y divide-slate-200/80">
                {resume.languages.map((language) => (
                  <div
                    key={language.language}
                    className="flex items-center justify-between gap-3 py-4 first:pt-0"
                  >
                    <p className="font-bold text-slate-800">
                      {language.language}
                    </p>
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                      {language.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-shell section-rule">
          <SectionHeading
            icon="book"
            eyebrow="Research & credentials"
            title="Evidence of continuous learning."
          />
          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            <article className="glass-card lift-card p-6">
              <div className="flex items-center gap-3">
                <span className="icon-tile icon-tile-3">
                  <Icon name="book" className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-bold">Publications</h3>
              </div>
              <div className="mt-5 divide-y divide-slate-200/80">
                {resume.publications.map((publication) => (
                  <article key={publication.title} className="py-5 first:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${publication.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {publication.status}
                      </span>
                      <span className="text-sm font-bold text-slate-500">
                        {publication.date}
                      </span>
                    </div>
                    <h4 className="mt-3 leading-7 font-bold text-slate-800">
                      {publication.title}
                    </h4>
                    {publication.doi && (
                      <a
                        href={doiHref(publication.doi)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-link mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700"
                      >
                        <Icon name="external" className="h-4 w-4" /> DOI:{" "}
                        {publication.doi}
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </article>
            <article className="glass-card lift-card p-6">
              <div className="flex items-center gap-3">
                <span className="icon-tile icon-tile-0">
                  <Icon name="award" className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-bold">Certifications</h3>
              </div>
              <div className="mt-5 divide-y divide-slate-200/80">
                {resume.certifications.map((certification) => (
                  <article
                    key={certification.name}
                    className="flex gap-3 py-5 first:pt-0"
                  >
                    <Icon
                      name="check"
                      className="mt-1 h-5 w-5 shrink-0 text-emerald-600"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {certification.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {certification.issuer}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="contact"
          className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8"
        >
          <div className="contact-card overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20 md:p-12">
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.16em] text-blue-200">
                  <Icon name="sparkle" className="h-4 w-4" />
                  Let&apos;s connect
                </p>
                <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-.04em] md:text-5xl">
                  Have a web project in mind?
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                  I&apos;m open to full-stack software-development opportunities
                  and collaborations.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-slate-950 transition hover:-translate-y-1"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  Email me
                </a>
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="icon-button"
                >
                  <Icon name="github" className="h-5 w-5" />
                </a>
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="icon-button"
                >
                  <Icon name="linkedin" className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="nav-link">
      {children}
    </a>
  );
}
function Metric({ icon, label }: { icon: IconName; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
      <Icon name={icon} className="h-4 w-4 text-blue-600" />
      {label}
    </div>
  );
}
function FocusCard({
  icon,
  title,
  text,
}: {
  icon: IconName;
  title: string;
  text: string;
}) {
  return (
    <article className="glass-card flex items-center gap-4 p-5">
      <span className="icon-tile icon-tile-1">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
      </div>
    </article>
  );
}
function SectionHeading({
  icon,
  eyebrow,
  title,
  text,
}: {
  icon: IconName;
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.16em] text-blue-700">
        <Icon name={icon} className="h-4 w-4" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-[-.035em] text-slate-950 md:text-4xl">
        {title}
      </h2>
      {text && (
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">{text}</p>
      )}
    </div>
  );
}
function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="skill-tag rounded-lg border border-blue-100 bg-blue-50/80 px-2.5 py-1.5 text-sm font-semibold text-blue-800">
      {children}
    </span>
  );
}

type IconName =
  | "arrow"
  | "award"
  | "book"
  | "brain"
  | "briefcase"
  | "calendar"
  | "chart"
  | "check"
  | "cloud"
  | "code"
  | "external"
  | "folder"
  | "github"
  | "graduation"
  | "language"
  | "leaf"
  | "linkedin"
  | "location"
  | "mail"
  | "sparkle"
  | "tool"
  | "user";
function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    brain: (
      <>
        <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.5a3.5 3.5 0 0 0-1 6.8V16a3.5 3.5 0 0 0 4 3.5" />
        <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.5a3.5 3.5 0 0 1 1 6.8V16a3.5 3.5 0 0 1-4 3.5" />
        <path d="M12 4v16" />
        <path d="M8 10h4M12 14h4" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 15 4-4 3 3 5-7" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    cloud: (
      <path d="M17.5 19H8a5 5 0 1 1 .7-9.95A6 6 0 0 1 20 11.5 3.5 3.5 0 0 1 17.5 19Z" />
    ),
    code: <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />,
    external: (
      <>
        <path d="M14 3h7v7" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </>
    ),
    folder: (
      <path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    ),
    github: (
      <>
        <path d="M15 22v-3.9c0-1 .2-1.7.7-2.3-2.3.3-4.7-1.1-4.7-5A3.9 3.9 0 0 1 12 8.1 3.6 3.6 0 0 1 12.1 5s.9-.3 2.9 1.1a10 10 0 0 1 5.3 0C22.3 4.7 23.2 5 23.2 5a3.6 3.6 0 0 1 .1 3.1 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 5.3-4.7 5 .5.6.7 1.4.7 2.3V22" />
        <path d="M9 18c-2 .6-3.5 0-4.5-1.5" />
      </>
    ),
    graduation: (
      <>
        <path d="m2 10 10-5 10 5-10 5Z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6" />
      </>
    ),
    language: (
      <path d="m5 8 6-5 6 5M7 6c0 6 2 10 5 13M12 3c2 3 4 5 7 6M4 18h10" />
    ),
    leaf: (
      <>
        <path d="M20 4C10 4 4 9 4 17c0 2 .8 3 2 3 8 0 13-6 14-16Z" />
        <path d="M4 20c3-5 7-8 12-11" />
      </>
    ),
    linkedin: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10v6M8 7v.01M12 16v-3a2 2 0 0 1 4 0v3M12 10v6" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5Z" />
        <path d="m5 17-.7 2.3L2 20l2.3.7L5 23l.7-2.3L8 20l-2.3-.7Z" />
      </>
    ),
    tool: (
      <path d="M14.7 6.3a4.5 4.5 0 0 0-5.9 5.9L3 18a2.1 2.1 0 0 0 3 3l5.8-5.8a4.5 4.5 0 0 0 5.9-5.9l-3.2 3.2-2.3-2.3Z" />
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
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
