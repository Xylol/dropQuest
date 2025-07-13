import React, { useState } from "react";

interface InfoBoxProps {
  title: string;
  value: string | number;
  editable?: boolean;
  inputType?: "text" | "date";
  onUpdate?: (newValue: string | number) => Promise<boolean>;
  loading?: boolean;
  validationFn?: (value: string) => string;
}

function InfoBox({ 
  title, 
  value, 
  editable = false, 
  inputType = "text", 
  onUpdate, 
  loading = false,
  validationFn
}: InfoBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [validationError, setValidationError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (editable && !isLoading) {
      setIsEditing(true);
      // For RARITY and RUNS, if value is 0, start with empty string
      if ((title === "RARITY" || title === "RUNS") && value === 0) {
        setInputValue("");
      } else {
        setInputValue(value.toString());
      }
      setValidationError("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // For text inputs that should only allow positive integers
    if (inputType === "text" && title === "RARITY") {
      if (newValue === "" || /^\d+$/.test(newValue)) {
        setInputValue(newValue);
        if (newValue && validationFn) {
          setValidationError(validationFn(newValue));
        } else {
          setValidationError("");
        }
      }
    } else if (inputType === "text" && title === "RUNS") {
      if (newValue === "" || /^\d+$/.test(newValue)) {
        setInputValue(newValue);
        if (newValue && validationFn) {
          setValidationError(validationFn(newValue));
        } else {
          setValidationError("");
        }
      }
    } else {
      setInputValue(newValue);
      if (newValue && validationFn) {
        setValidationError(validationFn(newValue));
      } else {
        setValidationError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!onUpdate) return;

    let finalValidationError = "";
    if (validationFn) {
      finalValidationError = validationFn(inputValue);
    }

    if (finalValidationError) {
      setValidationError(finalValidationError);
      return;
    }

    setIsLoading(true);
    const success = await onUpdate(inputValue);
    setIsLoading(false);
    
    if (success) {
      setIsEditing(false);
      setValidationError("");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // For RARITY and RUNS, if value is 0, start with empty string
    if ((title === "RARITY" || title === "RUNS") && value === 0) {
      setInputValue("");
    } else {
      setInputValue(value.toString());
    }
    setValidationError("");
  };

  const formatDisplayValue = () => {
    if (title === "RARITY" && typeof value === "number") {
      return value > 0 ? `1/${value.toLocaleString()}` : "1/Not Set";
    }
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return value;
  };

  if (isEditing) {
    return (
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius)",
          padding: "1rem",
          margin: 0,
          boxShadow: "0 0.125rem 0.5rem 0 rgba(0,0,0,0.04)",
          border: "0.0625rem solid var(--color-border)",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "10rem",
          aspectRatio: "1 / 1",
        }}
      >
        <h3
          style={{
            fontSize: "clamp(1.125rem, 4.5vw, 1.75rem)",
            fontWeight: 600,
            margin: 0,
            marginBottom: "0.5rem",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.025em",
          }}
        >
          {title}
        </h3>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {title === "RARITY" ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span style={{ fontSize: "clamp(0.625rem, 2.5vw, 1rem)", color: "var(--color-text-secondary)" }}>1 /</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="100"
                  disabled={isLoading || loading}
                  autoFocus
                  style={{ 
                    flex: 1,
                    fontSize: "clamp(0.625rem, 2.5vw, 1rem)",
                    textAlign: "center",
                    padding: "0.5rem",
                    border: "0.0625rem solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
              </div>
            ) : (
              <input
                type={inputType}
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading || loading}
                autoFocus
                style={{ 
                  fontSize: "clamp(0.625rem, 2.5vw, 1rem)",
                  textAlign: "center",
                  padding: "0.5rem",
                  border: "0.0625rem solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
              />
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="submit"
                disabled={isLoading || loading || !inputValue.trim() || !!validationError}
                style={{
                  flex: 1,
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius)",
                  padding: "0.5rem",
                  fontSize: "clamp(0.625rem, 2vw, 0.875rem)",
                  cursor: isLoading || loading ? "not-allowed" : "pointer"
                }}
              >
                {isLoading || loading ? "..." : "✓"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading || loading}
                style={{
                  flex: 1,
                  background: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                  border: "0.0625rem solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  padding: "0.5rem",
                  fontSize: "clamp(0.625rem, 2vw, 0.875rem)",
                  cursor: isLoading || loading ? "not-allowed" : "pointer"
                }}
              >
                ✕
              </button>
            </div>
            {validationError && (
              <p style={{ color: "orange", fontSize: "clamp(0.5rem, 1.5vw, 0.75rem)", margin: 0, textAlign: "center" }}>
                {validationError}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius)",
        padding: "1rem",
        margin: 0,
        boxShadow: "0 0.125rem 0.5rem 0 rgba(0,0,0,0.04)",
        border: "0.0625rem solid var(--color-border)",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: "10rem",
        cursor: editable ? "pointer" : "default",
      }}
    >
      <div style={{ height: "33.333%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h3
          style={{
            fontSize: "clamp(1.125rem, 4.5vw, 1.75rem)",
            fontWeight: 600,
            margin: 0,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.025em",
          }}
        >
          {title}
        </h3>
      </div>
      <div style={{ height: "33.333%" }}>
        {editable && (
          <div style={{ 
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: "clamp(0.5rem, 2vw, 0.75rem)", 
              color: "var(--color-text-secondary)",
              textAlign: "center"
            }}>
              Click to edit
            </p>
          </div>
        )}
      </div>
      <div style={{ 
        height: "33.333%",
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <div style={{ 
          fontSize: "clamp(1.125rem, 4vw, 1.375rem)", 
          fontWeight: 600,
          lineHeight: "1.1",
          wordBreak: "break-word"
        }}>
          {formatDisplayValue()}
        </div>
      </div>
    </div>
  );
}

export default InfoBox;