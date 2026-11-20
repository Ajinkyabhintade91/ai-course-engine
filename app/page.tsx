'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, FlaskConical } from 'lucide-react';
import { LabPane } from '@/components/LabPane';
import { Sidebar } from '@/components/Sidebar';
import { StudyHub } from '@/components/StudyHub';
import { cn } from '@/lib/cn';
import { readStored, writeStored } from '@/lib/storage';
import type { Blueprint, CourseModule, CourseResponse } from '@/lib/types';

const COMPLETED_KEY = 'ace:completed';
const SIDEBAR_KEY = 'ace:sidebar-open';
const LAST_MODULE_KEY = 'ace:last-module';
const REFRESH_MS = 20_000;
/** Below this width the syllabus becomes an overlay drawer instead of a column. */
const NARROW_QUERY = '(max-width: 767px)';

export default function CoursePlayer() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [narrowPane, setNarrowPane] = useState<'study' | 'lab'>('study');
  const activeSlugRef = useRef<string | null>(null);
  const requestId = useRef(0);
  const allReadyRef = useRef(false);
  const [narrowScreen, setNarrowScreen] = useState(false);

  const load = useCallback(async (slug: string | null, options: { quiet?: boolean } = {}) => {
    const id = ++requestId.current;
    if (!options.quiet) setLoading(true);
    try {
      const response = await fetch(`/api/course${slug ? `?module=${encodeURIComponent(slug)}` : ''}`, { cache: 'no-store' });
      const data = await response.json();
      if (id !== requestId.current) return; // a newer request superseded this one
      if (!response.ok) {
        setError(data?.error ?? `The course API returned ${response.status}.`);
        return;
      }
      const course = data as CourseResponse;
      setError(course.moduleError ?? null);
      setBlueprint(course.blueprint);
      setAvailability(course.availability);
      allReadyRef.current = Object.values(course.availability).every(Boolean);
      setActiveSlug(course.activeSlug);
      activeSlugRef.current = course.activeSlug;
      // On background refreshes keep the module object stable unless it just became available,
      // so the lab editor is not remounted under the learner.
      setActiveModule((current) =>
        options.quiet && current && current.slug === course.activeModule?.slug ? current : course.activeModule,
      );
    } catch (err) {
      if (id === requestId.current) setError(`Could not load the course: ${String(err)}`);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // First load: restore saved preferences, then reopen the last module the learner was on.
  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY);
    setNarrowScreen(query.matches);
    setCompleted(new Set(readStored<string[]>(COMPLETED_KEY, [])));
    // On a phone the syllabus is an overlay, so start with it closed whatever was saved on a desktop.
    setSidebarOpen(query.matches ? false : readStored<boolean>(SIDEBAR_KEY, true));
    void load(readStored<string | null>(LAST_MODULE_KEY, null));
    const onChange = (event: MediaQueryListEvent) => {
      setNarrowScreen(event.matches);
      if (event.matches) setSidebarOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [load]);

  // Poll so modules flip from Pending to Ready while the content engine is still generating.
  // Once every module is ready there is nothing left to wait for, so polling stops.
  useEffect(() => {
    const timer = setInterval(() => {
      if (allReadyRef.current) return;
      if (document.visibilityState === 'visible') void load(activeSlugRef.current, { quiet: true });
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const selectModule = (slug: string) => {
    if (narrowScreen) setSidebarOpen(false);
    if (slug === activeSlug) return;
    setActiveSlug(slug);
    activeSlugRef.current = slug;
    setActiveModule(null);
    setNarrowPane('study');
    writeStored(LAST_MODULE_KEY, slug);
    void load(slug);
  };

  const toggleCompleted = (slug: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      writeStored(COMPLETED_KEY, [...next]);
      return next;
    });
  };

  // Passing every lab step marks the module complete (it never un-marks it).
  const markCompleted = useCallback((slug: string) => {
    setCompleted((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev).add(slug);
      writeStored(COMPLETED_KEY, [...next]);
      return next;
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      // The phone overlay state is not saved, so it does not close the sidebar on the desktop.
      if (!narrowScreen) writeStored(SIDEBAR_KEY, !prev);
      return !prev;
    });
  };

  if (error && !blueprint) {
    return (
      <main className="flex h-screen items-center justify-center p-8">
        <div className="max-w-md rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
          <p className="font-semibold">The course could not be loaded.</p>
          <p className="mt-2 text-red-300/90">{error}</p>
          <button
            type="button"
            onClick={() => void load(activeSlugRef.current)}
            className="mt-4 rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100 hover:bg-zinc-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!blueprint) {
    return <main className="flex h-screen items-center justify-center text-sm text-zinc-400">Loading course…</main>;
  }

  const blueprintModule = blueprint.modules.find((m) => m.slug === activeSlug) ?? null;

  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar
        blueprint={blueprint}
        availability={availability}
        activeSlug={activeSlug}
        completed={completed}
        open={sidebarOpen}
        overlay={narrowScreen}
        onToggleOpen={toggleSidebar}
        onSelect={selectModule}
        onToggleCompleted={toggleCompleted}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {error && (
          <div role="alert" className="flex items-start gap-3 border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-200">
            <p className="min-w-0 flex-1">{error}</p>
            <button
              type="button"
              onClick={() => void load(activeSlugRef.current)}
              className="shrink-0 rounded-md bg-zinc-800 px-2 py-1 font-medium text-zinc-100 hover:bg-zinc-700"
            >
              Try again
            </button>
          </div>
        )}
        {/* Below the xl breakpoint there is not room for both panes, so show one at a time. */}
        <div className="flex border-b border-zinc-800 bg-zinc-900 xl:hidden" role="group" aria-label="Choose pane">
          <PaneSwitch active={narrowPane === 'study'} onClick={() => setNarrowPane('study')} icon={<BookOpen className="h-4 w-4" />}>
            Study
          </PaneSwitch>
          <PaneSwitch active={narrowPane === 'lab'} onClick={() => setNarrowPane('lab')} icon={<FlaskConical className="h-4 w-4" />}>
            Interactive Lab
          </PaneSwitch>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className={cn('min-w-0 flex-1', narrowPane === 'study' ? 'flex' : 'hidden xl:flex')}>
            <StudyHub blueprintModule={blueprintModule} module={activeModule} loading={loading} failed={!!error} />
          </div>
          <div
            className={cn(
              'min-w-0 border-zinc-800 xl:w-[44%] xl:max-w-[760px] xl:shrink-0 xl:border-l',
              narrowPane === 'lab' ? 'block flex-1' : 'hidden xl:block',
            )}
          >
            {activeModule ? (
              <LabPane key={activeModule.slug} module={activeModule} onAllPassed={markCompleted} />
            ) : (
              <div className="flex h-full items-center justify-center bg-zinc-900 p-8 text-center text-sm text-zinc-500">
                {loading ? 'Loading lab…' : 'The interactive lab unlocks once this module has been generated.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function PaneSwitch({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex flex-1 items-center justify-center gap-2 border-b-2 px-3 py-2 text-sm font-medium',
        active ? 'border-sky-500 text-sky-300' : 'border-transparent text-zinc-400 hover:text-zinc-200',
      )}
    >
      {icon}
      {children}
    </button>
  );
}
