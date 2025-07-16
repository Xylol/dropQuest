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

