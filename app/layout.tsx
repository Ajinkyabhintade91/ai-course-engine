import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Mastery Course Player',
  description: 'Local-first course player: reference book, video library, and interactive coding labs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">{children}</body>
    </html>
  );
}
