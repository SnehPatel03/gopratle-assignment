"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Requirement } from "@/app/Types/types";

export default function RequirementList() {
  const router = useRouter();
  const [items, setItems] = useState<Requirement[]>([]);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setBusy(true);
      try {
        const res = await fetch("/api/requierment");
        const json = await res.json();
        if (json.success) setItems(json.data);
      } finally {
        setBusy(false);
        setLoaded(true);
      }
    };
    void load();
  }, []);

  const badgeColor = (cat: string) =>
    cat === "planner"
      ? "bg-[#e8f4e8] text-[#2d6a2d]"
      : cat === "performer"
        ? "bg-[#e8e4f4] text-[#5a3d8a]"
        : "bg-[#f4ece4] text-[#7a5c3a]";

  return (
    <main className="min-h-screen bg-[linear-gradient(168deg,#fffdf9,#f5f0e8)] pb-[60px]">
      <header className="h-[74px] max-w-[1060px] mx-auto flex justify-between items-center px-7 border-b border-brand-300 animate-fade-in max-md:px-4 max-md:h-16">
        <strong className="text-sm font-extrabold tracking-[-0.2px]">Requirements</strong>
        <button
          className="border-0 rounded-lg px-5 py-3 bg-brand-700 text-surface text-xs font-extrabold transition-all duration-200 shadow-[0_2px_8px_rgba(91,58,37,0.15)] hover:bg-brand-600 hover:shadow-[0_4px_14px_rgba(91,58,37,0.2)] hover:-translate-y-px"
          onClick={() => router.push("/")}
        >
          + New requirement
        </button>
      </header>

      <div className="max-w-[1060px] mt-[46px] mx-auto mb-[26px] px-7 animate-fade-up max-md:mt-7 max-md:px-4">
        <h1 className="m-0 font-extrabold text-[30px] leading-[1.2] tracking-[-1px] max-md:text-2xl">
          Requirements
        </h1>
      </div>

      <div className="max-w-[1060px] px-7 mx-auto max-md:px-4">
        <section className="bg-surface border-[1.5px] border-border rounded-[14px] overflow-hidden shadow-[0_2px_12px_rgba(91,58,37,0.04)] animate-fade-up [animation-delay:0.1s]">
          <div className="py-5 px-6 flex justify-between items-center border-b border-border-light max-md:p-4">
            <h2 className="m-0 text-[15px] font-bold">All requests</h2>
            <span className="bg-brand-50 text-muted px-2.5 py-1 rounded-[20px] font-semibold text-[11px]">
              {items.length} total
            </span>
          </div>

          {busy && (
            <div className="flex items-center justify-center py-[60px] px-5 flex-col gap-4 animate-fade-in">
              <span className="w-8 h-8 rounded-full border-[3px] border-brand-200 border-t-brand-700 animate-spin" />
              <span className="text-xs text-muted-light font-semibold">Loading requirements…</span>
            </div>
          )}

          {!busy && !items.length && loaded && (
            <div className="text-muted text-center py-[60px] px-5 text-[13px] animate-fade-in">
              <span className="block text-[32px] mb-3">📋</span>
              No requirements submitted yet.
            </div>
          )}

          {items.map((item, index) => (
            <button
              className="group w-full border-0 border-b border-border-light bg-surface py-[18px] px-6 flex items-center gap-3.5 text-left transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] animate-fade-up last:border-b-0 hover:bg-brand-50 hover:pl-7 max-md:py-4 max-md:px-4 max-md:hover:pl-5"
              onClick={() => router.push(`/requirements/${item._id}`)}
              key={item._id}
              style={{ animationDelay: `${0.05 + index * 0.04}s` }}
            >
              <span className="flex-1">
                <b className="block text-[13px] mb-[3px]">{item.event.name}</b>
                <small className="block text-muted text-[10px]">
                  {item.requirementId} ·{" "}
                  <span className={`inline-block py-[3px] px-2.5 rounded-[20px] text-[9px] font-bold uppercase tracking-[0.5px] ${badgeColor(item.category)}`}>
                    {item.category}
                  </span>
                </small>
              </span>
              <em className="text-muted text-[10px] not-italic">{new Date(item.createdAt).toLocaleDateString()}</em>
              <strong className="text-brand-500 text-lg transition-transform duration-200 group-hover:translate-x-[3px]">›</strong>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}