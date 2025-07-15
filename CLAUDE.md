# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development:**
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production (TypeScript compilation + Vite build)
npm run preview      # Preview production build locally
```

**Testing:**
```bash
npm test             # Run all tests
npm run test:utils   # Run utility tests only
npm run test:components  # Run component tests only
```

**Deployment:**
- App is configured for GitHub Pages deployment with basename `/dropQuest/`
- Build output goes to `dist/` directory
- Includes 404.html for SPA routing support on static hosting

## Architecture Overview

### Data Models
- **Player**: Contains `id`, `createdAt`, `experience`, `heroName`, `items[]`, and calculated `luck`
- **Item**: Contains `id`, `name`, `numberOfRuns`, `rarity`, `found` status, and `achievementText`

### Service Layer (Three-Tier Architecture)
1. **Storage Layer**: LocalStorageService with URL-based prefixing and quota management
2. **Business Logic**: ItemService and PlayerService handle CRUD operations and calculations
3. **API Simulation**: LocalBackendService simulates REST API with proper HTTP responses

**Key Services:**
- `LocalBackendService`: Complete REST API simulation intercepting `/api/*` calls
- `apiProxy`: Fetch interceptor routing API calls to LocalBackendService
- `DataPortabilityService`: Export/import functionality for user data
- `InputSanitizationService`: Input validation and sanitization

### State Management
- **No global state library** - uses custom hooks pattern
- **Custom hooks**: `usePlayerData`, `useMarkAsFound`, `useSetRarity`, etc.
- **Local component state** with React useState
- **Callback patterns** for parent-child communication

### Routing Structure
- Uses React Router with BrowserRouter and basename `/dropQuest/`
- Main routes: `/`, `/new-player`, `/player-selection`, `/settings`, `/player/:id`, `/item/:itemId`
- Includes SPA routing fallback for GitHub Pages deployment

### Component Architecture
- **Compound components** for complex UI sections (ItemsSection, PlayerStats)
- **Presentational/Container split** with controlled components
- **Reusable components**: Button, ItemCard, InfoBox, ProgressBox
- **CSS-in-JS** with CSS custom properties for theming

### Key Architectural Patterns
- **API interception**: Fetch calls to `/api/*` are intercepted and handled locally
- **Type safety**: Comprehensive TypeScript types throughout
- **Error handling**: Consistent error boundaries and handling patterns
- **Data portability**: Built-in export/import for user data
- **Achievement system**: Dynamic achievement text based on runs/rarity calculations
- **Statistical calculations**: Luck metrics, probability calculations, and performance tracking

## GitHub Pages Deployment Notes
- App uses BrowserRouter which requires special handling for direct URL access
- `public/404.html` contains SPA routing fallback script
- `index.html` includes redirect parameter handling for proper routing
- Ensure 404.html is deployed alongside other static assets