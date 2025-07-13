import { test, describe } from "node:test";
import * as assert from "node:assert";
import { 
  validateRarityInputs, 
  chanceToOneOver, 
  oneOverToChance, 
  calculateRarityForSubmission 
} from "./rarityUtils";

describe("validateRarityInputs", () => {
  test("returns error when both inputs are empty", () => {
    const result = validateRarityInputs("", "");
    assert.strictEqual(result, "Drop rate is required");
  });

  test("returns error when both inputs are whitespace", () => {
    const result = validateRarityInputs("  ", "  ");
    assert.strictEqual(result, "Drop rate is required");
  });

  test("returns no error for valid chance input", () => {
    const result = validateRarityInputs("25", "");
    assert.strictEqual(result, "");
  });

  test("returns no error for valid oneOver input", () => {
    const result = validateRarityInputs("", "500");
    assert.strictEqual(result, "");
  });

  test("returns error for chance over 100", () => {
    const result = validateRarityInputs("150", "");
    assert.strictEqual(result, "Chance must be greater than 0 and up to 100");
  });

  test("returns error for chance of 0", () => {
    const result = validateRarityInputs("0", "");
    assert.strictEqual(result, "Chance must be greater than 0 and up to 100");
  });

  test("returns error for negative chance", () => {
    const result = validateRarityInputs("-5", "");
    assert.strictEqual(result, "Chance must be greater than 0 and up to 100");
  });

  test("returns error for oneOver over 100 billion", () => {
    const result = validateRarityInputs("", "200000000000");
    assert.strictEqual(result, "1 Over must be between 1 and 100,000,000,000");
  });

  test("returns error for oneOver of 0", () => {
    const result = validateRarityInputs("", "0");
    assert.strictEqual(result, "1 Over must be between 1 and 100,000,000,000");
  });

  test("returns error for invalid chance format", () => {
    const result = validateRarityInputs("abc", "");
    assert.strictEqual(result, "Chance must be greater than 0 and up to 100");
  });
});

describe("chanceToOneOver", () => {
  test("converts 1% to 100", () => {
    const result = chanceToOneOver(1);
    assert.strictEqual(result, 100);
  });

  test("converts 25% to 4", () => {
    const result = chanceToOneOver(25);
    assert.strictEqual(result, 4);
  });

  test("converts 0.2% to 500", () => {
    const result = chanceToOneOver(0.2);
    assert.strictEqual(result, 500);
  });

  test("rounds to nearest integer", () => {
    const result = chanceToOneOver(33.33);
    assert.strictEqual(result, 3);
  });

  test("returns 0 for invalid input", () => {
    assert.strictEqual(chanceToOneOver(0), 0);
    assert.strictEqual(chanceToOneOver(-5), 0);
    assert.strictEqual(chanceToOneOver(150), 0);
    assert.strictEqual(chanceToOneOver(NaN), 0);
  });
});

describe("oneOverToChance", () => {
  test("converts 100 to 1.00%", () => {
    const result = oneOverToChance(100);
    assert.strictEqual(result, "1.00");
  });

  test("converts 4 to 25.00%", () => {
    const result = oneOverToChance(4);
    assert.strictEqual(result, "25.00");
  });

  test("converts 500 to 0.20%", () => {
    const result = oneOverToChance(500);
    assert.strictEqual(result, "0.20");
  });

  test("handles very large numbers", () => {
    const result = oneOverToChance(1000000);
    assert.strictEqual(result, "1.00e-4");
  });

  test("returns empty string for invalid input", () => {
    assert.strictEqual(oneOverToChance(0), "");
    assert.strictEqual(oneOverToChance(-5), "");
    assert.strictEqual(oneOverToChance(NaN), "");
  });
});

describe("calculateRarityForSubmission", () => {
  test("prefers oneOver value when both provided", () => {
    const result = calculateRarityForSubmission("25", "500");
    assert.strictEqual(result, 500);
  });

  test("uses oneOver when only oneOver provided", () => {
    const result = calculateRarityForSubmission("", "200");
    assert.strictEqual(result, 200);
  });

  test("calculates from chance when only chance provided", () => {
    const result = calculateRarityForSubmission("25", "");
    assert.strictEqual(result, 4);
  });

  test("handles edge cases gracefully", () => {
    assert.strictEqual(calculateRarityForSubmission("", ""), 0);
    assert.strictEqual(calculateRarityForSubmission("abc", ""), 0);
    assert.strictEqual(calculateRarityForSubmission("", "abc"), 0);
  });

  test("handles decimal chance values", () => {
    const result = calculateRarityForSubmission("0.2", "");
    assert.strictEqual(result, 500);
  });
});