const defaults={selectedHero:null,xp:0,soundEnabled:true,musicEnabled:true,recoveredCores:[],completedGames:[],loot:[],gameCompleted:false,riftMaster:false,statistics:{correct:0,mistakes:0,bestStreak:0}};
export function load(){try{return {...defaults,...JSON.parse(localStorage.getItem('lexaRift')||'{}')}}catch{return {...defaults}}}
export function save(s){localStorage.setItem('lexaRift',JSON.stringify(s))}
export function level(xp){return [0,150,350,600,900,1250,1650,2100,2600,3200].findLastIndex(n=>xp>=n)+1}
