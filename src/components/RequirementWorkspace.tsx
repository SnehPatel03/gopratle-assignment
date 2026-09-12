"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type Category = "planner" | "performer" | "crew";
type Requirement = {
  _id: string;
  requirementId: string;
  category: Category;
  event: {
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    location: string;
    venue: string;
  };
  budget: { amount: number; flexible?: boolean };
  additionalRequirements?: string;
  status: string;
  createdAt: string;
  categoryDetails?: Record<string, unknown>;
};
type Values = {
  category: Category;
  name: string;
  type: string;
  typeOther: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  amount: number;
  flexible: boolean;
  notes: string;
  services: string;
  servicesOther: string;
  guestCount: number;
  eventScale: string;
  experienceLevel: string;
  performanceType: string;
  performanceTypeOther: string;
  genre: string;
  genreOther: string;
  performersCount: number;
  durationMinutes: number;
  equipment: string;
  role: string;
  roleOther: string;
  crewCount: number;
  experience: string;
  workingHours: number;
};
const categoryOptions = [
  { id: "planner", title: "Planner", text: "Plan the event", image: "/illustrations/1.svg" },
  { id: "crew", title: "Crew", text: "Find event support", image: "/illustrations/2.svg" },
  { id: "performer", title: "Performer", text: "Find an act", image: "/illustrations/3.svg" },
] as const;
const eventTypes = [
  "Wedding",
  "Corporate event",
  "Birthday celebration",
  "Concert / show",
  "Private dinner",
  "Other",
];
const serviceOptions = [
  "Full planning",
  "Décor & styling",
  "Catering",
  "Venue coordination",
  "Other",
];
const scales = [
  "Intimate (under 50)",
  "Medium (50–150)",
  "Large (150–500)",
  "Grand (500+)",
];
const experienceOptions = [
  "Emerging talent",
  "Established professional",
  "Premium specialist",
];
const performanceOptions = [
  "DJ",
  "Live band",
  "Singer",
  "Dance act",
  "Host / emcee",
  "Other",
];
const genres = ["Bollywood", "Classical", "Jazz", "Pop", "Electronic", "Other"];
const crewRoles = [
  "Sound engineer",
  "Lighting technician",
  "Stage manager",
  "Photographer",
  "Videographer",
  "Other",
];
const resolveOther = (value: string, other: string) =>
  value === "Other" ? other.trim() : value;

function Input({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </label>
  );
}
function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props}>{children}</select>;
}
type WorkspaceProps = {
  page?: "form" | "list" | "detail";
  requirementId?: string;
};

