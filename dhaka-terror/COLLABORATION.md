# Shared Mirpur–Agargaon layout and ownership

Build the shared layout first. Both campaigns consume the same graph; do not duplicate it.

| Owner | Files |
| --- | --- |
| Shared map owner (current developer) | `dist/shared/map/`, `app.js`, `index.html`, shared world art modules |
| Bus developer | `dist/characters/bus/`, `dist/mission-network.js` (active), `dist/mission.js` (legacy), `bangladesh-bus.js` |
| CNG developer | `dist/characters/cng/` |

Use separate Git branches, for example `codex/bus-map` and `codex/cng-campaign`, preferably separate clones/worktrees. Separate files reduce conflicts but branches and coordinated changes to shared interfaces are still necessary. Do not edit the same shared source files concurrently. Request shared changes through a reviewed commit/PR. Do not rename stable map IDs.

## Map contract v1

`network.js` is pure immutable character-independent data. `getPlace(id)` returns a place. `exits(currentId, previousId)` returns destination/road/relative turn. `shortestRoute(startId, goalId)` returns connected place IDs. Every road is bidirectional in this compressed layout. This is a geographic game abstraction, not a representation of current lane restrictions or live navigation.

Coverage: Agargaon, Shewrapara, Kazipara, Mirpur 10, Mirpur 11, Mirpur 12/Pallabi; branches to Mirpur 14 and Mirpur 2/stadium, Mirpur 1, Technical, Kallyanpur, Shyamoli. No fictional expressway connector is included in this phase. Stadium position is approximate relative to the compressed road.

## Current phase versus next phase

Implemented: shared graph, relative exits, interactive map-layout preview, starting-area picker, and a forward-corridor adapter for the existing bus scene.

Physical junction update: `dist/shared/map/world.js` builds actual road geometry and exposes `nearest`, `drivable`, `pose`, `stopPose`, `crossingAhead`, and `update`. The bus now uses `mission-network.js`, with world-coordinate steering, graph-path traffic, a live minimap and a stadium exterior. `mission.js` is retained as the legacy corridor. Shared world rendering contains no bus campaign progress or fare rules. The world currently builds geometry once and distance-culls visibility; it does not yet unload geometry as you travel. Runtime and mobile performance are unverified.

The bus entry point is `characters/bus/campaign.js`. CNG should expose the same start options from its own `campaign.js`, without editing bus mission code. The detailed NPC CNG factory is a visual asset, not the collaborator's playable campaign.

## Shared-city multiplayer prototype

The active runtime now supports basic bus/CNG free roaming with spawn selection only. `characters/cng/campaign.js` is a thin basic-driving entry point; the collaborator owns its future CNG mission modules. Shared presence code is in `shared/multiplayer/presence.js`; the local Node server owns the relay. Do not implement separate maps or destination selection per character. NPC simulations are not synchronized yet. Coordinate changes to `mission-network.js`, `server.mjs`, the lobby and shared interfaces with the map owner.
