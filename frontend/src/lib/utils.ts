export function getDaysRemaining(deadlineDateStr: string): number {
  const target = new Date(deadlineDateStr).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDeadlineText(days: number): string {
  if (days < 0) return 'Tutup';
  if (days === 0) return 'Hari ini terakhir';
  return `${days} hari lagi`;
}