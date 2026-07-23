"use client";

import { type ReactNode, useState } from "react";

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
};
export type LanguageItem = { language: string; proficiency: string };
export type SkillGroup = { title: string; skills: string[] };
export type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details: string;
};
export type Publication = {
  title: string;
  date: string;
  status: "Published" | "Submitted";
  doi: string;
};
export type Certification = { name: string; issuer: string };

export type ResumeContent = {
  experience: ExperienceItem[];
  languages: LanguageItem[];
  skill_groups: SkillGroup[];
  education: EducationItem[];
  publications: Publication[];
  certifications: Certification[];
};

type Section = keyof ResumeContent;
type Entry =
  | ExperienceItem
  | LanguageItem
  | SkillGroup
  | EducationItem
  | Publication
  | Certification;

const blankEntries: { [K in Section]: ResumeContent[K][number] } = {
  experience: {
    role: "",
    company: "",
    location: "",
    period: "",
    description: "",
  },
  languages: { language: "", proficiency: "" },
  skill_groups: { title: "", skills: [] },
  education: {
    degree: "",
    institution: "",
    location: "",
    period: "",
    details: "",
  },
  publications: { title: "", date: "", status: "Published", doi: "" },
  certifications: { name: "", issuer: "" },
};

export function ResumeEditor({
  initialResume,
  saveResume,
}: {
  initialResume: ResumeContent;
  saveResume: (formData: FormData) => void | Promise<void>;
}) {
  const [resume, setResume] = useState<ResumeContent>(initialResume);

  function update(
    section: Section,
    index: number,
    field: string,
    value: string,
  ) {
    setResume((current) => {
      const entries = [...current[section]] as Entry[];
      const entry = entries[index] as Record<string, unknown>;
      entries[index] = {
        ...entry,
        [field]:
          field === "skills"
            ? value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : value,
      } as Entry;
      return { ...current, [section]: entries } as ResumeContent;
    });
  }

  function add(section: Section) {
    setResume(
      (current) =>
        ({
          ...current,
          [section]: [...current[section], { ...blankEntries[section] }],
        }) as ResumeContent,
    );
  }

  function remove(section: Section, index: number) {
    setResume(
      (current) =>
        ({
          ...current,
          [section]: current[section].filter(
            (_, itemIndex) => itemIndex !== index,
          ),
        }) as ResumeContent,
    );
  }

  return (
    <form action={saveResume} className="mt-7 space-y-10">
      <input type="hidden" name="resume_json" value={JSON.stringify(resume)} />
      <EditorSection title="Work experience" onAdd={() => add("experience")}>
        {resume.experience.map((item, index) => (
          <ExperienceCard
            key={index}
            item={item}
            onChange={(field, value) =>
              update("experience", index, field, value)
            }
            onRemove={() => remove("experience", index)}
          />
        ))}
      </EditorSection>
      <EditorSection title="Languages" onAdd={() => add("languages")}>
        {resume.languages.map((item, index) => (
          <LanguageCard
            key={index}
            item={item}
            onChange={(field, value) =>
              update("languages", index, field, value)
            }
            onRemove={() => remove("languages", index)}
          />
        ))}
      </EditorSection>
      <EditorSection
        title="Skills"
        hint="Use one category per card. Separate skills with commas."
        onAdd={() => add("skill_groups")}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {resume.skill_groups.map((item, index) => (
            <SkillCard
              key={index}
              item={item}
              onChange={(field, value) =>
                update("skill_groups", index, field, value)
              }
              onRemove={() => remove("skill_groups", index)}
            />
          ))}
        </div>
      </EditorSection>
      <EditorSection title="Education" onAdd={() => add("education")}>
        {resume.education.map((item, index) => (
          <EducationCard
            key={index}
            item={item}
            onChange={(field, value) =>
              update("education", index, field, value)
            }
            onRemove={() => remove("education", index)}
          />
        ))}
      </EditorSection>
      <EditorSection
        title="Publications"
        hint="Choose Published or Submitted and add a DOI when available."
        onAdd={() => add("publications")}
      >
        {resume.publications.map((item, index) => (
          <PublicationCard
            key={index}
            item={item}
            onChange={(field, value) =>
              update("publications", index, field, value)
            }
            onRemove={() => remove("publications", index)}
          />
        ))}
      </EditorSection>
      <EditorSection title="Certifications" onAdd={() => add("certifications")}>
        {resume.certifications.map((item, index) => (
          <CertificationCard
            key={index}
            item={item}
            onChange={(field, value) =>
              update("certifications", index, field, value)
            }
            onRemove={() => remove("certifications", index)}
          />
        ))}
      </EditorSection>
      <button
        type="submit"
        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Save CV sections
      </button>
    </form>
  );
}

