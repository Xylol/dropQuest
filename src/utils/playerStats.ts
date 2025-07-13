import { Item } from "../types/Item";
import { calculateDaysBetween, calculateRunsPerDay } from "./dateUtils";

export const calculatePlayerRunsPerDay = (items: Item[]): number => {
  if (!items.length) return 0;

  const earliestDate = items.reduce((earliest, item) => {
    const itemDate = new Date(item.createdAt);
    return itemDate < earliest ? itemDate : earliest;
  }, new Date(items[0].createdAt));

  const totalDaysSinceStart = calculateDaysBetween(earliestDate);
  const totalRuns = items.reduce((total, item) => total + (item.numberOfRuns || 0), 0);
  
  return calculateRunsPerDay(totalRuns, totalDaysSinceStart);
};

export const calculateTotalRuns = (items: Item[]): number => {
  return items.reduce((total, item) => total + (item.numberOfRuns || 0), 0);
};