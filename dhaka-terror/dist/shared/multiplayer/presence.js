// Minimal local-server player presence. NPC traffic remains local to each client.
export function createPresence({characterId,onSnapshot,onStatus}){
 let session=null,pose=null,busy=false,active=true;
 async function post(route,data){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);try{const r=await fetch('/api/players/'+route,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data),signal:controller.signal});if(r.status===401)session=null;if(!r.ok)throw Error('Connection unavailable');return await r.json()}finally{clearTimeout(timer)}}
 async function sync(){if(!active||busy||!pose)return;busy=true;try{if(!session)session=await post('join',{characterId});const result=await post('sync',{...session,...pose});if(!active)return;onSnapshot(result.players);onStatus(result.count)}catch{if(active)onStatus(null)}finally{busy=false}}
 const timer=setInterval(sync,250);
 function stop(){active=false;clearInterval(timer);if(session)fetch('/api/players/leave',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(session),keepalive:true}).catch(()=>{})}
 return{update(nextPose){pose={...nextPose}},stop};
}
