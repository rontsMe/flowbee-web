
// src/components/compound/nav/index.ts

/**
 * Navigation Compound Components
 * 
 * These components combine UI primitives with navigation-specific logic
 * and can be reused across different navigation contexts.
 */

// Core navigation compounds
export { NavMain } from './NavMain';
export { NavProjects } from './NavProjects';
export { NavUser } from './NavUser';

// Search and utility compounds
export { default as SearchInput } from './SearchInput';
export { ModeToggle as ThemeToggle } from './ThemeToggle';

// Navigation compounds that need to be created
export { Breadcrumbs } from './Breadcrumbs';

// Complete navigation layouts
export { default as AppSidebar } from './AppSidebar';
export { default as Header } from './Header';