import React, { useState, useRef, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { BackendError } from "../utils/errorUtils";

interface ContinuePlayerFormProps {
  buttonText?: string;
  onSubmit: (playerId: string) => void;
  showErrorFeedback?: boolean;
}

function ContinuePlayerForm({
  buttonText = "Continue with ID",
  onSubmit,
  showErrorFeedback = false,
}: ContinuePlayerFormProps) {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [error, setError] = useState<string | BackendError | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setIsInputVisible(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playerId.trim()) {
      try {
        await onSubmit(playerId.trim());
        setError(null);
      } catch (error) {
        if (showErrorFeedback) {
          setIsShaking(true);
          setError(error as BackendError);
          setPlayerId("");
          inputRef.current?.focus();
          setTimeout(() => {
            setIsShaking(false);
          }, 500);
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && playerId.trim()) {
      handleSubmit(e);
    }
  };

  const validatePlayerId = (value: string): boolean => {
    return value.length <= 36;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlayerId(value);
    if (value.length > 36) {
      setValidationError("Player ID must be 36 characters or less");
    } else {
      setValidationError(null);
    }
    if (error) {
      setError(null);
    }
  };

  if (isInputVisible) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={playerId}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="enter player id"
            autoFocus
            maxLength={36}
            style={{
              transform: isShaking ? "translateX(-5px)" : "translateX(0)",
              transition: "transform 0.1s ease-in-out",
            }}
          />
          {validationError && (
            <p
              style={{
                color: "orange",
                fontSize: "0.8rem",
                margin: "0.25rem 0 0",
              }}
            >
              {validationError}
            </p>
          )}
          <button
            type="submit"
            disabled={!playerId.trim() || !!validationError}
          >
            Continue
          </button>
        </form>
        <ErrorMessage error={error} />
      </div>
    );
  }

  return <button onClick={handleButtonClick}>{buttonText}</button>;
}

export default ContinuePlayerForm;
