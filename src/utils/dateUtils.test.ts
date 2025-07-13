import { test, describe } from "node:test";
import * as assert from "node:assert";
import { formatDate, calculateDaysBetween, calculateRunsPerDay } from "./dateUtils";

describe("formatDate", () => {
  test("formats valid date string to yyyy-MM-dd", () => {
    const result = formatDate("2025-01-15T10:30:00.000Z");
    assert.strictEqual(result, "2025-01-15");
  });

  test("formats Date object to yyyy-MM-dd", () => {
    const date = new Date("2025-01-15T10:30:00.000Z");
    const result = formatDate(date);
    assert.strictEqual(result, "2025-01-15");
  });

  test("returns Invalid date for malformed input", () => {
    const result = formatDate("not-a-date");
    assert.strictEqual(result, "Invalid date");
  });
});

describe("calculateDaysBetween", () => {
  test("calculates days between dates correctly", () => {
    const start = "2025-01-01T00:00:00.000Z";
    const end = new Date("2025-01-06T00:00:00.000Z");
    const result = calculateDaysBetween(start, end);
    assert.strictEqual(result, 5);
  });

  test("returns minimum 1 day for same date", () => {
    const start = "2025-01-01T00:00:00.000Z";
    const end = new Date("2025-01-01T00:00:00.000Z");
    const result = calculateDaysBetween(start, end);
    assert.strictEqual(result, 1);
  });

  test("returns 1 for invalid date", () => {
    const result = calculateDaysBetween("invalid-date");
    assert.strictEqual(result, 1);
  });
});

describe("calculateRunsPerDay", () => {
  test("calculates runs per day correctly", () => {
    const result = calculateRunsPerDay(100, 5);
    assert.strictEqual(result, 20);
  });

  test("returns 0 for zero runs", () => {
    const result = calculateRunsPerDay(0, 5);
    assert.strictEqual(result, 0);
  });

  test("returns 0 for zero days", () => {
    const result = calculateRunsPerDay(100, 0);
    assert.strictEqual(result, 0);
  });

  test("rounds to 2 decimal places", () => {
    const result = calculateRunsPerDay(100, 3);
    assert.strictEqual(result, 33.33);
  });
});