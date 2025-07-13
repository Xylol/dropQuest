import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = () => {
    navigate("/");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
        padding: "var(--space-s)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", gap: "var(--space-s)" }}>
        <Button
          onClick={handleHome}
          variant={location.pathname === "/" ? "primary" : "secondary"}
          size="small"
        >
          Home
        </Button>
        {location.pathname !== "/settings" && (
          <Button
            onClick={handleSettings}
            variant="secondary"
            size="small"
          >
            Settings
          </Button>
        )}
      </div>
    </div>
  );
}

export default BottomNav;
