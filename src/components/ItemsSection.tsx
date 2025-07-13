import { Item } from "../types/Item";
import ItemForm from "./ItemForm";
import ItemCard from "./ItemCard";

interface ItemsSectionProps {
  items: Item[];
  playerId: string;
  onItemCreated: () => void;
  onToggleFound: (itemId: string, found: boolean) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  isMarkingAsFound: boolean;
}

function ItemsSection({ 
  items, 
  playerId, 
  onItemCreated, 
  onToggleFound, 
  onDeleteItem, 
  isMarkingAsFound 
}: ItemsSectionProps) {
  return (
    <section>
      <h2
        style={{
          fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
          fontWeight: 600,
          marginBottom: "var(--space-s)",
        }}
      >
        Items ({items.length})
      </h2>
      <div style={{ 
        marginBottom: "var(--space-m)",
        maxWidth: "50%"
      }}>
        <ItemForm playerId={playerId} onItemCreated={onItemCreated} />
      </div>

      {items.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onToggleFound={onToggleFound}
              onDelete={onDeleteItem}
              isMarkingAsFound={isMarkingAsFound}
            />
          ))}
        </div>
      ) : (
        <p style={{ 
          color: "var(--color-text-secondary)",
          fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)"
        }}>
          No items yet. Add one above to start your quest!
        </p>
      )}
    </section>
  );
}

export default ItemsSection;