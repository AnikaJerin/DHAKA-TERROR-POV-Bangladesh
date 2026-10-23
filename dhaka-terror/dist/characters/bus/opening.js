// First stop comic exchange; never changes the driving camera. Timeline uses simulation time, so pauses do not consume captions.
export function createBusOpening(T,{root,camera,getBus,audio}){
 const bubble=document.createElement('div');bubble.className='bus-dialogue';bubble.hidden=true;bubble.setAttribute('role','status');bubble.setAttribute('aria-live','polite');root.append(bubble);
 const anchor=new T.Vector3();let running=false,beat=-1;
 function reset(enabled){running=enabled;root.classList.toggle('bus-opening',enabled);beat=-1;bubble.hidden=true;audio.resetDialogue();}
 function update(time){
  if(!running)return false;
  const next=time<2.5?0:time<5?1:2;
  if(next!==beat){beat=next;bubble.className='bus-dialogue comic-pop';bubble.hidden=next===2;
   if(next===0)bubble.innerHTML='<small>ড্রাইভার</small><strong>লও, যাইগা!</strong>';
   if(next===1){bubble.innerHTML='<small>হেলপার</small><strong>ওস্তাদ, খাড়ান! আরেকজন উঠুক!</strong>';audio.helper();}
  }
  if(next===2){root.classList.remove('bus-opening');running=false;return false;}
  const bus=getBus();bus.updateWorldMatrix(true,false);
  const driver=next===0;
  anchor.set(driver ? .82 : -1.82,3.1,driver?-3.72:-1.62);bus.localToWorld(anchor);
  // Keep the player's driving camera; only the comic balloon tracks the speaker.
  camera.updateMatrixWorld();anchor.project(camera);
  bubble.classList.toggle('comic-burst',time%2.5>2.27);
  bubble.style.left=`${Math.max(18,Math.min(82,(anchor.x*.5+.5)*100))}%`;bubble.style.top=`${Math.max(24,Math.min(72,(-anchor.y*.5+.5)*100))}%`;
  return true;
 }
 return{reset,update,hide(){root.classList.remove('bus-opening');running=false;bubble.hidden=true}};
}
