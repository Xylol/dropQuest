import { useState } from "react";
import useSetRarity from "../hooks/useSetRarity";
import Button from "./Button";
import { validateRarityInputs, calculateRarityForSubmission } from "../utils/rarityUtils";

interface RarityInputProps {
  itemId: string;
  onRaritySet: () => void;
  currentRarity?: number;
}

function RarityInput({ itemId, onRaritySet, currentRarity }: RarityInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [oneOverValue, setOneOverValue] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const { setRarity: setItemRarity, loading, error } = useSetRarity();

  const validateInputs = (): string => {
    return validateRarityInputs("", oneOverValue);
  };

  const handleOneOverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow positive integers (digits only)
    if (value === "" || /^\d+$/.test(value)) {
      setOneOverValue(value);

      // Only validate if there's a value, don't show "required" error while typing
      if (value.trim()) {
        const error = validateInputs();
        setValidationError(error);
      } else {
        setValidationError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErr = validateInputs();
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    const rarity = calculateRarityForSubmission("", oneOverValue);
    const success = await setItemRarity(itemId, rarity);
    if (success) {
      setOneOverValue("");
      setValidationError("");
      setIsEditing(false);
      onRaritySet();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setOneOverValue(currentRarity ? currentRarity.toString() : "");
    setValidationError("");
  };

  const handleClick = () => {
    setIsEditing(true);
    setOneOverValue(currentRarity ? currentRarity.toString() : "");
    setValidationError("");
  };

  return (
    <>
      {!isEditing ? (
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
            1 / {currentRarity ? currentRarity.toLocaleString() : "Not Set"}
          </p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
            Click to {currentRarity ? "edit" : "set"} drop rate
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ fontSize: "1rem", color: "var(--color-text-secondary)" }}>1 /</span>
            <input
              type="text"
              value={oneOverValue}
              onChange={handleOneOverChange}
              placeholder="100"
              disabled={loading}
              autoFocus
              style={{ 
                flex: 1,
                fontSize: "1rem",
                textAlign: "center"
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "var(--space-xs)" }}>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !oneOverValue.trim() || !!validationError}
              style={{ flex: 1 }}
            >
              Set
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{ flex: 1, background: "var(--color-surface)", color: "var(--color-text-secondary)" }}
            >
              Cancel
            </Button>
          </div>
          {validationError && (
            <p style={{ color: "orange", fontSize: "0.8rem", margin: 0 }}>
              {validationError}
            </p>
          )}
          {error && (
            <p style={{ color: "red", fontSize: "0.8rem", margin: 0 }}>
              {error as string}
            </p>
          )}
        </form>
      )}
    </>
  );
}

export default RarityInput;