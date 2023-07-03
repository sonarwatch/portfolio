export default function aprToApy(apr: number, compoundFrequency = 365) {
  return (1 + apr / compoundFrequency) ** compoundFrequency - 1;
}
