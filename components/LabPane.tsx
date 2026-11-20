'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Eye,
  EyeOff,
  FlaskConical,
  Lightbulb,
  LoaderCircle,
  Lock,
  LockOpen,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { readStored, removeStored, writeStored } from '@/lib/storage';
import type { CourseModule, RunResult } from '@/lib/types';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-xs text-zinc-500">Loading editor…</div>,
});

interface TerminalEntry {
  label: string;
  result?: RunResult;
  error?: string;
}

/**
 * Pane 3: Codecademy-style lab. Parent renders this with key={module.slug}, so state resets per module.
 * Progress (passed steps) and the learner's code are persisted per module in localStorage.
 */
/** Small stable hash, used to notice when a lab's starter code has changed since the learner saved work. */
function hashText(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

interface SavedCode {
  code: string;
  starter: string;
}

export function LabPane({ module, onAllPassed }: { module: CourseModule; onAllPassed?: (slug: string) => void }) {
  const lab = module.interactiveLab;
  const steps = [...lab.steps].sort((a, b) => a.stepNumber - b.stepNumber);
  const codeKey = `ace:code:${module.slug}`;
  const progressKey = `ace:lab:${module.slug}`;
  const starterHash = hashText(lab.starterCode);

  const [code, setCode] = useState(lab.starterCode);
  const [passed, setPassed] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [hintConceptualOpen, setHintConceptualOpen] = useState(false);
  const [hintSyntaxOpen, setHintSyntaxOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [starterChanged, setStarterChanged] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore saved work once on mount (client only, so server and client markup match).
  useEffect(() => {
    // Saved code is stored with a hash of the starter it was written against. Older saves are plain strings.
    const saved = readStored<SavedCode | string | null>(codeKey, null);
    const savedPassed = readStored<number[]>(progressKey, []);
    if (typeof saved === 'string') setCode(saved);
    else if (saved && typeof saved.code === 'string') {
      setCode(saved.code);
      if (saved.starter !== starterHash) setStarterChanged(true);
    }
    if (Array.isArray(savedPassed) && savedPassed.length) {
      setPassed(savedPassed);
      const firstOpen = steps.findIndex((s) => !savedPassed.includes(s.stepNumber));
      setActiveIndex(firstOpen === -1 ? steps.length - 1 : firstOpen);
    }
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight });
  }, [entries, terminalOpen]);

  const activeStep = steps[activeIndex];
  const isUnlocked = (index: number) => index === 0 || passed.includes(steps[index - 1].stepNumber);
  const allPassed = steps.every((s) => passed.includes(s.stepNumber));

  const selectStep = (index: number) => {
    if (!isUnlocked(index)) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setActiveIndex(index);
    setHintConceptualOpen(false);
    setHintSyntaxOpen(false);
  };

  const updateCode = (value: string) => {
    setCode(value);
    writeStored(codeKey, { code: value, starter: starterHash } satisfies SavedCode);
  };

  const resetCode = () => {
    if (code !== lab.starterCode && !window.confirm('Discard your edits and restore the starter code?')) return;
    setCode(lab.starterCode);
    removeStored(codeKey);
    setShowSolution(false);
    setStarterChanged(false);
  };

  const execute = useCallback(
    async (mode: 'verify' | 'run') => {
      if (running || !activeStep) return;
      setRunning(true);
      setTerminalOpen(true);
      const label = mode === 'verify' ? `verify step ${activeStep.stepNumber}: ${activeStep.title}` : 'run code';
      try {
        const response = await fetch('/api/run-lab', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: lab.language,
            userCode: code,
            stepNumber: activeStep.stepNumber,
            testAssertion: mode === 'verify' ? activeStep.testAssertion : '',
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setEntries((prev) => [...prev, { label, error: data?.error ?? `Request failed (${response.status})` }]);
          return;
        }
        const result = data as RunResult;
        setEntries((prev) => [...prev, { label, result }]);

        if (mode === 'verify' && result.passed) {
          const nextPassed = passed.includes(activeStep.stepNumber) ? passed : [...passed, activeStep.stepNumber];
          setPassed(nextPassed);
          writeStored(progressKey, nextPassed);
          if (steps.every((s) => nextPassed.includes(s.stepNumber))) onAllPassed?.(module.slug);
          if (activeIndex < steps.length - 1) {
            const passedIndex = activeIndex;
            if (advanceTimer.current) clearTimeout(advanceTimer.current);
            advanceTimer.current = setTimeout(() => {
              // Only move on if the learner is still on the step that just passed.
              setActiveIndex((current) => (current === passedIndex ? passedIndex + 1 : current));
              setHintConceptualOpen(false);
              setHintSyntaxOpen(false);
            }, 1200);
          }
        }
      } catch (err) {
        setEntries((prev) => [...prev, { label, error: `Could not reach the lab runner: ${String(err)}` }]);
      } finally {
        setRunning(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [running, activeStep, code, passed, activeIndex, onAllPassed],
  );

  const last = entries[entries.length - 1];
  const lastVerify = last?.label.startsWith('verify') ? last : undefined;

  return (
    <section className="flex h-full min-h-0 flex-col bg-zinc-900" aria-label="Interactive lab">
      {/* ---------- Top bar ---------- */}
      <header className="max-h-[30%] min-h-[3.5rem] overflow-y-auto border-b border-zinc-800 px-4 pb-3 pt-3">
        <div className="flex items-start gap-2">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <h2 className="flex-1 text-sm font-semibold leading-snug text-zinc-50">{lab.labTitle}</h2>
          <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
            {lab.language}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{lab.context}</p>

        <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Lab steps">
          {steps.map((step, index) => {
            const done = passed.includes(step.stepNumber);
            const unlocked = isUnlocked(index);
            const active = index === activeIndex;
            return (
              <li key={step.stepNumber}>
                <button
                  type="button"
                  onClick={() => selectStep(index)}
                  disabled={!unlocked}
                  aria-current={active ? 'step' : undefined}
                  title={unlocked ? step.title : 'Pass the previous step to unlock'}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                    active && 'border-sky-500 bg-sky-500/15 text-sky-200',
                    !active && done && 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
                    !active && !done && unlocked && 'border-zinc-700 text-zinc-300 hover:border-zinc-500',
                    !unlocked && 'cursor-not-allowed border-zinc-800 text-zinc-600',
                  )}
                >
                  {done ? (
                    <Check className="h-3 w-3" />
                  ) : unlocked ? (
                    <LockOpen className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  Step {step.stepNumber}
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      {/* ---------- Instruction & hints ---------- */}
      {activeStep && (
        <div className="max-h-[34%] min-h-[4.5rem] overflow-y-auto border-b border-zinc-800 px-4 py-3">
          <h3 className="text-[13px] font-semibold text-zinc-100">
            Step {activeStep.stepNumber}: {activeStep.title}
          </h3>
          <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-zinc-300">{activeStep.instruction}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <HintButton open={hintConceptualOpen} onClick={() => setHintConceptualOpen((v) => !v)} icon={<Lightbulb className="h-3.5 w-3.5" />}>
              {hintConceptualOpen ? 'Hide' : 'Show'} Hint 1 (Conceptual)
            </HintButton>
            <HintButton open={hintSyntaxOpen} onClick={() => setHintSyntaxOpen((v) => !v)} icon={<Code className="h-3.5 w-3.5" />}>
              {hintSyntaxOpen ? 'Hide' : 'Show'} Hint 2 (Syntax)
            </HintButton>
          </div>
          {hintConceptualOpen && (
            <p className="mt-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-amber-100">
              {activeStep.hintConceptual}
            </p>
          )}
          {hintSyntaxOpen && (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md border border-sky-500/20 bg-sky-500/5 px-3 py-2 font-mono text-xs leading-relaxed text-sky-100">
              {activeStep.hintSyntax}
            </pre>
          )}
        </div>
      )}

      {/* ---------- Editor ---------- */}
      {starterChanged && (
        <p className="shrink-0 border-b border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200">
          This lab&apos;s starter code was updated after you saved your work. Your code is kept; use Reset Code to load the
          new starter.
        </p>
      )}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-3 py-1.5">
        <span className="flex-1 truncate font-mono text-[11px] text-zinc-500">
          {showSolution ? 'annotated solution (read-only)' : lab.language === 'python' ? 'lab.py' : 'lab.js'}
        </span>
        <button
          type="button"
          onClick={resetCode}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          title="Discard your edits and restore the starter code"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Code
        </button>
        <button
          type="button"
          onClick={() => setShowSolution((v) => !v)}
          aria-pressed={showSolution}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs',
            showSolution ? 'bg-violet-500/20 text-violet-200' : 'text-zinc-300 hover:bg-zinc-800',
          )}
        >
          {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showSolution ? 'Back to My Code' : 'Reveal Annotated Solution'}
        </button>
      </div>
      <div className="min-h-[11rem] flex-1 bg-[#1e1e1e]">
        <Editor
          height="100%"
          theme="vs-dark"
          language={lab.language}
          path={`${module.slug}-${showSolution ? 'solution' : 'user'}.${lab.language === 'python' ? 'py' : 'js'}`}
          value={showSolution ? lab.solutionCode : code}
          onChange={(value) => {
            if (!showSolution) updateCode(value ?? '');
          }}
          options={{
            readOnly: showSolution,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: lab.language === 'python' ? 4 : 2,
            wordWrap: 'on',
            padding: { top: 8 },
          }}
        />
      </div>

      {/* ---------- Terminal & verification bar ---------- */}
      <div className="shrink-0 border-t border-zinc-800 bg-zinc-950">
        {terminalOpen && (
          <div
            ref={terminalRef}
            className="max-h-[min(14rem,25vh)] min-h-16 overflow-y-auto border-b border-zinc-800 px-3 py-2 font-mono text-xs leading-relaxed"
            aria-live="polite"
          >
            {entries.length === 0 && <p className="text-zinc-600">Output appears here after you run your code.</p>}
            {entries.map((entry, i) => (
              <div key={i} className="mb-2">
                <p className="text-zinc-500">$ {entry.label}</p>
                {entry.error && <p className="whitespace-pre-wrap text-red-400">{entry.error}</p>}
                {entry.result && (
                  <>
                    {entry.result.stdout && <pre className="whitespace-pre-wrap text-zinc-200">{entry.result.stdout}</pre>}
                    {entry.result.stderr && <pre className="whitespace-pre-wrap text-red-300">{entry.result.stderr}</pre>}
                    <p className={entry.result.passed ? 'text-emerald-400' : 'text-red-400'}>
                      {entry.label.startsWith('verify')
                        ? entry.result.passed
                          ? '✔ Step passed'
                          : '✘ Step not passed yet'
                        : entry.result.passed
                          ? '✔ Exited cleanly'
                          : '✘ Exited with an error'}
                      <span className="ml-2 tabular-nums text-zinc-600">{entry.result.executionTimeMs} ms</span>
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setTerminalOpen((v) => !v)}
            aria-expanded={terminalOpen}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Terminal className="h-3.5 w-3.5" />
            Terminal
            {terminalOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </button>

          <span className="min-w-0 flex-1 truncate text-xs">
            {allPassed ? (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> All {steps.length} steps passed
              </span>
            ) : lastVerify?.result ? (
              <span className={lastVerify.result.passed ? 'text-emerald-400' : 'text-red-400'}>
                {lastVerify.result.passed ? 'Passed. Moving on…' : 'Not passed yet. Check the terminal.'}
              </span>
            ) : (
              <span className="tabular-nums text-zinc-500">
                {passed.length} / {steps.length} steps passed
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={() => execute('run')}
            disabled={running || showSolution}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
            title="Run your code without checking the step"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </button>
          <button
            type="button"
            onClick={() => execute('verify')}
            disabled={running || showSolution}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            title={showSolution ? 'Switch back to your code to verify it' : undefined}
          >
            {running ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            {running ? 'Running…' : 'Run & Verify Step'}
          </button>
        </div>
      </div>
    </section>
  );
}

function HintButton({
  open,
  onClick,
  icon,
  children,
}: {
  open: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium',
        open ? 'border-zinc-500 bg-zinc-800 text-zinc-100' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500',
      )}
    >
      {icon}
      {children}
    </button>
  );
}
