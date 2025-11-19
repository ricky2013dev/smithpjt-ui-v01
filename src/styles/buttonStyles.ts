/**
 * Centralized Button Styles
 *
 * This file contains reusable button class names for consistent styling across the application.
 * To change the primary button color globally, modify the PRIMARY_BUTTON constant below.
 */

/**
 * Primary action button with flat, minimal design
 * Used for: Start AI Call, Verify Via Availity API, and other primary actions
 *
 * Modern minimal design with subtle interactions
 */
export const PRIMARY_BUTTON = "rounded-md bg-slate-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors flex items-center gap-2 shrink-0";

/**
 * Secondary button with minimal border design
 * Used for: Print, Cancel, and other secondary actions
 */
export const SECONDARY_BUTTON = "px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900 transition-colors";

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