function EditorSection({
  title,
  hint,
  children,
  onAdd,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  onAdd: () => void;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          Add entry
        </button>
      </div>
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}

function Card({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 p-5">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-semibold text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

type Change = (field: string, value: string) => void;
function ExperienceCard({
  item,
  onChange,
  onRemove,
}: {
  item: ExperienceItem;
  onChange: Change;
  onRemove: () => void;
}) {
  return (
    <Card onRemove={onRemove}>
      <Input
        label="Job title"
        value={item.role}
        onChange={(v) => onChange("role", v)}
      />
      <Input
        label="Organization"
        value={item.company}
        onChange={(v) => onChange("company", v)}
      />
      <Input
        label="Location"
        value={item.location}
        onChange={(v) => onChange("location", v)}
      />
      <Input
        label="Dates"
        value={item.period}
        onChange={(v) => onChange("period", v)}
      />
      <TextArea
        label="Description"
        value={item.description}
        onChange={(v) => onChange("description", v)}
      />
    </Card>
  );
}
function LanguageCard({
  item,
  onChange,
  onRemove,
}: {
  item: LanguageItem;
  onChange: Change;
  onRemove: () => void;
}) {
  return (
    <Card onRemove={onRemove}>
      <Input
        label="Language"
        value={item.language}
        onChange={(v) => onChange("language", v)}
      />
      <Input
        label="Proficiency"
        value={item.proficiency}
        placeholder="e.g. C2, Native, Professional working"
        onChange={(v) => onChange("proficiency", v)}
      />
    </Card>
  );
}
function SkillCard({
  item,
  onChange,
  onRemove,
}: {
  item: SkillGroup;
  onChange: Change;
  onRemove: () => void;
}) {
  return (
    <Card onRemove={onRemove}>
      <Input
        label="Category"
        value={item.title}
        onChange={(v) => onChange("title", v)}
      />
      <TextArea
        label="Skills"
        value={item.skills.join(", ")}
        onChange={(v) => onChange("skills", v)}
      />
    </Card>
  );
}
function EducationCard({
  item,
  onChange,
  onRemove,
}: {
  item: EducationItem;
  onChange: Change;
  onRemove: () => void;
}) {
  return (
    <Card onRemove={onRemove}>
      <Input
        label="Degree"
        value={item.degree}
        onChange={(v) => onChange("degree", v)}
      />
      <Input
        label="Institution"
        value={item.institution}
        onChange={(v) => onChange("institution", v)}
      />
      <Input
        label="Location"
        value={item.location}
        onChange={(v) => onChange("location", v)}
      />
      <Input
        label="Dates"
        value={item.period}
        onChange={(v) => onChange("period", v)}
      />
      <TextArea
        label="Details"
        value={item.details}
        onChange={(v) => onChange("details", v)}
      />
    </Card>
  );
}
function PublicationCard({
  item,
  onChange,
  onRemove,
}: {
  item: Publication;
  onChange: Change;
  onRemove: () => void;
}) {
  return (
    <Card onRemove={onRemove}>
      <Input
        label="Publication title"
        value={item.title}
        onChange={(v) => onChange("title", v)}
      />
      <Input
        label="Date"
        value={item.date}
        onChange={(v) => onChange("date", v)}
      />
      <Select
        label="Status"
        value={item.status}
        onChange={(v) => onChange("status", v)}
        options={["Published", "Submitted"]}
      />
      <Input
        label="DOI"
        value={item.doi}
        placeholder="10.1234/example or https://doi.org/..."
        onChange={(v) => onChange("doi", v)}
      />
    </Card>
  );
}
function CertificationCard({
  item,
  onChange,
  onRemove,
}: {
  item: Certification;
  onChange: Change;
  onRemove: () => void;
}) {
  return (
    <Card onRemove={onRemove}>
      <Input
        label="Certification"
        value={item.name}
        onChange={(v) => onChange("name", v)}
      />
      <Input
        label="Issuer"
        value={item.issuer}
        onChange={(v) => onChange("issuer", v)}
      />
    </Card>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
function Input({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}
function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}
function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
