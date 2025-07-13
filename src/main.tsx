import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import ContinuePlayer from "./pages/ContinuePlayer";
import ItemDetail from "./pages/ItemDetail";
import NewPlayer from "./pages/NewPlayer";
import PlayerMain from "./pages/PlayerMain";
import Settings from "./pages/Settings";

import "./services/apiProxy";


const style = document.createElement("style");
style.innerHTML = `
  :root {
    --color-bg: #18181b;
    --color-surface: #23232a;
    --color-primary: #4f46e5;
    --color-primary-hover: #6366f1;
    --color-green: #3a4d3f;
    --color-green-hover: #4e6652;
    --color-destructive: #8c2b2b;
    --color-text: #f4f4f5;
    --color-text-secondary: #a1a1aa;
    --color-border: #27272a;
    --radius: 0.5rem;
    --space-xs: 0.5rem;
    --space-s: 1rem;
    --space-m: 2rem;
    --space-l: 3rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-xxl: 2rem;
  }
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: system-ui, sans-serif;
    font-size: var(--font-size-base);
    box-sizing: border-box;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }
  input, textarea, select {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 0.75rem;
    font-size: 1rem;
    width: 100%;
    transition: none;
  }
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--color-border);
  }
`;
document.head.appendChild(style);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter basename="/dropQuest/">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/new-player" element={<NewPlayer />} />
          <Route path="/continue" element={<ContinuePlayer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/player" element={<Navigate to="/" replace />} />
          <Route path="/player/:id" element={<PlayerMain />} />
          <Route path="/item/:itemId" element={<ItemDetail />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
