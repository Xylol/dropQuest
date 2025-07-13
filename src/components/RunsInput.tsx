import React, { useState } from "react";
import useAddRuns from "../hooks/useAddRuns";
import Button from "./Button";
import { InputSanitizationService } from "../services/InputSanitizationService";

interface RunsInputProps {
  itemId: string;
  onRunsAdded: () => void;
}

function RunsInput({ itemId, onRunsAdded }: RunsInputProps) {
  const [runs, setRuns] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const { addRuns, loading, error } = useAddRuns();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow positive integers (digits only)
    if (value === "" || /^\d+$/.test(value)) {
      setRuns(value);

      if (value) {
        const sanitizationResult = InputSanitizationService.sanitizeRuns(value);
        if (!sanitizationResult.isValid) {
          setValidationError(sanitizationResult.error || "Invalid runs count");
        } else {
          setValidationError("");
        }
      } else {
        setValidationError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizationResult = InputSanitizationService.sanitizeRuns(runs);
    if (!sanitizationResult.isValid) {
      setValidationError(sanitizationResult.error || "Invalid runs count");
      return;
    }

    const success = await addRuns(itemId, sanitizationResult.sanitized);
    if (success) {
      setRuns("");
      setValidationError("");
      onRunsAdded();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-xs)",
      }}
    >
      <div style={{ flex: 1 }}>
        <input
          type="text"
          value={runs}
          onChange={handleInputChange}
          placeholder="Number of runs"
          disabled={loading}
        />
        {validationError && (
          <p
            style={{
              color: "red",
              fontSize: "0.8rem",
              margin: "var(--space-xs) 0 0",
            }}
          >
            {validationError}
          </p>
        )}
        {error && (
          <p
            style={{
              color: "red",
              fontSize: "0.8rem",
              margin: "var(--space-xs) 0 0",
            }}
          >
            {error as string}
          </p>
        )}
      </div>
      <Button
        type="submit"
        loading={loading}
        disabled={loading || !runs.trim() || !!validationError}
      >
        Add
      </Button>
    </form>
  );
}

export default RunsInput;
