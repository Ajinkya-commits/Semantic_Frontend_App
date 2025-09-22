
export const formatScore = (score: number | undefined, decimals: number = 3): string => {
  return score ? score.toFixed(decimals) : 'N/A';
};