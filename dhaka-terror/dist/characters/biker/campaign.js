import {startBusMission} from '../../mission-network.js';

export const characterId='biker';
export const bikerMissions=[
 {id:'biker-01',title:['Stop After Stop','স্টপ-পর-স্টপ'],desc:['Stop at correct locations, respect traffic restrictions.','সঠিক স্থানেই থামুন, ট্রাফিক নিয়ম মানুন।'],objective:'stop',stops:3,startPlaceId:'mirpur12'},
 {id:'biker-02',title:['One More Passenger','আরও একজন যাত্রী'],desc:['Respect safe passenger capacity (pillion only).','নিরাপদ যাত্রী ধারনক্ষমতা (পিছনে একজন) মানুন।'],objective:'capacity',maxPassengers:1},
 {id:'biker-03',title:['Pay the Delivery','ডেলিভারি টাকা'],desc:['Handle delivery payment and change.','ডেলিভারি টাকা আদান-প্রদান ও বাকি টাকা দিন।'],objective:'payment',delivery:true},
 {id:'biker-04',title:['Half Fare','আধা ভাড়া'],desc:['Apply fair discount for return customer.','ফেরত গ্রাহককে ন্যায়সঙ্গত ছাড় দিন।'],objective:'discount',returnCustomer:true},
 {id:'biker-05',title:['Crowded Pickup','ভিড়ে পিকআপ'],desc:['Navigate crowded pickup zone without blocking.','ভিড়ে পিকআপ জোনে আটকে না যান।'],objective:'pickup',clearZone:true},
 {id:'biker-06',title:['The 8 A.M. Rush','সকাল ৮-র ঝাঁক'],desc:['Navigate morning traffic maintaining safe distance.','সকালের জ্যামে নিরাপদ দূরত্ব রেখে যান।'],objective:'rush',trafficDensity:'high',safeDistance:true},
 {id:'biker-05b',title:['School Dismissal Bell','স্কুলের ছুটির ঘণ্টা'],desc:['Slow down near schools, protect children.','স্কুলের কাছে গতি কমান, শিশুদের রক্ষা করুন।'],objective:'school',schoolZone:true,slowDown:true},
 {id:'biker-07',title:['Office-Hour Traffic Jam','অফিস-আওয়ার জ্যাম'],desc:['Use correct lane and obey signals at intersection.','চৌরস্তায় সঠিক লেন ও সিগন্যাল মানুন।'],objective:'intersection',laneDiscipline:true,obeySignals:true},
 {id:'biker-08',title:['Sudden Rain','হঠাৎ বৃষ্টি'],desc:['Reduce speed, adapt to wet roads.','বৃষ্টিতে গতি কমান, আর্দ্র রাস্তায় সতর্ক থাকুন।'],objective:'rain',weather:'rain',reduceSpeed:true},
 {id:'biker-08b',title:['Broken Traffic Signal','ভাঙা ট্রাফিক সিগন্যাল'],desc:['Follow traffic officer directions.','ট্রাফিক সার্জেন্টের নির্দেশনা মেনে চলুন।'],objective:'officer',followOfficer:true},
 {id:'biker-09',title:['Phone Distraction','ফোনের ব্যস্যতা'],desc:['Avoid phone use while riding.','চলার সময় ফোন ব্যবহার করবেন না।'],objective:'nophone',noPhone:true},
 {id:'biker-10',title:['A Newly Cut Road','নতুন কাটা রাস্তা'],desc:['Follow safe detour around construction.','নির্মাণ কাজ এড়িয়ে নিরাপদ বিকল্প পথ নিন।'],objective:'detour',construction:true},
 {id:'biker-11',title:['Broken Road','ভাঙা রাস্তা'],desc:['Avoid potholes, select safe path.','গড়া এড়িয়ে নিরাপদ পথ বেছে নিন।'],objective:'potholes',avoidPotholes:true},
 {id:'biker-12',title:['Market Day','বাজার দিন'],desc:['Navigate market traffic without endangering pedestrians.','বাজারের জ্যামে পথচারীদের খতরায় না ডালুন।'],objective:'market',protectPedestrians:true},
 {id:'biker-12b',title:['Religious Festival Crowd','ধার্মিক উৎসবের ভিড়'],desc:['Move patiently through congestion.','উৎসবের জ্যামে ধৈর্যের সাথে যান।'],objective:'festival',patientRiding:true},
 {id:'biker-13',title:['Wrong Parking','ভুল পার্কিং'],desc:['Navigate around obstruction without new hazard.','বাধা এড়িয়ে যান, নতুন খতরা সৃষ্টি করবেন না।'],objective:'parking',avoidHazard:true},
 {id:'biker-13b',title:['A Visitor Needs Help','দর্শককে সাহায্য'],desc:['Assist visitor or handle delivery task.','দর্শককে সাহায্য করুন বা ডেলিভারি সম্পন্ন করুন।'],objective:'assist',helpVisitor:true},
 {id:'biker-14',title:['Eid Crowd','ঈদের ভিড়'],desc:['Navigate holiday traffic responsibly.','ঈদের জ্যামে দায়িত্বপূর্ণভাবে পার করুন।'],objective:'eid',responsibleRiding:true},
 {id:'biker-15',title:['Last Trip at Night','রাতে শেষ ট্রিপ'],desc:['Use proper lights, maintain visibility.','সঠিক লাইট জ্বালিয়ে দৃশ্যমানতা বজায় রাখুন।'],objective:'night',useLights:true},
 {id:'biker-15b',title:['Footpath Versus Road','ফুটপাথ বনাম রাস্তা'],desc:['Keep motorcycle off pedestrian footpaths.','মোটরসাইকেল ফুটপাত থেকে বাদ রাখুন।'],objective:'footpath',offFootpath:true},
 {id:'biker-16',title:['Just One Minute','সির্ফ এক মিনিট'],desc:['Resist speeding through unsafe gaps.','নিরাপদ ফাঁকে দ্রুত গাড়ি চালাবেন না।'],objective:'patience',noSpeeding:true},
 {id:'biker-16b',title:['The VIP\'s Car','ভিআইপির গাড়ি'],desc:['Follow same rules regardless of other vehicles.','অন্য গাড়ির ধরণের কর্তব্য একই রকম মেনে চলুন।'],objective:'fairness',equalRules:true},
 {id:'biker-17',title:['Brother, Move a Little','ভাই, একটু সরো'],desc:['Share road, maintain appropriate clearance.','রাস্তা সাঝা করুন, নিরাপদ দূরত্ব রাখুন।'],objective:'sharing',clearance:true},
 {id:'biker-17b',title:['Mega-Jam Combo','মেগা-জ্যাম কোম্বো'],desc:['Combine signals, obstacles, pedestrians, traffic.','সিগন্যাল, বাধা, পথচারী, ট্রাফিক একসাথে মোকাবিলা করুন।'],objective:'combo',multiChallenge:true},
 {id:'biker-18',title:['Dhaka Finale','ঢাকা ফাইনাল'],desc:['Complete challenging multi-step riding scenario.','চ্যালেঞ্জিং বহু-ধাপের রাইডিং পরিস্থিতি সম্পন্ন করুন।'],objective:'finale',multiStep:true},
];

// Basic shared-city driving. Biker-specific missions belong in this directory.
export function start(options={}){return startBusMission({...options,characterId})}
