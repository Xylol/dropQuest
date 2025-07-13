import React from "react";

interface ProgressBoxProps {
  progress: number; // 0 to 1
  value: string;
  achievementText?: string;
  showMarkers?: boolean;
}

function ProgressBox({ progress, value, achievementText, showMarkers = true }: ProgressBoxProps) {
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
        minHeight: "5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <h3
          style={{
            fontSize: "clamp(1.125rem, 4.5vw, 1.75rem)",
            fontWeight: 600,
            margin: 0,
            textAlign: "left",
            textTransform: "uppercase",
            letterSpacing: "0.025em",
          }}
        >
          PROGRESS
        </h3>
        <div style={{ 
          fontSize: "clamp(1rem, 3.5vw, 1.25rem)", 
          fontWeight: 600,
          lineHeight: "1.1",
          color: "var(--color-text-secondary)"
        }}>
          {value}
        </div>
      </div>
      
      <div style={{ marginBottom: "0.5rem" }}>
        <div
          style={{
            position: "relative",
            background: "#23232a",
            borderRadius: "var(--radius)",
            height: "1.5rem",
            marginBottom: showMarkers ? "0.25rem" : "0",
            overflow: "hidden",
            border: "0.0625rem solid var(--color-border)",
          }}
        >
          <div
            style={{
              width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--color-green), #7bbf7f)",
              transition: "width 0.3s",
            }}
          />
          {showMarkers && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "50%",
                  borderLeft: "0.125rem solid var(--color-text)",
                  transform: "translateX(-0.0625rem)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "90%",
                  borderLeft: "0.125rem solid var(--color-text)",
                  transform: "translateX(-0.0625rem)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "99%",
                  borderLeft: "0.125rem solid var(--color-text)",
                  transform: "translateX(-0.0625rem)",
                }}
              />
            </>
          )}
        </div>
        {showMarkers && (
          <div
            style={{
              position: "relative",
              height: "1rem",
              fontSize: "clamp(0.75rem, 2.5vw, 1rem)",
              color: "var(--color-text-secondary)",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              50
            </span>
            <span
              style={{
                position: "absolute",
                left: "90%",
                transform: "translateX(-50%)",
              }}
            >
              90
            </span>
            <span
              style={{
                position: "absolute",
                left: "99%",
                transform: "translateX(-50%)",
              }}
            >
              99
            </span>
          </div>
        )}
      </div>
      
      {achievementText && (
        <div style={{
          fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)",
          color: "var(--color-text-primary)",
          fontStyle: "italic",
          lineHeight: "1.2",
          textAlign: "left"
        }}>
          {achievementText}
        </div>
      )}
    </div>
  );
}

export default ProgressBox;