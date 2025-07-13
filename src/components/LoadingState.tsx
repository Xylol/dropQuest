interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div style={{ padding: "var(--space-m)" }}>
      {message}
    </div>
  );
}

export default LoadingState;