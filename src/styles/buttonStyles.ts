/**
 * Centralized Button Styles
 *
 * This file contains reusable button class names for consistent styling across the application.
 * To change the primary button color globally, modify the PRIMARY_BUTTON constant below.
 */

/**
 * Primary action button with gradient background
 * Used for: Start AI Call, Verify Via Availity API, and other primary actions
 *
 * To change colors, modify the gradient classes:
 * - from-[color]-500 to-[color]-500 (normal state)
 * - hover:from-[color]-600 hover:to-[color]-600 (hover state)
 * - shadow-[color]-500/30 (shadow color)
 */
export const PRIMARY_BUTTON = "rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2 shrink-0";

/**
 * Secondary button with border and transparent background
 * Used for: Print, Cancel, and other secondary actions
 */
export const SECONDARY_BUTTON = "px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900";

/**
 * Disabled state for primary buttons
 */
export const PRIMARY_BUTTON_DISABLED = "opacity-50 cursor-not-allowed";

/**
 * Helper function to combine button classes with disabled state
 */
export const getButtonClass = (baseClass: string, disabled: boolean = false) => {
  return disabled ? `${baseClass} ${PRIMARY_BUTTON_DISABLED}` : baseClass;
};
