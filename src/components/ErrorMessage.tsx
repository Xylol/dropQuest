import React from "react";

interface ErrorMessageProps {
  error: string | { error: string; code?: string; details?: any } | null;
  className?: string;
}

function ErrorMessage({ error, className = "" }: ErrorMessageProps) {
  if (!error) return null;

  const errorMessage = typeof error === "string" ? error : error.error;
  const errorCode = typeof error === "string" ? undefined : error.code;

  const isStorageError = errorMessage.includes('Storage is full') || errorMessage.includes('quota');

  return (
    <div
      className={`error-message ${className}`}
      style={{
        color: isStorageError ? "#d97706" : "red",
        fontSize: "0.8rem",
        padding: "0.5rem",
        backgroundColor: isStorageError ? "#fef3c7" : "#fee",
        border: `1px solid ${isStorageError ? "#fcd34d" : "#fcc"}`,
        borderRadius: "0.25rem",
        margin: "0.5rem 0",
      }}
    >
      <div style={{ fontWeight: "bold" }}>
        {isStorageError && "⚠️ "}{errorMessage}
      </div>
      {isStorageError && (
        <div style={{ fontSize: "0.7rem", marginTop: "0.25rem" }}>
          Delete some players or items to free up space.
        </div>
      )}
      {errorCode && !isStorageError && (
        <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
          Error code: {errorCode}
        </div>
      )}
    </div>
  );
}

export default ErrorMessage;
