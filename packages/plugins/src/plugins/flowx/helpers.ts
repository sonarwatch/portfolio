export function getUnlockingAt(unlockedAtEpoch: string): number {
  // https://suivision.xyz/object/0xcc9def46072f7ef0e81e1793a718a58ec94d5ed95e9f7254f4a226426aa4db5a
  const initialEpoch = 6;
  const initialEpochStart = 1713949200;
  const epochDuration = 1209600;

  return (
    (Number(unlockedAtEpoch) - initialEpoch) * epochDuration + initialEpochStart
  );
}
