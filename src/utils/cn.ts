/**
 * Utility function for combining class names
 * Similar to clsx but lightweight for this project
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility for conditional class names
 */
export function cnIf(condition: boolean, className: string): string {
  return condition ? className : '';
}

/**
 * Utility for creating variant-based class names
 */
export function cnVariants(base: string, variants: Record<string, Record<string, string>>, props: Record<string, string>) {
  const classes = [base];
  
  for (const [key, value] of Object.entries(props)) {
    if (variants[key] && variants[key][value]) {
      classes.push(variants[key][value]);
    }
  }
  
  return classes.join(' ');
}
