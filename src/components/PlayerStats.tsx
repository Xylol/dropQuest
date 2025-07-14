import { Player } from "../types/Player";
import { Item } from "../types/Item";
import InfoBox from "./InfoBox";
import { calculatePlayerRunsPerDay, calculateTotalRuns } from "../utils/playerStats";
import { InputSanitizationService } from "../services/InputSanitizationService";
import { fetchWithErrorHandling } from "../utils/errorUtils";

interface PlayerStatsProps {
  player: Player;
  items: Item[];
  onHeroNameUpdated: () => void;
}

function PlayerStats({ player, items, onHeroNameUpdated }: PlayerStatsProps) {
  // Validation function for hero name
  const validateHeroName = (value: string): string => {
    const sanitizationResult = InputSanitizationService.sanitizeHeroName(value);
    if (!sanitizationResult.isValid) {
      return sanitizationResult.error || "Invalid hero name";
    }
    return "";
  };

  // Update handler for hero name
  const handleHeroNameUpdate = async (newValue: string | number): Promise<boolean> => {
    const heroName = newValue.toString().trim();
    const sanitizationResult = InputSanitizationService.sanitizeHeroName(heroName);
    
    if (!sanitizationResult.isValid) {
      return false;
    }

    try {
      await fetchWithErrorHandling(`/api/player/${player.id}/hero-name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ heroName: sanitizationResult.sanitized }),
      });

      if (onHeroNameUpdated) {
        onHeroNameUpdated();
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
        maxWidth: "60rem",
        margin: "0 auto",
        marginBottom: "var(--space-m)",
      }}
    >
      <InfoBox
        title="HERO NAME"
        value={player.heroName || "No hero name set"}
        editable={true}
        inputType="text"
        onUpdate={handleHeroNameUpdate}
        validationFn={validateHeroName}
      />
      <InfoBox
        title="FINISHED HUNTS"
        value={player.experience || 0}
        editable={false}
      />
      <InfoBox
        title="RUNS PER DAY"
        value={calculatePlayerRunsPerDay(items)}
        editable={false}
      />
      <InfoBox
        title="TOTAL RUNS"
        value={calculateTotalRuns(items)}
        editable={false}
      />
    </div>
  );
}

export default PlayerStats;