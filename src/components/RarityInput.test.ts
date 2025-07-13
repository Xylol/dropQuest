import { test, describe } from "node:test";
import * as assert from "node:assert";

function simulateChanceToOneOverConversion(chanceInput: string): string {
  if (!chanceInput.trim()) return "";
  
  const chance = parseFloat(chanceInput);
  if (!isNaN(chance) && chance > 0 && chance <= 100) {
    const oneOver = Math.round(100 / chance);
    return oneOver.toString();
  }
  return "";
}

function simulateOneOverToChanceConversion(oneOverInput: string): string {
  if (!oneOverInput.trim()) return "";
  
  const oneOver = parseFloat(oneOverInput);
  if (!isNaN(oneOver) && oneOver > 0) {
    return (100 / oneOver).toFixed(2);
  }
  return "";
}

function simulateRarityCalculation(chanceValue: string, oneOverValue: string): number {
  const rarity = parseInt(oneOverValue) || Math.round(100 / parseFloat(chanceValue));
  return rarity || 0;
}

describe("RarityInput Component Logic", () => {
  describe("Chance to OneOver conversion", () => {
    test("converts valid chance to oneOver", () => {
      assert.strictEqual(simulateChanceToOneOverConversion("25"), "4");
      assert.strictEqual(simulateChanceToOneOverConversion("1"), "100");
      assert.strictEqual(simulateChanceToOneOverConversion("0.2"), "500");
    });

    test("handles invalid chance input", () => {
      assert.strictEqual(simulateChanceToOneOverConversion(""), "");
      assert.strictEqual(simulateChanceToOneOverConversion("abc"), "");
      assert.strictEqual(simulateChanceToOneOverConversion("0"), "");
      assert.strictEqual(simulateChanceToOneOverConversion("150"), "");
    });

    test("handles edge cases", () => {
      assert.strictEqual(simulateChanceToOneOverConversion("100"), "1");
      assert.strictEqual(simulateChanceToOneOverConversion("0.01"), "10000");
    });
  });

  describe("OneOver to Chance conversion", () => {
    test("converts valid oneOver to chance", () => {
      assert.strictEqual(simulateOneOverToChanceConversion("4"), "25.00");
      assert.strictEqual(simulateOneOverToChanceConversion("100"), "1.00");
      assert.strictEqual(simulateOneOverToChanceConversion("500"), "0.20");
    });

    test("handles invalid oneOver input", () => {
      assert.strictEqual(simulateOneOverToChanceConversion(""), "");
      assert.strictEqual(simulateOneOverToChanceConversion("abc"), "");
      assert.strictEqual(simulateOneOverToChanceConversion("0"), "");
    });

    test("handles edge cases", () => {
      assert.strictEqual(simulateOneOverToChanceConversion("1"), "100.00");
      assert.strictEqual(simulateOneOverToChanceConversion("10000"), "0.01");
    });
  });

  describe("Final rarity calculation", () => {
    test("prefers oneOver when both values present", () => {
      const result = simulateRarityCalculation("25", "500");
      assert.strictEqual(result, 500);
    });

    test("calculates from chance when only chance present", () => {
      const result = simulateRarityCalculation("25", "");
      assert.strictEqual(result, 4);
    });

    test("uses oneOver when only oneOver present", () => {
      const result = simulateRarityCalculation("", "200");
      assert.strictEqual(result, 200);
    });

    test("handles invalid inputs gracefully", () => {
      assert.strictEqual(simulateRarityCalculation("", ""), 0);
      assert.strictEqual(simulateRarityCalculation("abc", "xyz"), 0);
    });
  });

  describe("Input synchronization behavior", () => {
    test("simulates two-way binding behavior", () => {
      const chanceInput = "25";
      const calculatedOneOver = simulateChanceToOneOverConversion(chanceInput);
      assert.strictEqual(calculatedOneOver, "4");
      
      const oneOverInput = "500";
      const calculatedChance = simulateOneOverToChanceConversion(oneOverInput);
      assert.strictEqual(calculatedChance, "0.20");
    });

    test("simulates round-trip conversion accuracy", () => {
      const originalChance = "25";
      const oneOver = simulateChanceToOneOverConversion(originalChance);
      const backToChance = simulateOneOverToChanceConversion(oneOver);
      assert.strictEqual(backToChance, "25.00");
    });

    test("handles precision edge cases", () => {
      const result1 = simulateChanceToOneOverConversion("33.33");
      assert.strictEqual(result1, "3"); // Should round 100/33.33 = 3.0003

      const result2 = simulateOneOverToChanceConversion("3");
      assert.strictEqual(result2, "33.33"); // Should be 100/3 = 33.33
    });
  });
});