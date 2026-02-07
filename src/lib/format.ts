/**
 * Formats a venue type enum value for display.
 * "barn" -> "Barn", "rooftop" -> "Rooftop", etc.
 */
export function formatVenueType(type: string): string {
  return type.split(/[-_\s]/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
