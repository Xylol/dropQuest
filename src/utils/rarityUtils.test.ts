import { test, describe } from "node:test";
import * as assert from "node:assert";
import { 
  validateRarityInputs
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