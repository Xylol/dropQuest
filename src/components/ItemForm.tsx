import React, { useState, type JSX } from "react";

import { InputSanitizationService } from "../services/InputSanitizationService";

import usePostItem from "../hooks/usePostItem";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

interface ItemFormProps {
  playerId: string;
  onItemCreated?: () => void;
}

function ItemForm({ playerId, onItemCreated }: ItemFormProps): JSX.Element {
  const [name, setName] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { postItem, loading, error } = usePostItem();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizationResult = InputSanitizationService.sanitizeItemName(value);
    
    setName(sanitizationResult.sanitized);
    
    if (!sanitizationResult.isValid && value.trim()) {
      setValidationError(sanitizationResult.error || "Invalid item name");
    } else {
      setValidationError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const sanitizationResult = InputSanitizationService.sanitizeItemName(name);
    if (!sanitizationResult.isValid) {
      setValidationError(sanitizationResult.error || "Invalid item name format");
      return;
    }
    
    const success = await postItem(sanitizationResult.sanitized, playerId);
    if (success) {
      setName("");
      setValidationError(null);
      if (onItemCreated) {
        onItemCreated();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "var(--space-xs)",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: 1 }}>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="New item name..."
          value={name}
          onChange={handleNameChange}
          disabled={loading}
          maxLength={100}
          style={{
            fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)",
            padding: "0.75rem 1.5rem",
            border: "0.0625rem solid var(--color-border)",
            borderRadius: "var(--radius)",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        {validationError && (
          <p
            style={{
              color: "orange",
              fontSize: "clamp(0.625rem, 2vw, 0.875rem)",
              margin: "var(--space-xs) 0 0",
            }}
          >
            {validationError}
          </p>
        )}
        <ErrorMessage error={error} />
      </div>
      <Button
        type="submit"
        loading={loading}
        disabled={loading || !name.trim() || !!validationError}
      >
        Add
      </Button>
    </form>
  );
}

export default ItemForm;
