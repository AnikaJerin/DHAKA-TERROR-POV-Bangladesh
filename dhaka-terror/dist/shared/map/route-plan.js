import {getPlace,shortestRoute,exits,MAP_VERSION} from './network.js';
// Local forward-corridor adapter for the existing renderer. Does not imply physical junction turns.
export function createRoutePlan(startPlaceId='mirpur12'){
 const start=getPlace(startPlaceId);if(!start)throw new Error('Unknown start area: '+startPlaceId);
 const goal=getPlace(start.id==='mirpur10'?'agargaon':'mirpur10');const path=shortestRoute(start.id,goal.id).map(getPlace);
 return {mapVersion:MAP_VERSION,start,goal,path,districtAt(segmentIndex){const index=Math.max(0,segmentIndex);const p=path[Math.min(index,path.length-1)];return {id:p.id,name:p.en,bn:p.bn,type:p.metro?'metro':'street'}},getExits(placeId,fromId){return exits(placeId,fromId)}};
}
