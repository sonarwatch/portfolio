export default function durationForHumans(durationMs: number) {
  if (durationMs < 100) {
    return `${durationMs}ms`;
  }

  const seconds = durationMs / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(2)}min`;
  }

  const hours = minutes / 60;
  return `${hours.toFixed(2)}hrs`;
}
