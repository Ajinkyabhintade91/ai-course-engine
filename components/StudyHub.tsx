'use client';

import { useState } from 'react';
import { BookOpen, CircleAlert, CirclePlay, Clock, Hourglass } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { BlueprintModule, CourseModule } from '@/lib/types';
import { ReadingView } from './ReadingView';
import { VideoLibrary } from './VideoLibrary';

type Tab = 'book' | 'videos';

interface StudyHubProps {
  blueprintModule: BlueprintModule | null;
  module: CourseModule | null;
  loading: boolean;
  /** The module could not be loaded (the error itself is shown in the banner above). */
  failed?: boolean;
}

export function StudyHub({ blueprintModule, module, loading, failed = false }: StudyHubProps) {
  const [tab, setTab] = useState<Tab>('book');

  if (!blueprintModule) {
    return (
      <section className="flex min-w-0 flex-1 items-center justify-center bg-zinc-950 p-8 text-sm text-zinc-400">
        Select a module from the syllabus to begin.
      </section>
    );
  }

  // The syllabus title is used everywhere (sidebar and header) so the two always agree.
  const title = blueprintModule.moduleTitle;
  const difficulty = module?.difficulty ?? blueprintModule.difficulty;

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-zinc-950">
      <header className="border-b border-zinc-800 px-6 pt-4">
        <p className="text-xs font-medium text-zinc-500">
          {blueprintModule.unitTitle} · {blueprintModule.moduleId}
        </p>
        <h2 className="mt-1 text-xl font-semibold leading-tight text-zinc-50" style={{ textWrap: 'balance' }}>
          {title}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-medium text-zinc-300">{difficulty}</span>
          {module && (
            <span className="inline-flex items-center gap-1 tabular-nums text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              {module.estimatedMinutes} min
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-1" role="tablist" aria-label="Study material">
          <TabButton id="tab-book" active={tab === 'book'} onClick={() => setTab('book')} icon={<BookOpen className="h-4 w-4" />}>
            Reference Book
          </TabButton>
          <TabButton id="tab-videos" active={tab === 'videos'} onClick={() => setTab('videos')} icon={<CirclePlay className="h-4 w-4" />}>
            Video Library — Free &amp; Paid
            {module && <span className="ml-1 tabular-nums text-zinc-500">{module.videoLibrary.length}</span>}
          </TabButton>
        </div>
      </header>

      <div
        id="study-panel"
        className="min-h-0 flex-1 overflow-y-auto"
        role="tabpanel"
        aria-labelledby={tab === 'book' ? 'tab-book' : 'tab-videos'}
      >
        {loading && !module ? (
          <p className="p-8 text-sm text-zinc-400">Loading module…</p>
        ) : !module && failed ? (
          <p className="inline-flex items-center gap-2 p-8 text-sm text-red-300">
            <CircleAlert className="h-4 w-4" />
            This module could not be loaded. See the message above.
          </p>
        ) : !module ? (
          <PendingModule blueprintModule={blueprintModule} />
        ) : tab === 'book' ? (
          <ReadingView markdown={module.readingMarkdown} citations={module.citations ?? []} />
        ) : (
          <VideoLibrary videos={module.videoLibrary ?? []} />
        )}
      </div>
    </section>
  );
}

function TabButton({
  id,
  active,
  onClick,
  icon,
  children,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      id={id}
      role="tab"
      aria-controls="study-panel"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        '-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium',
        active ? 'border-sky-500 text-sky-300' : 'border-transparent text-zinc-400 hover:text-zinc-200',
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

/** Shown for modules that are in the blueprint but have not been generated to content/modules yet. */
function PendingModule({ blueprintModule }: { blueprintModule: BlueprintModule }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
          <Hourglass className="h-4 w-4" />
          This module has not been generated yet
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          It is queued in <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs">content/blueprint.json</code>. Once its
          chapter, videos, and lab are written and verified, it will switch to <span className="text-emerald-400">Ready</span>{' '}
          here automatically.
        </p>
      </div>
      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-400">Planned coverage</h3>
      <ul className="mt-3 space-y-2">
        {blueprintModule.subTopics.map((topic) => (
          <li key={topic} className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200">
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}
