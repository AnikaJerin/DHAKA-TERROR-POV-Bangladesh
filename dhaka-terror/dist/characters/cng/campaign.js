import {startBusMission} from '../../mission-network.js';
export const characterId='cng';
// Basic shared-city driving. CNG-specific missions belong in this directory.
export function start(options={}){return startBusMission({...options,characterId})}
