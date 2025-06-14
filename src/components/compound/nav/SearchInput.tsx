'use client';
import { useKBar } from 'kbar';
import { Search } from 'lucide-react';
import { Button } from '@ui/button';

/**
 * SearchInput Component
 * 
 * Styled to match ProfessionalSidebarPreview search bar
 */
export default function SearchInput() {
  const { query } = useKBar();

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute left-3 top-2.5 text-foreground/60">
        <Search className="h-4 w-4" />
      </div>

      <Button
        onClick={query.toggle}
        className="w-full pl-10 pr-12 py-2 text-sm rounded-lg bg-[linear-gradient(135deg,var(--sidebar-search-bg)_0%,var(--sidebar-accent-to)_100%)] border border-[var(--sidebar-search-border)] text-[var(--sidebar-foreground)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklch,var(--sidebar-ring),white_20%)] shadow-none"
      >
        Search...
        <kbd className="bg-sidebar-accent pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </div>
  );
}
