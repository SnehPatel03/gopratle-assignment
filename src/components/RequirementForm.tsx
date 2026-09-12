"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input, Select } from "./RequirementWorkspace";
import {
  type Category, type Values,
  categoryOptions, eventTypes, serviceOptions, scales,
  experienceOptions, performanceOptions, genres, crewRoles,
  resolveOther,
} from "@/app/Types/types";

export default function RequirementForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [stepKey, setStepKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const {
    register, setValue, watch, getValues, trigger,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      guestCount: 1, performersCount: 1, durationMinutes: 30,
      crewCount: 1, workingHours: 8, flexible: false,
    },
  });

  const category = watch("category");
  const type = watch("type");

  const advance = async () => {
    if (step === 0 && !category) return;
    if (
      step === 1 &&
      !(await trigger(["name", "type", "startDate", "endDate", "location", "venue", "amount"]))
    )
      return;
    setStepKey((k) => k + 1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setStepKey((k) => k + 1);
    setStep((s) => s - 1);
  };

  const submit = async () => {
    const fields =
      category === "planner"
        ? (["services", "guestCount", "eventScale", "experienceLevel"] as const)
        : category === "performer"
          ? (["performanceType", "genre", "performersCount", "durationMinutes"] as const)
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
              performanceType: resolveOther(v.performanceType, v.performanceTypeOther),
              genre: resolveOther(v.genre, v.genreOther),
              performersCount: v.performersCount,
              durationMinutes: v.durationMinutes,
              equipment: v.equipment.split(",").map((x) => x.trim()).filter(Boolean),
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
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      router.push("/requirements");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[linear-gradient(168deg,#fffdf9,#f5f0e8)]">
      <section className="w-full">
        <header className="h-[74px] max-w-[1060px] mx-auto flex justify-between items-center px-7 border-b border-brand-300 animate-fade-in max-md:px-4 max-md:h-16">
          <strong className="text-sm font-extrabold tracking-[-0.2px]">Requirement form</strong>
          <button
            className="border-0 bg-transparent text-brand-700 text-xs font-extrabold transition-all duration-200 hover:text-brand-500 hover:-translate-x-0.5"
            onClick={() => router.push("/requirements")}
          >
            View requirements
          </button>
        </header>

        <div className="max-w-[720px] pt-14 px-7 mx-auto animate-fade-up max-md:pt-7 max-md:px-4">
          {/* Stepper nav */}
          <nav className="flex gap-7 border-b border-brand-300 pb-5 mb-11 max-md:gap-2 max-md:mb-7 max-md:pb-4">
            {["Category", "Event details", "Preferences"].map((name, index) => (
              <span
                className={`text-[11px] font-bold flex items-center gap-2 transition-colors duration-300 max-md:text-[9px] max-md:gap-1.5 ${
                  index <= step ? "text-brand-700" : "text-muted-lighter"
                }`}
                key={name}
              >
                <i
                  className={`grid place-items-center w-[26px] h-[26px] border-2 rounded-full not-italic text-[10px] transition-all duration-300 max-md:w-[22px] max-md:h-[22px] max-md:text-[9px] ${
                    index <= step
                      ? "text-white bg-brand-700 border-brand-700 shadow-[0_2px_8px_rgba(91,58,37,0.25)] scale-[1.08]"
                      : "border-brand-300"
                  }`}
                >
                  {index < step ? "✓" : index + 1}
                </i>
                {name}
              </span>
            ))}
          </nav>

          {/* Step 0: Category selection */}
          {step === 0 && (
            <section className="animate-step" key={`step-${stepKey}`}>
              <h1 className="font-extrabold text-[30px] leading-[1.2] tracking-[-1px] mb-[30px] max-md:text-2xl max-md:mb-5">
                Select a category
              </h1>
              <div className="grid grid-cols-3 gap-3.5 max-md:grid-cols-1 max-md:gap-3">
                {categoryOptions.map((option, idx) => (
                  <button
                    key={option.id}
                    className={`min-h-[250px] text-left border-solid border-[1.5px] p-[18px] rounded-xl transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] animate-fade-up
                      max-md:min-h-0 max-md:grid max-md:grid-cols-[100px_1fr] max-md:gap-x-3.5 max-md:gap-y-0 max-md:p-3.5 max-md:items-center max-[400px]:grid-cols-[70px_1fr]
                      ${category === option.id
                        ? "border-brand-500 bg-brand-50 shadow-[0_4px_16px_rgba(91,58,37,0.12)] -translate-y-0.5"
                        : "border-border bg-surface hover:border-brand-400 hover:bg-surface-hover hover:shadow-[0_6px_20px_rgba(91,58,37,0.08)] hover:-translate-y-[3px]"
                      }`}
                    style={{ animationDelay: `${0.05 + idx * 0.07}s` }}
                    onClick={() => setValue("category", option.id)}
                  >
                    <div className="h-[145px] grid place-items-center overflow-hidden mb-3.5 bg-[#fefcf8] rounded-lg border border-border-subtle max-md:h-20 max-md:mb-0 max-md:row-span-2 max-[400px]:h-[60px]">
                      <img
                        src={option.image}
                        alt=""
                        className={`w-full h-full object-contain transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${option.id === "crew" ? "scale-[1.35]" : ""}`}
                      />
                    </div>
                    <b className="block text-brand-700 text-[15px] mb-2 max-md:self-end max-md:text-sm max-md:mb-0.5">{option.title}</b>
                    <span className="text-muted text-[11px] leading-relaxed max-md:self-start">{option.text}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Step 1: Event details */}
          {step === 1 && (
            <section className="animate-step" key={`step-${stepKey}`}>
              <h1 className="font-extrabold text-[30px] leading-[1.2] tracking-[-1px] mb-[30px] max-md:text-2xl max-md:mb-5">
                Event details
              </h1>
              <div className="grid grid-cols-2 gap-4 mb-[22px] max-md:grid-cols-1">
                <Input label="Event name" error={errors.name?.message}>
                  <input placeholder="Event's Name" {...register("name", { required: "Event name is required" })} />
                </Input>
                <Input label="Event type" error={errors.type?.message}>
                  <Select
                    {...register("type", {
                      required: "Choose an event type",
                      validate: (value) =>
                        value !== "Other" || !!getValues("typeOther").trim() || "Please describe the event",
                    })}
                  >
                    <option value="">Choose event type</option>
                    {eventTypes.map((item) => <option key={item}>{item}</option>)}
                  </Select>
                  {type === "Other" && (
                    <input className="mt-2" placeholder="Describe the event" {...register("typeOther")} />
                  )}
                </Input>
                <Input label="Start date" error={errors.startDate?.message}>
                  <input type="date" {...register("startDate", { required: "Start date is required" })} />
                </Input>
                <Input label="End date" error={errors.endDate?.message}>
                  <input
                    type="date"
                    {...register("endDate", {
                      required: "End date is required",
                      validate: (value) =>
                        !getValues("startDate") || value >= getValues("startDate") ||
                        "End date must be on or after the start date",
                    })}
                  />
                </Input>
                <Input label="City" error={errors.location?.message}>
                  <input placeholder="e.g. Mumbai" {...register("location", { required: "City is required" })} />
                </Input>
                <Input label="Venue" error={errors.venue?.message}>
                  <input placeholder="Venue name or short address" {...register("venue", { required: "Venue is required" })} />
                </Input>
                <Input label="Budget (₹)" error={errors.amount?.message}>
                  <input
                    type="number" min="1" placeholder="50,000"
                    {...register("amount", { valueAsNumber: true, min: { value: 1, message: "Enter a valid budget" } })}
                  />
                </Input>
                <label className="self-end pb-3 text-muted text-xs">
                  <input type="checkbox" className="accent-brand-700 mr-[7px]" {...register("flexible")} />
                  Budget has some flexibility
                </label>
              </div>
            </section>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <section className="animate-step" key={`step-${stepKey}`}>
              <h1 className="font-extrabold text-[30px] leading-[1.2] tracking-[-1px] mb-[30px] max-md:text-2xl max-md:mb-5">
                Preferences
              </h1>
              <Details category={category} register={register} errors={errors} watch={watch} getValues={getValues} />
              <Input label="Additional notes">
                <textarea placeholder="Optional notes" {...register("notes")} />
              </Input>
            </section>
          )}

          {/* Footer */}
          <footer className="flex justify-between items-center border-t border-brand-300 mt-[38px] py-[22px] max-md:mt-7 max-md:py-[18px]">
            {step ? (
              <button
                className="border-0 bg-transparent text-brand-700 text-xs font-extrabold transition-all duration-200 hover:text-brand-500 hover:-translate-x-0.5"
                onClick={goBack}
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <button
                className="border-0 rounded-lg px-5 py-3 bg-brand-700 text-surface text-xs font-extrabold transition-all duration-200 shadow-[0_2px_8px_rgba(91,58,37,0.15)] hover:bg-brand-600 hover:shadow-[0_4px_14px_rgba(91,58,37,0.2)] hover:-translate-y-px active:translate-y-0"
                disabled={step === 0 && !category}
                onClick={() => void advance()}
              >
                Continue
              </button>
            ) : (
              <button
                className="border-0 rounded-lg px-5 py-3 bg-brand-700 text-surface text-xs font-extrabold transition-all duration-200 shadow-[0_2px_8px_rgba(91,58,37,0.15)] hover:bg-brand-600 hover:shadow-[0_4px_14px_rgba(91,58,37,0.2)] hover:-translate-y-px active:translate-y-0"
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
  category, register, errors, watch, getValues,
}: {
  category?: Category;
  register: ReturnType<typeof useForm<Values>>["register"];
  errors: ReturnType<typeof useForm<Values>>["formState"]["errors"];
  watch: ReturnType<typeof useForm<Values>>["watch"];
  getValues: ReturnType<typeof useForm<Values>>["getValues"];
}) {
  const services = watch("services");
  const performanceType = watch("performanceType");
  const genre = watch("genre");
  const role = watch("role");

  const opts = (items: string[]) => items.map((item) => <option key={item}>{item}</option>);

  if (category === "planner")
    return (
      <div className="grid grid-cols-2 gap-4 mb-[22px] max-md:grid-cols-1">
        <Input label="Main support needed" error={errors.services?.message}>
          <Select
            {...register("services", {
              required: "Choose a service",
              validate: (v) => v !== "Other" || !!getValues("servicesOther").trim() || "Please describe the service",
            })}
          >
            <option value="">Choose a service</option>
            {opts(serviceOptions)}
          </Select>
          {services === "Other" && (
            <input className="mt-2" placeholder="Describe the service" {...register("servicesOther")} />
          )}
        </Input>
        <Input label="Expected guests">
          <input type="number" min="1" {...register("guestCount", { valueAsNumber: true, min: 1 })} />
        </Input>
        <Input label="Event scale" error={errors.eventScale?.message}>
          <Select {...register("eventScale", { required: "Choose the scale" })}>
            <option value="">Choose the scale</option>
            {opts(scales)}
          </Select>
        </Input>
        <Input label="Planner experience" error={errors.experienceLevel?.message}>
          <Select {...register("experienceLevel", { required: "Choose an experience level" })}>
            <option value="">Choose experience</option>
            {opts(experienceOptions)}
          </Select>
        </Input>
      </div>
    );

  if (category === "performer")
    return (
      <div className="grid grid-cols-2 gap-4 mb-[22px] max-md:grid-cols-1">
        <Input label="Performance type" error={errors.performanceType?.message}>
          <Select
            {...register("performanceType", {
              required: "Choose a performance type",
              validate: (v) => v !== "Other" || !!getValues("performanceTypeOther").trim() || "Please describe the performance",
            })}
          >
            <option value="">Choose an act</option>
            {opts(performanceOptions)}
          </Select>
          {performanceType === "Other" && (
            <input className="mt-2" placeholder="Describe the act" {...register("performanceTypeOther")} />
          )}
        </Input>
        <Input label="Genre" error={errors.genre?.message}>
          <Select
            {...register("genre", {
              required: "Choose a genre",
              validate: (v) => v !== "Other" || !!getValues("genreOther").trim() || "Please describe the genre",
            })}
          >
            <option value="">Choose a genre</option>
            {opts(genres)}
          </Select>
          {genre === "Other" && (
            <input className="mt-2" placeholder="Describe the genre" {...register("genreOther")} />
          )}
        </Input>
        <Input label="Number of performers">
          <input type="number" min="1" {...register("performersCount", { valueAsNumber: true, min: 1 })} />
        </Input>
        <Input label="Set length (minutes)">
          <input type="number" min="1" {...register("durationMinutes", { valueAsNumber: true, min: 1 })} />
        </Input>
        <Input label="Equipment needed">
          <input placeholder="Optional: mic, speakers, lights" {...register("equipment")} />
        </Input>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4 mb-[22px] max-md:grid-cols-1">
      <Input label="Crew role" error={errors.role?.message}>
        <Select
          {...register("role", {
            required: "Choose a crew role",
            validate: (v) => v !== "Other" || !!getValues("roleOther").trim() || "Please describe the role",
          })}
        >
          <option value="">Choose a role</option>
          {opts(crewRoles)}
        </Select>
        {role === "Other" && (
          <input className="mt-2" placeholder="Describe the role" {...register("roleOther")} />
        )}
      </Input>
      <Input label="Crew count">
        <input type="number" min="1" {...register("crewCount", { valueAsNumber: true, min: 1 })} />
      </Input>
      <Input label="Experience" error={errors.experience?.message}>
        <Select {...register("experience", { required: "Choose experience" })}>
          <option value="">Choose experience</option>
          {opts(experienceOptions)}
        </Select>
      </Input>
      <Input label="Working hours">
        <input type="number" min="1" {...register("workingHours", { valueAsNumber: true, min: 1 })} />
      </Input>
    </div>
  );
}