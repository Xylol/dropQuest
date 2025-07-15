import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import type { Item } from "../types/Item";

import BottomNav from "../components/BottomNav";
import Button from "../components/Button";
import InfoBox from "../components/InfoBox";
import ProgressBox from "../components/ProgressBox";
import { calculateDaysBetween, calculateRunsPerDay } from "../utils/dateUtils";
import { validateRarityInputs } from "../utils/rarityUtils";
import useSetRarity from "../hooks/useSetRarity";
import useUpdateTotalRuns from "../hooks/useUpdateTotalRuns";
import useUpdateDate from "../hooks/useUpdateDate";

function calculateProgressProbability(runs: number, rarity: number): number {
  const probability = 1 - Math.pow((rarity - 1) / rarity, runs);
  return Math.min(100, probability * 100);
}

function calculateRunsForProbability(
  rarity: number,
  probability: number
): number {
  if (rarity <= 1) return Infinity;
  return Math.ceil(Math.log(1 - probability) / Math.log((rarity - 1) / rarity));
}

function ItemDetail() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  
  const { setRarity } = useSetRarity();
  const { updateTotalRuns } = useUpdateTotalRuns();
  const { updateDate } = useUpdateDate();

  // Validation functions
  const validateRarity = (value: string): string => {
    return validateRarityInputs("", value);
  };

  const validateRuns = (value: string): string => {
    if (!value.trim()) {
      return "Total runs count is required";
    }
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      return "Total runs must be a number";
    }
    if (!Number.isInteger(numValue)) {
      return "Total runs must be a whole number";
    }
    if (numValue < 0) {
      return "Total runs cannot be negative";
    }
    if (numValue > 1000000) {
      return "Total runs cannot exceed 1,000,000";
    }
    return "";
  };

  const validateHuntingDate = (value: string): string => {
    if (!value.trim()) {
      return "Date is required";
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return "Invalid date format. Use YYYY-MM-DD";
    }
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (inputDate > today) {
      return "Date cannot be in the future";
    }
    return "";
  };

  const validateMinutesPerRun = (value: string): string => {
    if (!value.trim()) {
      return "Minutes per run is required";
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return "Minutes per run must be a number";
    }
    if (numValue < 0) {
      return "Minutes per run cannot be negative";
    }
    if (numValue > 10000) {
      return "Minutes per run cannot exceed 10,000";
    }
    return "";
  };

  // Update handlers
  const handleRarityUpdate = async (newValue: string | number): Promise<boolean> => {
    if (!item) return false;
    const rarity = parseInt(newValue.toString());
    const success = await setRarity(item.id, rarity);
    if (success) {
      window.location.reload();
    }
    return success;
  };

  const handleRunsUpdate = async (newValue: string | number): Promise<boolean> => {
    if (!item) return false;
    const runs = parseInt(newValue.toString());
    const success = await updateTotalRuns(item.id, runs);
    if (success) {
      window.location.reload();
    }
    return success;
  };

  const handleDateUpdate = async (newValue: string | number): Promise<boolean> => {
    if (!item) return false;
    const success = await updateDate(item.id, newValue.toString());
    if (success) {
      window.location.reload();
    }
    return success;
  };

  const handleMinutesPerRunUpdate = async (newValue: string | number): Promise<boolean> => {
    if (!item) return false;
    const minutesPerRun = parseFloat(newValue.toString());
    
    try {
      const response = await fetch(`/api/items`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, minutesPerRun }),
      });

      if (response.ok) {
        window.location.reload();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) {
        setError("No item ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/items/${itemId}`);
        if (response.ok) {
          const itemData = await response.json();
          setItem(itemData);
        } else if (response.status === 404) {
          setError("Item not found");
        } else {
          setError("Failed to fetch item");
        }
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleNameUpdate = async () => {
    if (!item || !editedName.trim()) return;

    try {
      const response = await fetch(`/api/items`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, name: editedName.trim() }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItem(updatedItem);
        setIsEditingName(false);
      } else {
      }
    } catch {
    }
  };

  const getItemRunsPerDay = (item: Item): number => {
    if (!item.createdAt || !item.numberOfRuns) return 0;
    const daysSince = calculateDaysBetween(item.createdAt);
    return calculateRunsPerDay(item.numberOfRuns, daysSince);
  };


  if (loading)
    return <div style={{ padding: "var(--space-m)" }}>Loading...</div>;

  if (error) {
    return (
      <div style={{ padding: "var(--space-m)", textAlign: "center" }}>
        <p>{error}</p>
        <Button
          onClick={() => navigate(-1)}
          style={{ marginTop: "var(--space-s)" }}
        >
          ← Go Back
        </Button>
      </div>
    );
  }

  if (!item)
    return <div style={{ padding: "var(--space-m)" }}>Item not found</div>;

  const runsPerDay = getItemRunsPerDay(item);

  return (
    <div
      style={{
        padding: "var(--space-s)",
        paddingBottom: "4rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-m)",
        }}
      >
        {isEditingName ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleNameUpdate()}
              style={{ fontSize: "var(--font-size-xxl)", margin: 0 }}
            />
            <Button onClick={handleNameUpdate}>Save</Button>
            <Button
              onClick={() => setIsEditingName(false)}
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <h1
            style={{
              fontSize: "var(--font-size-xxl)",
              margin: 0,
              cursor: "pointer",
            }}
            onClick={() => {
              setEditedName(item?.name || "");
              setIsEditingName(true);
            }}
          >
            {item.name}
          </h1>
        )}
        <Button
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
              fetch(`/api/items/${item.id}`, { method: "DELETE" }).then(() =>
                navigate(`/player/${item.playerId}`)
              );
            }
          }}
          variant="destructive"
        >
          Delete Item
        </Button>
      </header>


      {item.rarity && item.numberOfRuns ? (
        <div style={{ marginBottom: "1rem" }}>
          <ProgressBox
            progress={calculateProgressProbability(item.numberOfRuns, item.rarity) / 100}
            value={`(${calculateProgressProbability(item.numberOfRuns, item.rarity).toFixed(2)}%)`}
            achievementText={item.achievementText || undefined}
            showMarkers={true}
          />
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          maxWidth: "60rem",
          margin: "0 auto",
        }}
      >
        <InfoBox
          title="HUNTING SINCE"
          value={new Date(item.createdAt).toISOString().split("T")[0]}
          editable={true}
          inputType="date"
          onUpdate={handleDateUpdate}
          validationFn={validateHuntingDate}
        />
        <InfoBox
          title="RARITY"
          value={item.rarity || 0}
          editable={true}
          inputType="text"
          onUpdate={handleRarityUpdate}
          validationFn={validateRarity}
        />
        <InfoBox
          title="RUNS"
          value={item.numberOfRuns || 0}
          editable={true}
          inputType="text"
          onUpdate={handleRunsUpdate}
          validationFn={validateRuns}
        />
        <InfoBox
          title="MINUTES PER RUN"
          value={item.minutesPerRun || 0}
          editable={true}
          inputType="text"
          onUpdate={handleMinutesPerRunUpdate}
          validationFn={validateMinutesPerRun}
        />
        <InfoBox
          title="DAYS"
          value={Math.max(
            1,
            Math.floor(
              (new Date().getTime() - new Date(item.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          )}
          editable={false}
        />
        {item.rarity ? (
          <InfoBox
            title="50 | 90 | 99 %"
            value={`${calculateRunsForProbability(item.rarity, 0.5).toLocaleString()} | ${calculateRunsForProbability(item.rarity, 0.9).toLocaleString()} | ${calculateRunsForProbability(item.rarity, 0.99).toLocaleString()}`}
            editable={false}
          />
        ) : (
          <InfoBox
            title="50 | 90 | 99 %"
            value="Set rarity first"
            editable={false}
          />
        )}
        <InfoBox
          title="RUNS PER DAY"
          value={runsPerDay}
          editable={false}
        />
        <InfoBox
          title="TOTAL RUNTIME"
          value={(() => {
            const runs = item.numberOfRuns || 0;
            const minutesPerRun = item.minutesPerRun || 0;
            const totalMinutes = runs * minutesPerRun;
            
            if (totalMinutes === 0) return "0 min";
            
            const hours = Math.floor(totalMinutes / 60);
            const minutes = Math.round(totalMinutes % 60);
            
            if (hours === 0) return `${minutes} min`;
            if (minutes === 0) return `${hours}h`;
            return `${hours}h ${minutes}m`;
          })()}
          editable={false}
        />
      </div>

      <BottomNav />
    </div>
  );
}

export default ItemDetail;
