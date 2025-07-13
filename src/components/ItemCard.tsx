import { useNavigate } from "react-router-dom";
import { Item } from "../types/Item";
import Button from "./Button";
import { formatDate } from "../utils/dateUtils";

interface ItemCardProps {
  item: Item;
  onToggleFound: (itemId: string, found: boolean) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
  isMarkingAsFound: boolean;
}

function ItemCard({ item, onToggleFound, onDelete, isMarkingAsFound }: ItemCardProps) {
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      await onDelete(item.id);
    }
  };

  const handleToggleFound = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggleFound(item.id, !item.found);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/item/${item.id}`);
  };

  const handleItemClick = () => {
    navigate(`/item/${item.id}`);
  };

  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius)",
        padding: "var(--space-s)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: item.found
          ? "2px solid var(--color-primary)"
          : "1px solid var(--color-border)",
      }}
    >
      <div
        style={{ cursor: "pointer", flex: 1 }}
        onClick={handleItemClick}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-xs)",
          }}
        >
          <p style={{ 
            margin: 0, 
            fontWeight: "500", 
            fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)"
          }}>
            {item.name}
          </p>
          {item.found && (
            <span
              style={{
                fontSize: "clamp(0.625rem, 2vw, 0.875rem)",
                color: "var(--color-primary)",
                fontWeight: "bold",
              }}
            >
              ✓ FOUND
            </span>
          )}
        </div>
        <p
          style={{
            margin: "var(--space-xs) 0 0",
            fontSize: "clamp(0.75rem, 2.25vw, 1rem)",
            color: "var(--color-text-secondary)",
          }}
        >
          Runs: {item.numberOfRuns || 0} • Created:{" "}
          {formatDate(item.createdAt)}
        </p>
      </div>
      <div style={{ display: "flex", gap: "var(--space-xs)" }}>
        {!item.found && (
          <Button
            onClick={handleEdit}
            variant="blue"
            size="small"
            style={{ flex: 1 }}
          >
            Edit
          </Button>
        )}
        <Button
          onClick={handleToggleFound}
          disabled={isMarkingAsFound}
          variant={item.found ? "muted" : "primary"}
          size="small"
          style={{ flex: 1 }}
        >
          {item.found ? "Undo found" : "Found"}
        </Button>
        <Button
          onClick={handleDelete}
          variant={item.found ? "muted" : "destructive"}
          size="small"
          style={{ flex: 1 }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ItemCard;