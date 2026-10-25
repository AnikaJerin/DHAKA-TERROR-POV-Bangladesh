// One comedy beat per trip, after 3.5 continuous seconds at or below 60 km/h.
export function createSlowSpeedJoke(T,{root,camera,getBus,audio}){
 const bubble=document.createElement('div');bubble.hidden=true;bubble.setAttribute('role','status');bubble.setAttribute('aria-live','polite');root.append(bubble);
 const anchor=new T.Vector3();let enabled=false,slow=0,done=false,phase=-1,time=0;
 function reset(busRole){enabled=busRole;slow=0;done=false;phase=-1;time=0;bubble.hidden=true;}
 function show(passenger){bubble.hidden=false;bubble.className='bus-dialogue comic-pop '+(passenger?'passenger-dialogue':'helper-dialogue');
  bubble.innerHTML=passenger?'<small>জানালার যাত্রী</small><strong>হ! বাসা থেইকা ডাইকা আনো গা যাও!</strong>':'<small>হেলপার</small><strong>ওস্তাদ, খাড়ান! কয়টা যাত্রী লইয়া লই!</strong>';
  audio.say(passenger?'passenger':'callout');
 }
 function update(dt,speed,driving){if(!enabled||done)return;
  if(phase===-1){slow=driving&&speed<=60/3.6?slow+dt:0;if(slow<3.5)return;phase=0;time=0;show(false);}
  else{time+=dt;if(phase===0&&time>=3){phase=1;time=0;show(true);}else if(phase===1&&time>=3){bubble.hidden=true;done=true;return;}}
 }
 function position(){if(bubble.hidden)return;const passenger=phase===1;const bus=getBus();bus.updateWorldMatrix(true,false);anchor.set(passenger?-1.65:-1.95,3.25,passenger?1.8:-1.62);bus.localToWorld(anchor);camera.updateMatrixWorld();anchor.project(camera);
  bubble.style.left=`${Math.max(20,Math.min(80,(anchor.x*.5+.5)*100+(passenger?10:-7)))}%`;bubble.style.top=`${Math.max(23,Math.min(70,(-anchor.y*.5+.5)*100))}%`;bubble.classList.toggle('comic-burst',time>2.77);
 }
 return{reset,update,position,get busy(){return phase>=0&&!done},hide(){bubble.hidden=true;done=true}};
}
