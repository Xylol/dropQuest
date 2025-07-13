export const formatDate = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch {
    return "Invalid date";
  }
};

export const calculateDaysBetween = (startDate: string | Date, endDate: Date = new Date()): number => {
  try {
    const start = new Date(startDate);
    const end = endDate;
    const result = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return isNaN(result) ? 1 : Math.max(1, result);
  } catch {
    return 1;
  }
};

export const calculateRunsPerDay = (runs: number, daysSince: number): number => {
  if (!runs || !daysSince) return 0;
  return Math.round((runs / daysSince) * 100) / 100;
};