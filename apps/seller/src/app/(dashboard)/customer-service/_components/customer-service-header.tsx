"use client";

import { Button } from "@/components/ui";
import { History, Plus } from "lucide-react";

type CustomerServiceHeaderProps = {
  eyebrow: string;
  title: string;
  actionHistory: string;
  actionCreate: string;
  onOpenHistory?: () => void;
  onCreateComplaint?: () => void;
};

export function CustomerServiceHeader({
  eyebrow,
  title,
  actionHistory,
  actionCreate,
  onOpenHistory,
  onCreateComplaint,
}: CustomerServiceHeaderProps) {
  const noop = () => {};

  const handleOpenHistory = () => {
    (onOpenHistory ?? noop)();
  };

  const handleCreateComplaint = () => {
    (onCreateComplaint ?? noop)();
  };

  return (
    <header className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={handleOpenHistory}
        >
          <History aria-hidden="true" data-icon="inline-start" />
          {actionHistory}
        </Button>
        <Button
          type="button"
          variant="default"
          className="h-11 rounded-lg border border-blue-500 bg-blue-500 px-4 text-sm font-semibold text-white hover:bg-blue-500/90"
          onClick={handleCreateComplaint}
        >
          <Plus aria-hidden="true" data-icon="inline-start" />
          {actionCreate}
        </Button>
      </div>
    </header>
  );
}
