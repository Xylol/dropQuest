export const validateRarityInputs = (chanceValue: string, oneOverValue: string): string => {
  if (!chanceValue.trim() && !oneOverValue.trim()) {
    return "Drop rate is required";
  }

  const chance = parseFloat(chanceValue);
  const oneOver = parseFloat(oneOverValue);

  if (chanceValue.trim() && (isNaN(chance) || chance <= 0 || chance > 100)) {
    return "Chance must be greater than 0 and up to 100";
  }

  if (oneOverValue.trim() && (isNaN(oneOver) || oneOver <= 0 || oneOver > 100000000000)) {
    return "1 Over must be between 1 and 100,000,000,000";
  }

  return "";
};

export const chanceToOneOver = (chance: number): number => {
  if (isNaN(chance) || chance <= 0 || chance > 100) return 0;
  return Math.round(100 / chance);
};

export const oneOverToChance = (oneOver: number): string => {
  if (isNaN(oneOver) || oneOver <= 0) return "";
  const chance = 100 / oneOver;
  // Use more decimal places for very small chances to avoid rounding to 0
  if (chance < 0.01) {
    return chance.toExponential(2);
  }
  return chance.toFixed(2);
};

export const calculateRarityForSubmission = (chanceValue: string, oneOverValue: string): number => {
  if (oneOverValue.trim()) {
    return parseInt(oneOverValue) || 0;
  }
  if (chanceValue.trim()) {
    const chance = parseFloat(chanceValue);
    return Math.round(100 / chance) || 0;
  }
  return 0;
};