export default function RequirementWorkspace({
  page = "form",
  requirementId,
}: WorkspaceProps) {
  const router = useRouter();
  const [step, setStep] = useState(0),
    [items, setItems] = useState<Requirement[]>([]),
    [detail, setDetail] = useState<Requirement | null>(null),
    [busy, setBusy] = useState(false);
  const {
    register,
    setValue,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      guestCount: 1,
      performersCount: 1,
      durationMinutes: 30,
      crewCount: 1,
      workingHours: 8,
      flexible: false,
    },
  });
  const category = watch("category"),
    type = watch("type");
  const load = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/requierment"),
        json = await res.json();
      if (json.success) setItems(json.data);
    } finally {
      setBusy(false);
    }
  };
  const loadDetail = async (id: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/requierment/${id}`),
        json = await res.json();
      if (json.success) setDetail(json.data);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (page === "list") void load();
    if (page === "detail" && requirementId) void loadDetail(requirementId);
  }, [page, requirementId]);
  const advance = async () => {
    if (step === 0 && !category) return;
    if (
      step === 1 &&
      !(await trigger([
        "name",
        "type",
        "startDate",
        "endDate",
        "location",
        "venue",
        "amount",
      ]))
    )
      return;
    setStep((current) => current + 1);
  };
  const submit = async () => {
    const fields =
      category === "planner"
        ? (["services", "guestCount", "eventScale", "experienceLevel"] as const)
        : category === "performer"
          ? ([
            "performanceType",
            "genre",
            "performersCount",
            "durationMinutes",
          ] as const)
          : (["role", "crewCount", "experience", "workingHours"] as const);
    if (!(await trigger(fields))) return;
    const v = getValues();
    const categoryDetails =
      category === "planner"
        ? {
          services: [resolveOther(v.services, v.servicesOther)],
          guestCount: v.guestCount,
          eventScale: v.eventScale,
          experienceLevel: v.experienceLevel,
        }
        : category === "performer"
          ? {
            performanceType: resolveOther(
              v.performanceType,
              v.performanceTypeOther,
            ),
            genre: resolveOther(v.genre, v.genreOther),
            performersCount: v.performersCount,
            durationMinutes: v.durationMinutes,
            equipment: v.equipment
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
          }
          : {
            role: resolveOther(v.role, v.roleOther),
            crewCount: v.crewCount,
            experience: v.experience,
            workingHours: v.workingHours,
          };
    setBusy(true);
    try {
      const res = await fetch("/api/requierment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          event: {
            name: v.name,
            type: resolveOther(v.type, v.typeOther),
            startDate: v.startDate,
            endDate: v.endDate,
            location: v.location,
            venue: v.venue,
          },
          budget: { amount: v.amount, flexible: v.flexible },
          additionalRequirements: v.notes || undefined,
          status: "submitted",
          categoryDetails,
        }),
      }),
        json = await res.json();
      if (!res.ok) throw new Error(json.message);
      router.push("/requirements");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };
  if (page === "list")
    return (
      <main className="dash">
        <header>
          <strong>Requirements</strong>
          <button className="primary" onClick={() => router.push("/")}>
            New requirement
          </button>
        </header>
        <div className="dash-title">
          <h1>Requirements</h1>
        </div>
        <div className="dash-grid single-column">
          <section className="list-card">
            <div className="list-head">
              <h2>All requests</h2>
              <span>{items.length} total</span>
            </div>
            {!busy && !items.length && (
              <div className="empty">No requirements submitted.</div>
            )}
            {items.map((item) => (
              <button
                className="req-row"
                onClick={() => router.push(`/requirements/${item._id}`)}
                key={item._id}
              >
                <span>
                  <b>{item.event.name}</b>
                  <small>
                    {item.requirementId} · {item.category}
                  </small>
                </span>
                <em>{new Date(item.createdAt).toLocaleDateString()}</em>
                <strong>›</strong>
              </button>
            ))}
          </section>
        </div>
      </main>
    );
  if (page === "detail")
    return (
      <main className="dash">
        <header>
          <strong>Requirement details</strong>
          <button className="link" onClick={() => router.push("/requirements")}>
            Back to requirements
          </button>
        </header>
        <div className="dash-grid detail-page">
          {busy ? (
            <div className="empty">Loading requirement…</div>
          ) : detail ? (
            <Detail item={detail} />
          ) : (
            <div className="empty">Requirement not found.</div>
          )}
        </div>
      </main>
    );
  return (
    <main className="wizard">
      <section className="right-panel">
        <header>
          <strong>Requirement form</strong>
          <button className="link" onClick={() => router.push("/requirements")}>
            View requirements
          </button>
        </header>
        <div className="form">
          <nav>
            {["Category", "Event details", "Preferences"].map((name, index) => (
              <span className={index <= step ? "current" : ""} key={name}>
                <i>{index < step ? "✓" : index + 1}</i>
                {name}
              </span>
            ))}
          </nav>
          {step === 0 && (
            <section>
              <h1>Select a category</h1>
              <div className="choices">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    className={
                      category === option.id ? "choice selected" : "choice"
                    }
                    onClick={() => setValue("category", option.id)}
                  >
                    <div className="choice-image">
                      <img src={option.image} alt="" />
                    </div>
                    <b>{option.title}</b>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          {step === 1 && (
            <section>
              <h1>Event details</h1>
              <div className="fields">
                <Input label="Event name" error={errors.name?.message}>
                  <input
                    placeholder="Event's Name"
                    {...register("name", {
                      required: "Event name is required",
                    })}
                  />
                </Input>
                <Input label="Event type" error={errors.type?.message}>
                  <Select
                    {...register("type", {
                      required: "Choose an event type",
                      validate: (value) =>
                        value !== "Other" ||
                        !!getValues("typeOther").trim() ||
                        "Please describe the event",
                    })}
                  >
                    <option value="">Choose event type</option>
                    {eventTypes.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </Select>
                  {type === "Other" && (
                    <input
                      className="other-input"
                      placeholder="Describe the event"
                      {...register("typeOther")}
                    />
                  )}
                </Input>
                <Input label="Start date" error={errors.startDate?.message}>
                  <input
                    type="date"
                    {...register("startDate", {
                      required: "Start date is required",
                    })}
                  />
                </Input>
                <Input label="End date" error={errors.endDate?.message}>
                  <input
                    type="date"
                    {...register("endDate", {
                      required: "End date is required",
                      validate: (value) =>
                        !getValues("startDate") ||
                        value >= getValues("startDate") ||
                        "End date must be on or after the start date",
                    })}
                  />
                </Input>
                <Input label="City" error={errors.location?.message}>
                  <input
                    placeholder="e.g. Mumbai"
                    {...register("location", { required: "City is required" })}
                  />
                </Input>
                <Input label="Venue" error={errors.venue?.message}>
                  <input
                    placeholder="Venue name or short address"
                    {...register("venue", { required: "Venue is required" })}
                  />
                </Input>
                <Input label="Budget (₹)" error={errors.amount?.message}>
                  <input
                    type="number"
                    min="1"
                    placeholder="50,000"
                    {...register("amount", {
                      valueAsNumber: true,
                      min: { value: 1, message: "Enter a valid budget" },
                    })}
                  />
                </Input>
                <label className="check">
                  <input type="checkbox" {...register("flexible")} /> Budget has
                  some flexibility
                </label>
              </div>
            </section>
          )}
          {step === 2 && (
            <section>
              <h1>Preferences</h1>
              <Details
                category={category}
                register={register}
                errors={errors}
                watch={watch}
                getValues={getValues}
              />
              <Input label="Additional notes">
                <textarea placeholder="Optional notes" {...register("notes")} />
              </Input>
            </section>
          )}
          <footer>
            {step ? (
              <button
                className="back"
                onClick={() => setStep((current) => current - 1)}
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <button
                className="primary"
                disabled={step === 0 && !category}
                onClick={() => void advance()}
              >
                Continue
              </button>
            ) : (
              <button
                className="primary"
                disabled={busy}
                onClick={() => void submit()}
              >
                {busy ? "Submitting…" : "Submit requirement"}
              </button>
            )}
          </footer>
        </div>
      </section>
    </main>
  );
}

function Details({
  category,
  register,
  errors,
  watch,
  getValues,
}: {
  category?: Category;
  register: ReturnType<typeof useForm<Values>>["register"];
  errors: ReturnType<typeof useForm<Values>>["formState"]["errors"];
  watch: ReturnType<typeof useForm<Values>>["watch"];
  getValues: ReturnType<typeof useForm<Values>>["getValues"];
}) {
  const services = watch("services"),
    performanceType = watch("performanceType"),
    genre = watch("genre"),
    role = watch("role");
  const selectOptions = (items: string[]) =>
    items.map((item) => <option key={item}>{item}</option>);
  if (category === "planner")
    return (
      <div className="fields">
        <Input label="Main support needed" error={errors.services?.message}>
          <Select
            {...register("services", {
              required: "Choose a service",
              validate: (value) =>
                value !== "Other" ||
                !!getValues("servicesOther").trim() ||
                "Please describe the service",
            })}
          >
            <option value="">Choose a service</option>
            {selectOptions(serviceOptions)}
          </Select>
          {services === "Other" && (
            <input
              className="other-input"
              placeholder="Describe the service"
              {...register("servicesOther")}
            />
          )}
        </Input>
        <Input label="Expected guests">
          <input
            type="number"
            min="1"
            {...register("guestCount", { valueAsNumber: true, min: 1 })}
          />
        </Input>
        <Input label="Event scale" error={errors.eventScale?.message}>
          <Select {...register("eventScale", { required: "Choose the scale" })}>
            <option value="">Choose the scale</option>
            {selectOptions(scales)}
          </Select>
        </Input>
        <Input
          label="Planner experience"
          error={errors.experienceLevel?.message}
        >
          <Select
            {...register("experienceLevel", {
              required: "Choose an experience level",
            })}
          >
            <option value="">Choose experience</option>
            {selectOptions(experienceOptions)}
          </Select>
        </Input>
      </div>
    );
  if (category === "performer")
    return (
      <div className="fields">
        <Input label="Performance type" error={errors.performanceType?.message}>
          <Select
            {...register("performanceType", {
              required: "Choose a performance type",
              validate: (value) =>
                value !== "Other" ||
                !!getValues("performanceTypeOther").trim() ||
                "Please describe the performance",
            })}
          >
            <option value="">Choose an act</option>
            {selectOptions(performanceOptions)}
          </Select>
          {performanceType === "Other" && (
            <input
              className="other-input"
              placeholder="Describe the act"
              {...register("performanceTypeOther")}
            />
          )}
        </Input>
        <Input label="Genre" error={errors.genre?.message}>
          <Select
            {...register("genre", {
              required: "Choose a genre",
              validate: (value) =>
                value !== "Other" ||
                !!getValues("genreOther").trim() ||
                "Please describe the genre",
            })}
          >
            <option value="">Choose a genre</option>
            {selectOptions(genres)}
          </Select>
          {genre === "Other" && (
            <input
              className="other-input"
              placeholder="Describe the genre"
              {...register("genreOther")}
            />
          )}
        </Input>
        <Input label="Number of performers">
          <input
            type="number"
            min="1"
            {...register("performersCount", { valueAsNumber: true, min: 1 })}
          />
        </Input>
        <Input label="Set length (minutes)">
          <input
            type="number"
            min="1"
            {...register("durationMinutes", { valueAsNumber: true, min: 1 })}
          />
        </Input>
        <Input label="Equipment needed">
          <input
            placeholder="Optional: mic, speakers, lights"
            {...register("equipment")}
          />
        </Input>
      </div>
    );
  return (
    <div className="fields">
      <Input label="Crew role" error={errors.role?.message}>
        <Select
          {...register("role", {
            required: "Choose a crew role",
            validate: (value) =>
              value !== "Other" ||
              !!getValues("roleOther").trim() ||
              "Please describe the role",
          })}
        >
          <option value="">Choose a role</option>
          {selectOptions(crewRoles)}
        </Select>
        {role === "Other" && (
          <input
            className="other-input"
            placeholder="Describe the role"
            {...register("roleOther")}
          />
        )}
      </Input>
      <Input label="Crew count">
        <input
          type="number"
          min="1"
          {...register("crewCount", { valueAsNumber: true, min: 1 })}
        />
      </Input>
      <Input label="Experience" error={errors.experience?.message}>
        <Select {...register("experience", { required: "Choose experience" })}>
          <option value="">Choose experience</option>
          {selectOptions(experienceOptions)}
        </Select>
      </Input>
      <Input label="Working hours">
        <input
          type="number"
          min="1"
          {...register("workingHours", { valueAsNumber: true, min: 1 })}
        />
      </Input>
    </div>
  );
}

function Detail({ item }: { item: Requirement }) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const details = Object.entries(item.categoryDetails || {}).filter(
    ([key]) =>
      !["_id", "requirementId", "createdAt", "updatedAt", "__v"].includes(key),
  );
  return (
    <section className="requirement-detail">
      <div className="detail-heading">
        <div>
          <span className="detail-label">Requirement</span>
          <h1>{item.event.name}</h1>
        </div>
        <span className="tag">{item.status}</span>
      </div>
      <div className="detail-summary">
        <p>
          <small>Category</small>
          <b>{item.category}</b>
        </p>
        <p>
          <small>Reference ID</small>
          <b>{item.requirementId}</b>
        </p>
        <p>
          <small>Budget</small>
          <b>
            ₹{item.budget.amount.toLocaleString()}
            {item.budget.flexible ? " (flexible)" : ""}
          </b>
        </p>
      </div>
      <section className="detail-section">
        <h2>Event information</h2>
        <div className="information-grid">
          <p>
            <small>Event type</small>
            <b>{item.event.type}</b>
          </p>
          <p>
            <small>Date range</small>
            <b>
              {formatDate(item.event.startDate)} —{" "}
              {formatDate(item.event.endDate)}
            </b>
          </p>
          <p>
            <small>City</small>
            <b>{item.event.location}</b>
          </p>
          <p>
            <small>Venue</small>
            <b>{item.event.venue}</b>
          </p>
        </div>
      </section>
      <section className="detail-section">
        <h2>Category preferences</h2>
        <div className="information-grid">
          {details.map(([key, value]) => (
            <p key={key}>
              <small>{key.replace(/([A-Z])/g, " $1")}</small>
              <b>{Array.isArray(value) ? value.join(", ") : String(value)}</b>
            </p>
          ))}
        </div>
      </section>
      {item.additionalRequirements && (
        <section className="detail-section">
          <h2>Additional notes</h2>
          <p className="note">{item.additionalRequirements}</p>
        </section>
      )}
    </section>
  );
}
