export const rankCandidates = (
  candidates
) => {
  return [...candidates].sort(
    (a, b) => b.score - a.score
  );
};