// Local Bengali dialogue plus original lightweight Web Audio street ambience.
export function createDhakaAudio(){
 let ctx,master,bed,engine,engineGain,noise,enabled=true,paused=true,clock=0,nextHorn=3,pending=false,played=false,unlocked=false,pendingClip='opening',dialogueTone,grit,impactNoise;
 const clips={opening:'helper-local-opening-bn.mp3',callout:'helper-jaibenni-bn.mp3',passenger:'passenger-retort-bn.mp3',p32:'passenger-32-bn.mp3',h34:'helper-34-bn.mp3',p34:'passenger-34-bn.mp3',d35:'driver-35-bn.mp3',p35:'passenger-35-bn.mp3'};
 const clipUrl=key=>new URL('../../assets/audio/'+clips[key],import.meta.url).href;const preload=Object.keys(clips).map(key=>{const a=new Audio(clipUrl(key));a.preload='auto';return a});
 const voice=new Audio(clipUrl('opening'));voice.preload='auto';voice.volume=.95;
 try{enabled=localStorage.getItem('dhaka-game-audio')!=='off'}catch{}
 function tone(freq,duration=.28,volume=.07,delay=0){if(!ctx||paused||!enabled)return;const start=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(freq,start);o.frequency.linearRampToValueAtTime(freq*.94,start+duration);g.gain.setValueAtTime(.001,start);g.gain.exponentialRampToValueAtTime(volume,start+.025);g.gain.exponentialRampToValueAtTime(.001,start+duration);o.connect(g);g.connect(bed);o.start(start);o.stop(start+duration+.02);o.onended=()=>{o.disconnect();g.disconnect()};}
 function build(){if(ctx)return;const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;ctx=new Context();master=ctx.createGain();master.gain.value=enabled && !paused ? .55 : 0;master.connect(ctx.destination);bed=ctx.createGain();bed.gain.value=.7;bed.connect(master);
  // Generic adult male delivery with mild chest/body and rasp, not an actor imitation.
  const dialogue=ctx.createMediaElementSource(voice),chest=ctx.createBiquadFilter(),level=ctx.createDynamicsCompressor();dialogueTone=chest;grit=ctx.createWaveShaper();
  chest.type='lowshelf';chest.frequency.value=190;chest.gain.value=2;
  const curve=new Float32Array(512);for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=Math.tanh(x*1.1)/Math.tanh(1.1)}grit.curve=curve;
  level.threshold.value=-16;level.knee.value=16;level.ratio.value=2.5;level.attack.value=.006;level.release.value=.12;
  const dialogueGain=ctx.createGain();dialogueGain.gain.value=1.65;dialogue.connect(chest);chest.connect(grit);grit.connect(level);level.connect(dialogueGain);dialogueGain.connect(master);

  engine=ctx.createOscillator();engine.type='triangle';engine.frequency.value=43;engineGain=ctx.createGain();engineGain.gain.value=.075;engine.connect(engineGain);engineGain.connect(bed);engine.start();
  // Filtered rolling-road noise: short reusable buffer, no downloads or audio work per sample.
  const buffer=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){last=(last+(Math.random()*2-1)*.025)/1.025;data[i]=last*2.5;}
  const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=700;noise=ctx.createGain();noise.gain.value=.18;source.connect(filter);filter.connect(noise);noise.connect(bed);source.start();
  impactNoise=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.25),ctx.sampleRate);const impactData=impactNoise.getChannelData(0);for(let i=0;i<impactData.length;i++)impactData[i]=(Math.random()*2-1)*Math.pow(1-i/impactData.length,2);
  const bustle=ctx.createBiquadFilter();bustle.type='bandpass';bustle.frequency.value=1100;bustle.Q.value=.7;const crowd=ctx.createGain();crowd.gain.value=.045;source.connect(bustle);bustle.connect(crowd);crowd.connect(bed);const chatter=ctx.createOscillator(),mod=ctx.createGain();chatter.frequency.value=4.7;mod.gain.value=.018;chatter.connect(mod);mod.connect(crowd.gain);chatter.start();
 }
 function say(key='opening'){
  if(!clips[key]||!enabled)return;pending=true;pendingClip=key;if(!unlocked||paused)return;
  if(dialogueTone)dialogueTone.gain.value=(key==='passenger'||key.startsWith('p'))?0:2;
  voice.pause();voice.src=clipUrl(key);voice.currentTime=0;voice.muted=false;
  voice.play().then(()=>{pending=false;if(key==='opening')played=true;ctx&&bed.gain.setTargetAtTime(.3,ctx.currentTime,.08)}).catch(()=>{pending=true});
 }
 function impact(){if(!ctx||paused||!enabled)return;const now=ctx.currentTime,kick=ctx.createOscillator(),gain=ctx.createGain();kick.type='sine';kick.frequency.setValueAtTime(175,now);kick.frequency.exponentialRampToValueAtTime(42,now+.28);gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.6,now+.008);gain.gain.exponentialRampToValueAtTime(.001,now+.34);kick.connect(gain);gain.connect(master);kick.start(now);kick.stop(now+.35);kick.onended=()=>{kick.disconnect();gain.disconnect()};
  const crack=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),level=ctx.createGain();crack.buffer=impactNoise;filter.type='bandpass';filter.frequency.value=950;filter.Q.value=.7;level.gain.value=.32;crack.connect(filter);filter.connect(level);level.connect(master);crack.start();crack.onended=()=>{crack.disconnect();filter.disconnect();level.disconnect()};
 }
 function helper(){if(!played)say('opening');}

 voice.onended=()=>{if(ctx)bed.gain.setTargetAtTime(.7,ctx.currentTime,.2)};
 function unlock(){try{build();ctx?.resume().then(()=>{if(!paused&&enabled){unlocked=true;if(pending)say(pendingClip)}}).catch(()=>{});
  // Prime media playback synchronously within the starting-area click gesture.
  if(!unlocked&&enabled){voice.muted=true;voice.play().then(()=>{voice.pause();voice.currentTime=0;voice.muted=false;unlocked=true;if(pending)say(pendingClip)}).catch(()=>{});}
 }catch{}}
 function setPaused(value){paused=value;if(ctx)master.gain.setTargetAtTime(enabled && !paused ? .55 : 0,ctx.currentTime,.05);if(paused)voice.pause();else if(enabled){ctx?.resume().catch(()=>{});if(played&&!voice.ended&&voice.currentTime>0)voice.play().catch(()=>{});else if(pending)say(pendingClip);}}
 function setEnabled(value){enabled=value;try{localStorage.setItem('dhaka-game-audio',enabled?'on':'off')}catch{}if(!enabled){voice.pause();if(pending){pending=false;played=true}}else unlock();setPaused(paused);return enabled;}
 function resetDialogue(){voice.pause();voice.currentTime=0;pending=false;played=false;if(ctx)bed.gain.setTargetAtTime(.7,ctx.currentTime,.08);}
 function update(dt,speed){if(paused||!enabled||!ctx)return;engine.frequency.setTargetAtTime(43+speed*2.2,ctx.currentTime,.15);noise.gain.setTargetAtTime(.11+speed*.007,ctx.currentTime,.2);clock+=dt;if(clock>nextHorn){const f=[185,233,294,370][Math.floor(Math.random()*4)];tone(f,.18,.035);tone(f*1.25,.22,.025,.25);nextHorn=clock+4+Math.random()*5;}}
 return{unlock,helper,say,impact,update,get duration(){return Number.isFinite(voice.duration)?voice.duration:0},setPaused,setEnabled,resetDialogue,horn(){tone(185,.35,.14);tone(233,.32,.08,.04)},get enabled(){return enabled},stop(){setPaused(true);resetDialogue()}};
}
