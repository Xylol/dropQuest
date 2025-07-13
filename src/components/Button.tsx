import React from "react";

if (!document.getElementById("dropquest-button-style")) {
  const style = document.createElement("style");
  style.id = "dropquest-button-style";
  style.innerHTML = `
    .dq-btn {
      background: var(--color-green, #3a4d3f);
      color: var(--color-text, #f4f4f5);
      border: 0.0625rem solid var(--color-border, #27272a);
      border-radius: var(--radius, 0.5rem);
      padding: 0.75rem 1.5rem;
      font-size: clamp(0.875rem, 2.5vw, 1rem);
      font-weight: 500;
      cursor: pointer;
      transition: none;
      outline: none;
      box-shadow: none;
      text-align: center;
    }
    .dq-btn:disabled {
      background: var(--color-surface, #23232a);
      color: var(--color-text-secondary, #a1a1aa);
      cursor: not-allowed;
      opacity: 0.6;
    }
    .dq-btn.dq-btn-destructive {
      background: var(--color-destructive, #8c2b2b);
      color: white;
    }
    .dq-btn.dq-btn-secondary {
      background: var(--color-surface, #23232a);
      color: var(--color-text, #f4f4f5);
      border: 0.0625rem solid var(--color-border, #27272a);
    }
    .dq-btn.dq-btn-muted {
      background: var(--color-surface, #23232a);
      color: var(--color-text-secondary, #a1a1aa);
      border: 0.0625rem solid var(--color-border, #27272a);
    }
    .dq-btn.dq-btn-blue {
      background: var(--color-primary, #4f46e5);
      color: white;
      border: 0.0625rem solid var(--color-primary, #4f46e5);
    }
    .dq-btn.dq-btn-size-small {
      padding: 0.5rem 1rem;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
    }
    .dq-btn.dq-btn-size-large {
      padding: 1rem 2rem;
      font-size: clamp(1rem, 3vw, 1.125rem);
    }
  `;
  document.head.appendChild(style);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "destructive" | "secondary" | "muted" | "blue";
  size?: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({
  loading,
  children,
  className = "",
  variant = "primary",
  size = "medium",
  ...props
}) => {
  const variantClass = variant !== "primary" ? `dq-btn-${variant}` : "";
  const sizeClass = size !== "medium" ? `dq-btn-size-${size}` : "";
  
  return (
    <button
      {...props}
      className={`dq-btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={props.disabled || loading}
    >
      {loading ? "..." : children}
    </button>
  );
};

export default Button;
