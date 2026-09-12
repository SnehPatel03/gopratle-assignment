"use client";
import type { WorkspaceProps } from "@/app/Types/types";

import RequirementDetail from "./RequirementDetail";
import RequirementList from "./RequirementList";
import RequirementForm from "./RequirementForm";

export function Input({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field block text-brand-700 text-[11px] font-extrabold">
      <span className="block mb-2">{label}</span>
      {children}
      {error && <small className="block mt-1.5 text-error text-[10px]">{error}</small>}
    </label>
  );
}

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props}>{children}</select>;
}

export default function RequirementWorkspace({
  page = "form",
  requirementId,
}: WorkspaceProps) {
  if (page === "list") return <RequirementList />;
  if (page === "detail") return <RequirementDetail requirementId={requirementId} />;
  return <RequirementForm />;
}