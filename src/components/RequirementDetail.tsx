"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Requirement } from "@/app/Types/types";

export default function RequirementDetail({ requirementId }: { requirementId?: string }) {
  const router = useRouter();
  const [detail, setDetail] = useState<Requirement | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!requirementId) return;
    const load = async () => {
      setBusy(true);
      try {
        const res = await fetch(`/api/requierment/${requirementId}`);
        const json = await res.json();
        if (json.success) setDetail(json.data);
      } finally {
        setBusy(false);
      }
    };
    void load();
  }, [requirementId]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

  const labelClass = "block text-muted-light text-[10px] font-semibold uppercase tracking-[0.6px]";
  const valueClass = "block mt-1.5 text-xs font-bold capitalize";
  const cardClass = "m-0 p-3.5 bg-surface-card rounded-[10px] border border-border-subtle transition-all duration-200 hover:bg-brand-50 hover:border-border";

  return (
    <main className="min-h-screen bg-[linear-gradient(168deg,#fffdf9,#f5f0e8)] pb-[60px]">
      <header className="h-[74px] max-w-[1060px] mx-auto flex justify-between items-center px-7 border-b border-brand-300 animate-fade-in max-md:px-4 max-md:h-16">
        <strong className="text-sm font-extrabold tracking-[-0.2px]">Requirement details</strong>
        <button
          className="border-0 bg-transparent text-brand-700 text-xs font-extrabold transition-all duration-200 hover:text-brand-500 hover:-translate-x-0.5"
          onClick={() => router.push("/requirements")}
        >
          ← Back to requirements
        </button>
      </header>

      <div className="max-w-[780px] px-7 mx-auto mt-[46px] max-md:px-4">
        {busy ? (
          <div className="flex items-center justify-center py-[60px] px-5 flex-col gap-4 animate-fade-in">
            <span className="w-8 h-8 rounded-full border-[3px] border-brand-200 border-t-brand-700 animate-spin" />
            <span className="text-xs text-muted-light font-semibold">Loading details…</span>
          </div>
        ) : detail ? (
          <section className="bg-surface border-[1.5px] border-border rounded-[14px] overflow-hidden shadow-[0_4px_20px_rgba(91,58,37,0.06)] animate-scale-in">
            {/* Heading */}
            <div className="p-[30px] flex justify-between items-start border-b border-border-light bg-[linear-gradient(135deg,#fffdf9,#faf5ed)] max-md:p-4 max-md:flex-col max-md:gap-2">
              <div>
                <span className={labelClass}>Requirement</span>
                <h1 className="mt-1.5 m-0 text-2xl font-extrabold max-md:text-xl">{detail.event.name}</h1>
              </div>
              <span className="inline-block mt-3 py-[5px] px-3 bg-[linear-gradient(135deg,#f0e3ce,#e8d9c4)] text-brand-700 rounded-[20px] text-[10px] font-bold capitalize tracking-[0.3px]">
                {detail.status}
              </span>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-[18px] py-[22px] px-[30px] bg-surface-alt border-b border-border-light max-md:grid-cols-1 max-md:py-[18px] max-md:px-4">
              <p className="m-0 animate-fade-up max-md:p-3 max-md:bg-surface-card max-md:rounded-lg max-md:border max-md:border-border-subtle" style={{ animationDelay: "0.1s" }}>
                <small className={labelClass}>Category</small>
                <b className={valueClass}>{detail.category}</b>
              </p>
              <p className="m-0 animate-fade-up max-md:p-3 max-md:bg-surface-card max-md:rounded-lg max-md:border max-md:border-border-subtle" style={{ animationDelay: "0.15s" }}>
                <small className={labelClass}>Reference ID</small>
                <b className={valueClass}>{detail.requirementId}</b>
              </p>
              <p className="m-0 animate-fade-up max-md:p-3 max-md:bg-surface-card max-md:rounded-lg max-md:border max-md:border-border-subtle" style={{ animationDelay: "0.2s" }}>
                <small className={labelClass}>Budget</small>
                <b className={valueClass}>
                  ₹{detail.budget.amount.toLocaleString()}
                  {detail.budget.flexible ? " (flexible)" : ""}
                </b>
              </p>
            </div>

            {/* Event information */}
            <section className="py-[26px] px-[30px] border-b border-border-light animate-fade-up transition-colors duration-200 hover:bg-[#fdfaf5] max-md:py-5 max-md:px-4" style={{ animationDelay: "0.15s" }}>
              <h2 className="m-0 mb-[18px] text-sm font-extrabold flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-[linear-gradient(135deg,#f0e3ce,#e8d9c4)] rounded-lg text-sm">📅</span>
                Event information
              </h2>
              <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
                <p className={cardClass}><small className={labelClass}>Event type</small><b className={valueClass}>{detail.event.type}</b></p>
                <p className={cardClass}>
                  <small className={labelClass}>Date range</small>
                  <b className={valueClass}>{formatDate(detail.event.startDate)} — {formatDate(detail.event.endDate)}</b>
                </p>
                <p className={cardClass}><small className={labelClass}>City</small><b className={valueClass}>{detail.event.location}</b></p>
                <p className={cardClass}><small className={labelClass}>Venue</small><b className={valueClass}>{detail.event.venue}</b></p>
              </div>
            </section>

            {/* Category preferences */}
            <section className="py-[26px] px-[30px] border-b border-border-light animate-fade-up transition-colors duration-200 hover:bg-[#fdfaf5] last:border-b-0 max-md:py-5 max-md:px-4" style={{ animationDelay: "0.25s" }}>
              <h2 className="m-0 mb-[18px] text-sm font-extrabold flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-[linear-gradient(135deg,#f0e3ce,#e8d9c4)] rounded-lg text-sm">⚙️</span>
                Category preferences
              </h2>
              <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
                {Object.entries(detail.categoryDetails || {})
                  .filter(([key]) =>
                    !["_id", "requirementId", "createdAt", "updatedAt", "__v"].includes(key),
                  )
                  .map(([key, value]) => (
                    <p key={key} className={cardClass}>
                      <small className={labelClass}>{key.replace(/([A-Z])/g, " $1")}</small>
                      <b className={valueClass}>{Array.isArray(value) ? value.join(", ") : String(value)}</b>
                    </p>
                  ))}
              </div>
            </section>

            {/* Additional notes */}
            {detail.additionalRequirements && (
              <section className="py-[26px] px-[30px] animate-fade-up transition-colors duration-200 hover:bg-[#fdfaf5] max-md:py-5 max-md:px-4" style={{ animationDelay: "0.35s" }}>
                <h2 className="m-0 mb-[18px] text-sm font-extrabold flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-[linear-gradient(135deg,#f0e3ce,#e8d9c4)] rounded-lg text-sm">📝</span>
                  Additional notes
                </h2>
                <p className="m-0 text-[13px] leading-[1.7] whitespace-pre-wrap bg-surface-card p-4 rounded-[10px] border border-border-subtle">
                  {detail.additionalRequirements}
                </p>
              </section>
            )}
          </section>
        ) : (
          <div className="text-muted text-center py-[60px] px-5 text-[13px] animate-fade-in">
            <span className="block text-[32px] mb-3">📋</span>
            Requirement not found.
          </div>
        )}
      </div>
    </main>
  );
}