export function calculateWpm(charactersTyped: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  const words = charactersTyped / 5;
  return round(words / minutes, 2);
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total <= 0) return 100;
  return round((correct / total) * 100, 2);
}

export function round(n: number, to: number): number {
  const f = Math.pow(10, to);
  return Math.round(n * f) / f;
}


