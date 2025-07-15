import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import useGetAllPlayers from "../hooks/useGetAllPlayers";
import { sortPlayersByLastUsed } from "../utils/playerUtils";

function ContinuePlayer() {
  const navigate = useNavigate();
  const { players, loading, error } = useGetAllPlayers();
  
  const sortedPlayers = sortPlayersByLastUsed(players);

  if (loading) {
    return <LoadingState message="Loading your players..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onBackToHome={() => navigate("/")}
      />
    );
  }

  if (sortedPlayers.length === 0) {
    return (
      <div
        style={{ 
          padding: "var(--space-m)", 
          maxWidth: "600px", 
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        <h1
          style={{
            fontSize: "var(--font-size-xxl)",
            marginBottom: "var(--space-m)",
          }}
        >
          No Players Found
        </h1>
        <p style={{ 
          color: "var(--color-text-secondary)", 
          marginBottom: "var(--space-l)" 
        }}>
          You haven&apos;t created any players yet. Create your first player to start your quest!
        </p>
        <Button 
          onClick={() => navigate("/new-player")}
          style={{ marginBottom: "var(--space-s)" }}
        >
          Create New Player
        </Button>
        <br />
        <Button
          onClick={() => navigate("/")}
          style={{ background: "var(--color-surface)" }}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div
      style={{ 
        padding: "var(--space-m)", 
        maxWidth: "600px", 
        margin: "0 auto",
        minHeight: "100vh"
      }}
    >
      <div style={{ marginBottom: "var(--space-m)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--font-size-xl)" }}>
          Choose Your Player
        </h1>
      </div>

      <div style={{ marginBottom: "var(--space-m)" }}>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-s)" }}>
          Select a player to continue your quest. You have {players.length} player{players.length === 1 ? '' : 's'}.
        </p>
        <Button 
          onClick={() => navigate("/new-player")}
          style={{ 
            background: "var(--color-green)",
            width: "100%"
          }}
        >
          Create New Player
        </Button>
      </div>

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "var(--space-s)" 
      }}>
        {sortedPlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => navigate(`/player/${player.id}`)}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius)",
              padding: "1rem",
              margin: 0,
              boxShadow: "0 0.125rem 0.5rem 0 rgba(0,0,0,0.04)",
              border: "0.0625rem solid var(--color-border)",
              minWidth: 0,
              cursor: "pointer",
            }}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start",
              marginBottom: "0.5rem"
            }}>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: "clamp(1.125rem, 4.5vw, 1.75rem)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  color: "var(--color-text)"
                }}>
                  {player.heroName || "Unnamed Hero"}
                </h3>
                <p style={{ 
                  margin: "0.25rem 0 0 0", 
                  fontSize: "clamp(0.75rem, 2.5vw, 1rem)",
                  color: "var(--color-text-secondary)" 
                }}>
                  Created: {formatDate(player.createdAt)}
                </p>
                {player.lastUsedAt && (
                  <p style={{ 
                    margin: "0.25rem 0 0 0", 
                    fontSize: "clamp(0.75rem, 2.5vw, 1rem)",
                    color: "var(--color-text-secondary)" 
                  }}>
                    Last selected: {formatDate(player.lastUsedAt)}
                  </p>
                )}
              </div>
            </div>
            <div style={{ 
              fontSize: "clamp(0.625rem, 2vw, 0.875rem)",
              color: "var(--color-text-secondary)" 
            }}>
              Player ID: {player.id}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: "var(--space-l)",
        marginBottom: "80px"
      }}>
        {/* Spacer for bottom navigation */}
      </div>
      <BottomNav />
    </div>
  );
}

export default ContinuePlayer;
