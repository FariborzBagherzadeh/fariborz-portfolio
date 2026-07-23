import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSignOutButton } from "@/components/admin-sign-out-button";
import { ResumeEditor, type ResumeContent } from "@/components/resume-editor";

type Project = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  tech_stack: string[];
  image_url: string | null;
  demo_url: string | null;
  repository_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
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

const fallbackResume: ResumeContent = {
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

function projectValues(formData: FormData) {
  const techStack = String(formData.get("tech_stack") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const sortOrder = Number.parseInt(
    String(formData.get("sort_order") ?? "0"),
    10,
  );

  return {
    title: String(formData.get("title") ?? "").trim(),
    slug,
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    tech_stack: techStack,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    demo_url: String(formData.get("demo_url") ?? "").trim() || null,
    repository_url: String(formData.get("repository_url") ?? "").trim() || null,
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
    sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
  };
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { claims },
  } = await supabase.auth.getClaims();
  const userId = claims?.sub;

  if (!userId) redirect("/admin/login");

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!adminUser) redirect("/admin/login");
  return supabase;
}

export default async function AdminPage() {
  const supabase = await requireAdmin();
  const [
    { data: projects, error: projectsError },
    { data: profileBlock, error: profileError },
    { data: resumeBlock, error: resumeError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("content_blocks")
      .select("content")
      .eq("section_key", "profile")
      .maybeSingle(),
    supabase
      .from("content_blocks")
      .select("content")
      .eq("section_key", "resume")
      .maybeSingle(),
  ]);

  if (projectsError) throw new Error("Could not load projects.");
  if (profileError || resumeError)
    throw new Error("Could not load portfolio content.");

  async function createProject(formData: FormData) {
    "use server";
    const { error } = await (await requireAdmin())
      .from("projects")
      .insert(projectValues(formData));
    if (error)
      throw new Error(
        "Could not create the project. Check that its slug is unique.",
      );
    revalidatePath("/admin");
    revalidatePath("/");
  }

  async function updateProject(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    const { error } = await (await requireAdmin())
      .from("projects")
      .update(projectValues(formData))
      .eq("id", id);
    if (error) throw new Error("Could not save the project.");
    revalidatePath("/admin");
    revalidatePath("/");
  }

  async function deleteProject(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    const { error } = await (await requireAdmin())
      .from("projects")
      .delete()
      .eq("id", id);
    if (error) throw new Error("Could not delete the project.");
    revalidatePath("/admin");
    revalidatePath("/");
  }

  async function updateProfile(formData: FormData) {
    "use server";
    const content = {
      name: textValue(formData, "name"),
      role: textValue(formData, "role"),
      hero_description: textValue(formData, "hero_description"),
      about: textValue(formData, "about"),
      email: textValue(formData, "email"),
      github_url: textValue(formData, "github_url"),
      linkedin_url: textValue(formData, "linkedin_url"),
      availability: textValue(formData, "availability"),
    };
    const { error } = await (await requireAdmin())
      .from("content_blocks")
      .upsert(
        { section_key: "profile", content, is_published: true },
        { onConflict: "section_key" },
      );
    if (error) throw new Error("Could not save profile content.");
    revalidatePath("/admin");
    revalidatePath("/");
  }

  async function updateResume(formData: FormData) {
    "use server";
    const content = parseResume(formData.get("resume_json"));
    const { error } = await (await requireAdmin())
      .from("content_blocks")
      .upsert(
        { section_key: "resume", content, is_published: true },
        { onConflict: "section_key" },
      );
    if (error) throw new Error("Could not save CV content.");
    revalidatePath("/admin");
    revalidatePath("/");
  }

  const profile = (profileBlock?.content ?? {}) as ProfileContent;
  const resume = mergeResume(resumeBlock?.content);
  const projectList = (projects ?? []) as Project[];

  return (
    <main className="min-h-screen bg-[#f7faff] px-6 py-10 text-slate-900 md:py-16">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <section className="relative z-10 mx-auto max-w-5xl">
        <div className="glass-card flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Portfolio admin
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Manage portfolio
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Edit your public details, CV sections, and projects.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              View site
            </a>
            <AdminSignOutButton />
          </div>
        </div>

        <section className="glass-card mt-8 p-7 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Portfolio profile
          </p>
          <h2 className="mt-2 text-2xl font-bold">Edit public details</h2>
          <form
            action={updateProfile}
            className="mt-7 grid gap-5 md:grid-cols-2"
          >
            <Field label="Name" name="name" value={profile.name} />
            <Field label="Role" name="role" value={profile.role} />
            <Field
              label="Email"
              name="email"
              type="email"
              value={profile.email}
            />
            <Field
              label="Availability"
              name="availability"
              value={profile.availability}
            />
            <Field
              label="GitHub URL"
              name="github_url"
              type="url"
              value={profile.github_url}
            />
            <Field
              label="LinkedIn URL"
              name="linkedin_url"
              type="url"
              value={profile.linkedin_url}
            />
            <TextArea
              label="Hero description"
              name="hero_description"
              value={profile.hero_description}
              rows={3}
            />
            <TextArea
              label="About text"
              name="about"
              value={profile.about}
              rows={4}
            />
            <div className="md:col-span-2">
              <SaveButton label="Save public details" />
            </div>
          </form>
        </section>

        <section className="glass-card mt-8 p-7 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            CV sections
          </p>
          <h2 className="mt-2 text-2xl font-bold">Manage your CV content</h2>
          <p className="mt-3 text-slate-600">
            Add or remove any number of work experiences, languages, skills,
            education entries, publications, and certifications.
          </p>
          <ResumeEditor initialResume={resume} saveResume={updateResume} />
        </section>

        <section className="glass-card mt-8 p-7 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            New project
          </p>
          <h2 className="mt-2 text-2xl font-bold">Add portfolio work</h2>
          <form action={createProject} className="mt-7">
            <ProjectFields />
            <SaveButton label="Create project" />
          </form>
        </section>

        <section className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Existing projects
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {projectList.length} project{projectList.length === 1 ? "" : "s"}
          </h2>
          <div className="mt-6 space-y-5">
            {projectList.length === 0 ? (
              <div className="glass-card p-7 text-slate-600">
                No projects yet. Add your first one above.
              </div>
            ) : (
              projectList.map((project) => (
                <details
                  key={project.id}
                  className="glass-card overflow-hidden"
                >
                  <summary className="cursor-pointer list-none p-6 md:p-7">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          <StatusBadge project={project} />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          /{project.slug}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        Edit project ↓
                      </span>
                    </div>
                  </summary>
                  <div className="border-t border-slate-200/70 p-6 md:p-7">
                    <form action={updateProject}>
                      <input type="hidden" name="id" value={project.id} />
                      <ProjectFields project={project} />
                      <SaveButton label="Save changes" />
                    </form>
                    <form action={deleteProject} className="mt-5">
                      <input type="hidden" name="id" value={project.id} />
                      <button
                        type="submit"
                        className="text-sm font-semibold text-red-600 transition hover:text-red-800"
                      >
                        Delete this project
                      </button>
                    </form>
                  </div>
                </details>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
function SaveButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
      {label}
    </button>
  );
}
function StatusBadge({ project }: { project: Project }) {
  return (
    <>
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${project.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
      >
        {project.is_published ? "Published" : "Draft"}
      </span>
      {project.is_featured && (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          Featured
        </span>
      )}
    </>
  );
}

function ProjectFields({ project }: { project?: Project }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field
        label="Project title"
        name="title"
        value={project?.title}
        required
      />
      <Field
        label="URL slug"
        name="slug"
        value={project?.slug}
        placeholder="my-awesome-project"
        required
      />
      <TextArea
        label="Short summary"
        name="summary"
        value={project?.summary}
        rows={3}
        required
      />
      <TextArea
        label="Full description"
        name="description"
        value={project?.description ?? ""}
        rows={5}
      />
      <TextArea
        label="Technologies"
        name="tech_stack"
        value={project?.tech_stack.join(", ")}
        rows={2}
      />
      <Field
        label="Image URL"
        name="image_url"
        type="url"
        value={project?.image_url ?? ""}
        placeholder="https://..."
      />
      <Field
        label="Demo URL"
        name="demo_url"
        type="url"
        value={project?.demo_url ?? ""}
        placeholder="https://..."
      />
      <Field
        label="Repository URL"
        name="repository_url"
        type="url"
        value={project?.repository_url ?? ""}
        placeholder="https://github.com/..."
      />
      <Field
        label="Sort order"
        name="sort_order"
        type="number"
        value={String(project?.sort_order ?? 0)}
      />
      <div className="flex flex-wrap gap-6 md:col-span-2">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
          <input
            name="is_published"
            type="checkbox"
            defaultChecked={project?.is_published}
            className="h-4 w-4 accent-blue-600"
          />
          Publish on portfolio
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
          <input
            name="is_featured"
            type="checkbox"
            defaultChecked={project?.is_featured}
            className="h-4 w-4 accent-blue-600"
          />
          Feature this project
        </label>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  value?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={value ?? ""}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
function TextArea({
  label,
  name,
  value,
  rows,
  required = false,
}: {
  label: string;
  name: string;
  value?: string;
  rows: number;
  required?: boolean;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        defaultValue={value ?? ""}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
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

function parseResume(value: FormDataEntryValue | null): ResumeContent {
  if (typeof value !== "string") return fallbackResume;
  try {
    return normalizeResume(JSON.parse(value));
  } catch {
    return fallbackResume;
  }
}
