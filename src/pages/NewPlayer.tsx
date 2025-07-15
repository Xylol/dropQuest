import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NewPlayer() {
  const navigate = useNavigate();

  useEffect(() => {
    const createPlayer = async () => {
      try {
        const response = await fetch("/api/players", {
          method: "POST",
        });
        if (response.ok) {
          const player = await response.json();
          navigate(`/player/${player.id}`);
        } else {
          navigate("/"); // Redirect home on error
        }
      } catch {
        navigate("/"); // Redirect home on error
      }
    };

    createPlayer();
  }, [navigate]);

  return <div>Creating a new player...</div>;
}

export default NewPlayer;
