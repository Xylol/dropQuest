import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  progress?: number; // 0 to 1
  showMarkers?: boolean;
}

function StatCard({ title, children, progress, showMarkers }: StatCardProps) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius)",
        padding: "1.5rem 1rem",
        margin: "0.5rem 0",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
        border: "1px solid var(--color-border)",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            margin: 0,
            marginBottom: "0.5rem",
          }}
        >
          {title}
        </h3>
        {typeof progress === "number" && (
          <div>
            <div
              style={{
                position: "relative",
                background: "#23232a",
                borderRadius: "var(--radius)",
                height: "1.5rem",
                marginBottom: showMarkers ? "0.25rem" : "0.75rem",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, var(--color-green), #7bbf7f)",
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
                      borderLeft: "2px solid var(--color-text)",
                      transform: "translateX(-1px)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "90%",
                      borderLeft: "2px solid var(--color-text)",
                      transform: "translateX(-1px)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "99%",
                      borderLeft: "2px solid var(--color-text)",
                      transform: "translateX(-1px)",
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
                  marginBottom: "0.75rem",
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary)",
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
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default StatCard;
