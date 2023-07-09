export default function durationForHumans(milliseconds: number) {
  if (milliseconds < 100) {
    return `${milliseconds}ms`;
  }

  const seconds = milliseconds / 1000;
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
