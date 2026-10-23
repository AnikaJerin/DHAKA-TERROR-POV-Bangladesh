import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomUUID,randomBytes} from 'node:crypto';
import {networkInterfaces} from 'node:os';
import path from 'node:path';
const root=path.resolve('dist'),players=new Map(),lan=process.argv.includes('--lan');
function reply(res,status,value){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(value))}
async function body(req){let data='';for await(const chunk of req){data+=chunk;if(data.length>4096)throw Error('Request too large')}return JSON.parse(data||'{}')}
function prune(){for(const[id,p]of players)if(Date.now()-p.lastSeen>12000)players.delete(id)}
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');prune();if(url.pathname.startsWith('/api/players/')){
 if(req.method!=='POST'){reply(res,405,{error:'POST required'});return}
 const origin=req.headers.origin;if(origin&&new URL(origin).host!==req.headers.host){reply(res,403,{error:'Same-origin requests only'});return}
 const input=await body(req);
 if(url.pathname==='/api/players/join'){if(players.size>=16){reply(res,503,{error:'City full (16 players)'});return}if(!['bus','cng'].includes(input.characterId)){reply(res,400,{error:'Unsupported character'});return}const id=randomUUID(),token=randomBytes(24).toString('hex');players.set(id,{id,token,characterId:input.characterId,x:0,z:0,yaw:0,speed:0,ready:false,lastSeen:Date.now()});reply(res,200,{id,token,mapVersion:1});return}
 const p=players.get(input.id);if(!p||input.token!==p.token){reply(res,401,{error:'Session expired'});return}
 if(url.pathname==='/api/players/leave'){players.delete(p.id);reply(res,200,{ok:true});return}
 if(url.pathname!=='/api/players/sync'){reply(res,404,{error:'Unknown endpoint'});return}
 if(![input.x,input.z,input.yaw,input.speed].every(Number.isFinite)||Math.abs(input.x)>2000||Math.abs(input.z)>2500||input.speed< -4.1||input.speed>31){reply(res,400,{error:'Invalid pose'});return}
 Object.assign(p,{x:input.x,z:input.z,yaw:input.yaw,speed:input.speed,ready:true,lastSeen:Date.now()});reply(res,200,{players:[...players.values()].filter(v=>v.ready&&v.id!==p.id).map(({token,lastSeen,ready,...publicPose})=>publicPose),count:players.size});return
 }
 const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}const data=await readFile(file);res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',({html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',svg:'image/svg+xml',png:'image/png',jpg:'image/jpeg',mp3:'audio/mpeg'})[file.split('.').pop()]||'application/octet-stream');res.end(data)
 }catch{if(!res.headersSent)reply(res,400,{error:'Request or file unavailable'})}});
server.listen(5173,lan?'0.0.0.0':'127.0.0.1',()=>{console.log('Local: http://127.0.0.1:5173');if(lan)for(const entries of Object.values(networkInterfaces()))for(const ip of entries||[])if(ip.family==='IPv4'&&!ip.internal)console.log('Other devices on the same Wi-Fi: http://'+ip.address+':5173')});
