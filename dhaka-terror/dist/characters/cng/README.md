# CNG collaborator workspace

Create your CNG campaign in this directory (for example `campaign.js`, `missions.js`, `ui.js`, `dialogues.js`). Your entry point should export `start({language, startPlaceId, onExit})` and `characterId = 'cng'`.

Use the SAME shared network:

```js
import {getPlace, exits, shortestRoute, roads, landmarks} from '../../shared/map/network.js';
import {showAreaPicker} from '../../shared/map/layout.js';
```

`exits(placeId, previousPlaceId)` returns connected roads, destination places and relative turn directions. Positions use X east, Y up, Z south in compressed game metres. IDs are stable. The layout is shared; fares, passenger rules, missions, save keys and CNG UI belong here. Store campaign state under `dhaka-cng-v1`, not the bus save key.

Use `../../shared/map/world.js` for the shared physical road geometry and road queries. It exports `createNetworkWorld(T, dependencies)`, whose object exposes `pose`, `stopPose`, `nearest`, `drivable`, `crossingAhead`, `update`, and `chunks`. Use the same shared scenery factories as `mission-network.js`, while implementing CNG controls/missions in this directory. The old `route-plan.js` corridor adapter remains only for legacy code.

Coordinate shared-file/interface changes with the bus/map owner before editing them. You do not need to modify `mission.js` or bus models to build your campaign.
