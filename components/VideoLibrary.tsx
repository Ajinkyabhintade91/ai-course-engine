'use client';

import { useState } from 'react';
import { Clock, ExternalLink, Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Video } from '@/lib/types';

type Filter = 'all' | 'free' | 'paid';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free (YouTube)' },
  { id: 'paid', label: 'Paid (Coursera Plus)' },
];

const isPaid = (v: Video) => v.tier.toLowerCase() === 'paid';
const isYouTube = (v: Video) => /youtube\.com|youtu\.be/i.test(v.url);

/** Turns any common YouTube URL into a privacy-friendly embed URL, or null when it is not a single video/playlist. */
export function youTubeEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, '');
  let id: string | null = null;
  if (host === 'youtu.be') {
    id = url.pathname.slice(1).split('/')[0] || null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v');
    else {
      const match = /^\/(?:embed|shorts|live|v)\/([^/?]+)/.exec(url.pathname);
      if (match) id = match[1];
    }
    const list = url.searchParams.get('list');
    if (!id && list && url.pathname === '/playlist') {
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}`;
    }
  }
  if (!id || !/^[\w-]{6,20}$/.test(id)) return null;
  const start = url.searchParams.get('t') ?? url.searchParams.get('start');
  const seconds = start ? parseInt(start, 10) : 0;
  return `https://www.youtube-nocookie.com/embed/${id}${seconds > 0 ? `?start=${seconds}` : ''}`;
}

export function VideoLibrary({ videos }: { videos: Video[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = videos.filter((v) => (filter === 'all' ? true : filter === 'paid' ? isPaid(v) : !isPaid(v)));
  const counts: Record<Filter, number> = {
    all: videos.length,
    free: videos.filter((v) => !isPaid(v)).length,
    paid: videos.filter(isPaid).length,
  };

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter videos">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium',
              filter === f.id
                ? 'border-sky-500 bg-sky-500/15 text-sky-200'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500',
            )}
          >
            {f.label} <span className="ml-1 tabular-nums text-zinc-500">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-sm text-zinc-400">No videos in this category for this module. Switch the filter to see the rest.</p>
      )}

      <ol className="mt-6 space-y-6">
        {visible.map((video) => {
          const paid = isPaid(video);
          const embed = isYouTube(video) ? youTubeEmbedUrl(video.url) : null;
          const searchUrl = paid
            ? `https://www.coursera.org/search?query=${encodeURIComponent(video.title)}`
            : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${video.title} ${video.creator}`)}`;
          return (
            <li key={video.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              {embed && (
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={embed}
                    title={video.title}
                    loading="lazy"
                    className="h-full w-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      paid ? 'bg-violet-500/15 text-violet-300' : 'bg-emerald-500/15 text-emerald-400',
                    )}
                  >
                    {video.tier} · {video.platform}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                    <Clock className="h-3 w-3" />
                    {video.timingInstruction}
                  </span>
                </div>
                <h3 className="mt-2 text-[15px] font-semibold leading-snug text-zinc-50">{video.title}</h3>
                <p className="mt-0.5 text-xs text-zinc-400">{video.creator}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{video.keyTakeaway}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100 hover:bg-zinc-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {paid ? 'Open on Coursera' : 'Open on YouTube'}
                  </a>
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-500"
                  >
                    <Search className="h-3.5 w-3.5" />
                    {paid ? 'Deep-search on Coursera' : 'Search on YouTube'}
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
