interface NotFoundStateProps {
  message?: string;
}

function NotFoundState({ message = "Player not found" }: NotFoundStateProps) {
  return (
    <div style={{ padding: "var(--space-m)" }}>
      {message}
    </div>
  );
}

export default NotFoundState;