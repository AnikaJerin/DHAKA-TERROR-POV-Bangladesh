import {createBangladeshStallFactory} from '../../bangladesh-stall.js';
import {CharacterCampaign} from '../../shared/character-campaign.js';

const shopMissions=[
 {id:'shop-01',title:['Stop After Stop','স্টপ-পর-স্টপ'],desc:['Establish stall in appropriate designated location.','উপযুক্ত নির্দিষ্ট লোকেশনে স্টল স্থাপন করুন।'],objective:'setup',location:'designated',startPlaceId:'mirpur12'},
 {id:'shop-02',title:['One More Passenger','আরও একজন গ্রাহক'],desc:['Manage customer capacity and safe queueing.','গ্রাহক ধারনক্ষমতা ও নিরাপদ সারি বজায় রাখুন।'],objective:'queue',maxCustomers:5,safeQueue:true},
 {id:'shop-03',title:['Pay the Fare','টাকা আদান-প্রদান'],desc:['Handle customer payments and correct change.','গ্রাহকদের টাকা নিন এবং সঠিক বাকি দিন।'],objective:'payment',giveChange:true},
 {id:'shop-04',title:['Half Fare','আধা দাম'],desc:['Apply fair discount or concession.','ন্যায্য ছাড় বা রিয়ায়ত দিন।'],objective:'discount',fairDiscount:true},
 {id:'shop-05',title:['Crowded Doorway','ভিড়ে দরজা'],desc:['Keep entrance, exit, walking paths clear.','প্রবেশ, নির্গমন ও হাঁটার পথ খালি রাখুন।'],objective:'clearance',pathsClear:true},
 {id:'shop-06',title:['The 8 A.M. Rush','সকাল ৮-র ঝাঁক'],desc:['Manage morning customer rush.','সকালের গ্রাহক ঝাঁক নিয়ন্ত্রণ করুন।'],objective:'rush',morningRush:true},
 {id:'shop-05b',title:['School Dismissal Bell','স্কুলের ছুটির ঘণ্টা'],desc:['Keep children and crossing areas safe.','শিশুদের ও পারাপারের এলাকা নিরাপদ রাখুন।'],objective:'school',protectChildren:true},
 {id:'shop-07',title:['Office-Hour Traffic Jam','অফিস-আওয়ার জ্যাম'],desc:['Manage customer surge without blocking movement.','গ্রাহক বाढ़ নিয়ন্ত্রণ করুন, চলাচল বাধা দেবেন না।'],objective:'surge',manageCrowd:true},
 {id:'shop-08',title:['Sudden Rain','হঠাৎ বৃষ্টি'],desc:['Protect merchandise, manage stall in rain.','বৃষ্টিতে পণ্য রক্ষা করুন, স্টল संभালুন।'],objective:'rain',protectGoods:true,weather:'rain'},
 {id:'shop-08b',title:['Broken Traffic Signal','ভাঙা ট্রাফিক সিগন্যাল'],desc:['Respond to changing pedestrian flow.','পথচারীদের প্রবাহ পরিবর্তন অনুযায়ী প্রতিক্রিয়া দিন।'],objective:'flow',adaptFlow:true},
 {id:'shop-09',title:['Phone Distraction','ফোনের ব্যস্ততা'],desc:['Avoid mistakes from distraction.','ব্যস্ততায় ভুল করা থেকে বিরত থাকুন।'],objective:'focus',noDistraction:true},
 {id:'shop-10',title:['A Newly Cut Road','নতুন কাটা রাস্তা'],desc:['Reorganize stall around construction.','নির্মাণ কাজের চারপাশে স্টল পুনর্গঠন করুন।'],objective:'reorg',reorganize:true},
 {id:'shop-11',title:['Broken Road','ভাঙা রাস্তা'],desc:['Keep merchandise/customers away from damage.','পণ্য ও গ্রাহককে রাস্তার ক্ষতিগ্রস্ত অংশ থেকে দূরে রাখুন।'],objective:'safety',avoidDamage:true},
 {id:'shop-12',title:['Market Day','বাজার দিন'],desc:['Manage customers, merchandise, nearby vendors.','গ্রাহক, পণ্য ও পাশের বিক্রেতাদের নিয়ন্ত্রণ করুন।'],objective:'market',coordinateVendors:true},
 {id:'shop-12b',title:['Religious Festival Crowd','ধার্মিক উৎসবের ভিড়'],desc:['Handle demand while preserving pedestrian access.','চাহিদা পুরন করুন, পথচারীদের পথ খোলা রাখুন।'],objective:'festival',preserveAccess:true},
 {id:'shop-13',title:['Wrong Parking','ভুল পার্কিং'],desc:['Respond to vehicle blocking stall access.','স্টল প্রবেশ বাধা দেন যানবাহন হটান।'],objective:'parking',clearAccess:true},
 {id:'shop-13b',title:['A Visitor Needs Help','দর্শককে সাহায্য'],desc:['Help visitor find item or give directions.','দর্শককে পণ্য খুঁজে দিন বা দিকনির্দেশনা দিন।'],objective:'assist',helpVisitor:true},
 {id:'shop-14',title:['Eid Crowd','ঈদের ভিড়'],desc:['Manage high demand, queues, stock.','উচ্চ চাহিদা, সারি ও স্টক নিয়ন্ত্রণ করুন।'],objective:'eid',manageStock:true},
 {id:'shop-15',title:['Last Trip at Night','রাতে শেষ ট্রিপ'],desc:['Organize stall safely in low light, prepare closing.','কম আলোতে নিরাপদে স্টল সাজান, বন্ধ করার প্রস্তুতি নিন।'],objective:'closing',safeClose:true,night:true},
 {id:'shop-15b',title:['Footpath Versus Road','ফুটপাথ বনাম রাস্তা'],desc:['Fit stall within area, preserve pedestrian path.','স্টল নির্দিষ্ট এলাকায় রাখুন, হাঁটার পথ খালি রাখুন।'],objective:'space',fitSpace:true,clearPath:true},
 {id:'shop-16',title:['Just One Minute','সिर्फ এক মিনিট'],desc:['Resist placing extra item obstructing pedestrians.','পথচারীদের বাধা দিয়ে অতিরিক্ত পণ্য রাখবেন না।'],objective:'restraint',noObstruction:true},
 {id:'shop-16b',title:['The VIP\'s Car','ভিআইপির গাড়ি'],desc:['Handle fairness/space dispute consistently.','ন্যায় ও জায়গা বিতরণে সামঞ্জস্যতা রক্ষা করুন।'],objective:'fairness',consistentFairness:true},
 {id:'shop-17',title:['Brother, Move a Little','ভাই, একটু সরো'],desc:['Coordinate space with neighbors and pedestrians.','পাশের বিক্রেতা ও পথচারীদের সাথে জায়গা সমন্বয় করুন।'],objective:'coordinate',shareSpace:true},
 {id:'shop-17b',title:['Mega-Jam Combo','মেগা-জ্যাম কোম্বো'],desc:['Manage multiple customer, merchandise, flow problems.','একসাথে গ্রাহক, পণ্য ও প্রবাহ সমস্যা সমাধান করুন।'],objective:'combo',multiManage:true},
 {id:'shop-18',title:['Dhaka Finale','ঢাকা ফাইনাল'],desc:['Complete multi-step shop management challenge.','বহু-ধাপের দোকান ব্যবস্থাপনা চ্যালেঞ্জ সম্পন্ন করুন।'],objective:'finale',multiStep:true},
];

export class ShopCampaign{
 constructor(){this.missions=shopMissions;}
 async start(options={}){
  const {CharacterCampaign}=await import('../../shared/character-campaign.js');
  const {createBangladeshStallFactory}=await import('../../bangladesh-stall.js');
  const campaign=new CharacterCampaign({
   characterId:'shop',
    vehicleFactory:createBangladeshStallFactory,
    vehicleVariant:options.vehicleVariant||0,
   missions:shopMissions,
   onExit:options.onExit
  });
  return campaign.start(options);
 }
}

export function start(options={}){
  const campaign=new ShopCampaign();
  return campaign.start(options);
}
export const characterId='shop';