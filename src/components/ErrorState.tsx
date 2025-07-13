import { BackendError } from "../utils/errorUtils";
import ErrorMessage from "./ErrorMessage";
import Button from "./Button";

interface ErrorStateProps {
  error: string | BackendError;
  onBackToHome?: () => void;
  showBackButton?: boolean;
}

function ErrorState({ error, onBackToHome, showBackButton = true }: ErrorStateProps) {
  return (
    <div style={{ padding: "var(--space-m)", textAlign: "center" }}>
      <ErrorMessage error={error} />
      {showBackButton && onBackToHome && (
        <Button
          onClick={onBackToHome}
          style={{ marginTop: "var(--space-s)" }}
        >
          ← Back to Home
        </Button>
      )}
    </div>
  );
}

export default ErrorState;