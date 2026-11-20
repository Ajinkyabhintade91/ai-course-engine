'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, GraduationCap, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Blueprint, BlueprintModule } from '@/lib/types';

interface SidebarProps {
  blueprint: Blueprint;
  availability: Record<string, boolean>;
  activeSlug: string | null;
  completed: Set<string>;
  open: boolean;
  /** Phone layout: the open sidebar floats over the page instead of taking a column. */
  overlay?: boolean;
  onToggleOpen: () => void;
  onSelect: (slug: string) => void;
  onToggleCompleted: (slug: string) => void;
}

interface Unit {
  unitId: string;
  unitTitle: string;
  modules: BlueprintModule[];
}

export function Sidebar({
  blueprint,
  availability,
  activeSlug,
  completed,
  open,
  overlay = false,
  onToggleOpen,
  onSelect,
  onToggleCompleted,
}: SidebarProps) {
  const units = useMemo<Unit[]>(() => {
    const byId = new Map<string, Unit>();
    for (const mod of blueprint.modules) {
      if (!byId.has(mod.unitId)) byId.set(mod.unitId, { unitId: mod.unitId, unitTitle: mod.unitTitle, modules: [] });
      byId.get(mod.unitId)!.modules.push(mod);
    }
    return [...byId.values()];
  }, [blueprint]);

  const activeUnitId = blueprint.modules.find((m) => m.slug === activeSlug)?.unitId;
  // Units the user has explicitly opened or closed; anything not listed follows the active module.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const isExpanded = (unitId: string) => overrides[unitId] ?? unitId === activeUnitId;

  const total = blueprint.modules.length;
  const doneCount = blueprint.modules.filter((m) => completed.has(m.slug)).length;
  const readyCount = blueprint.modules.filter((m) => availability[m.slug]).length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const rail = (
      <aside className="flex w-12 shrink-0 flex-col items-center border-r border-zinc-800 bg-zinc-900 py-3">
        <button
          type="button"
          onClick={onToggleOpen}
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Open syllabus sidebar"
          title="Open syllabus"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
        <div className="mt-4 text-[11px] font-semibold tabular-nums text-zinc-500 [writing-mode:vertical-rl]">
          {doneCount} / {total} complete
        </div>
      </aside>
  );

  if (!open) return rail;

  const panel = (
    <aside
      className={cn(
        'flex w-80 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900',
        overlay && 'fixed inset-y-0 left-0 z-40 max-w-[85vw] shadow-2xl shadow-black/60',
      )}
      onKeyDown={(event) => {
        if (overlay && event.key === 'Escape') onToggleOpen();
      }}
    >
      <header className="border-b border-zinc-800 px-4 pb-4 pt-3">
        <div className="flex items-start gap-2">
          <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
          <h1 className="flex-1 text-sm font-semibold leading-snug text-zinc-50">{blueprint.courseTitle}</h1>
          <button
            type="button"
            onClick={onToggleOpen}
            className="-mr-1 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Collapse syllabus sidebar"
            title="Collapse syllabus"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-zinc-300">Your progress</span>
            <span className="tabular-nums text-zinc-400">
              {doneCount} / {total} · {percent}%
            </span>
          </div>
          <div
            className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course completion"
          >
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-[11px] tabular-nums text-zinc-500">
            {readyCount} of {total} modules generated
          </p>
        </div>
      </header>

      <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Syllabus">
        {units.map((unit) => {
          const expanded = isExpanded(unit.unitId);
          const unitDone = unit.modules.filter((m) => completed.has(m.slug)).length;
          return (
            <section key={unit.unitId} className="mb-1">
              <button
                type="button"
                onClick={() => setOverrides((prev) => ({ ...prev, [unit.unitId]: !expanded }))}
                aria-expanded={expanded}
                className="flex w-full items-start gap-1.5 rounded-md px-2 py-2 text-left hover:bg-zinc-800/70"
              >
                {expanded ? (
                  <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                ) : (
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                )}
                <span className="flex-1 text-[13px] font-semibold leading-snug text-zinc-200">{unit.unitTitle}</span>
                <span className="mt-0.5 shrink-0 text-[11px] tabular-nums text-zinc-500">
                  {unitDone}/{unit.modules.length}
                </span>
              </button>

              {expanded && (
                <ul className="mb-2 ml-3 border-l border-zinc-800 pl-1">
                  {unit.modules.map((mod) => {
                    const ready = !!availability[mod.slug];
                    const active = mod.slug === activeSlug;
                    const done = completed.has(mod.slug);
                    return (
                      <li key={mod.slug}>
                        <div
                          className={cn(
                            'group flex items-center gap-2 rounded-md py-1.5 pl-2 pr-1.5',
                            active ? 'bg-sky-500/10 ring-1 ring-inset ring-sky-500/30' : 'hover:bg-zinc-800/60',
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => onToggleCompleted(mod.slug)}
                            className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-zinc-600 bg-zinc-800 accent-emerald-500"
                            aria-label={`Mark "${mod.moduleTitle}" as completed`}
                            title="Mark as completed"
                          />
                          <button
                            type="button"
                            onClick={() => onSelect(mod.slug)}
                            aria-current={active ? 'page' : undefined}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                          >
                            <span
                              className={cn(
                                'min-w-0 flex-1 text-[13px] leading-snug',
                                active ? 'font-medium text-sky-200' : 'text-zinc-300',
                                done && !active && 'text-zinc-500 line-through decoration-zinc-600',
                              )}
                            >
                              <span className="mr-1.5 tabular-nums text-zinc-500">{mod.moduleId.replace('MOD-', '')}</span>
                              {mod.moduleTitle}
                            </span>
                            {ready ? (
                              <span className="shrink-0 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                Ready
                              </span>
                            ) : (
                              <span className="shrink-0 animate-pulse rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                                Pending
                              </span>
                            )}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </nav>
    </aside>
  );

  if (!overlay) return panel;
  // Phone: keep the slim rail in the layout and float the full syllabus over the page with a backdrop.
  return (
    <>
      {rail}
      <button
        type="button"
        aria-label="Close syllabus"
        onClick={onToggleOpen}
        className="fixed inset-0 z-30 bg-black/60"
      />
      {panel}
    </>
  );
}
