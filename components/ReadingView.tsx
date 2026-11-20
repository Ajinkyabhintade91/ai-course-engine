'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { ExternalLink } from 'lucide-react';
import type { Citation } from '@/lib/types';

interface ReadingViewProps {
  markdown: string;
  citations: Citation[];
}

/**
 * Renders the module's textbook chapter.
 * Order matters: raw HTML (<details> recall blocks) is parsed first, then math is typeset,
 * then the remaining code blocks are syntax highlighted.
 */
export const ReadingView = memo(function ReadingView({ markdown, citations }: ReadingViewProps) {
  // Chapters open with "# Title", which the header above already shows, so drop that first heading.
  const body = markdown.replace(/^\s*#[ \t]+[^\n]*\n/, '');
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-6">
      <article className="book">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex, [rehypeHighlight, { detect: false }]]}
          components={{
            a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            table: ({ node: _node, ...props }) => (
              <div className="my-6 overflow-x-auto rounded-lg border border-zinc-800">
                <table {...props} />
              </div>
            ),
          }}
        >
          {body}
        </ReactMarkdown>
      </article>

      {citations.length > 0 && (
        <section className="mt-12 border-t border-zinc-800 pt-6" aria-labelledby="citations-heading">
          <h2 id="citations-heading" className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Sources &amp; citations
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {citations.map((c) => (
              <li key={c.url}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:border-sky-500 hover:text-sky-300"
                  title={c.url}
                >
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                    {c.source}
                  </span>
                  <span className="truncate">{c.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-zinc-500" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});
