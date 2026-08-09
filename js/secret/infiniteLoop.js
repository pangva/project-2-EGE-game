const sentences=[
  {verb:'REMEMBER',context:'TOPKRENDEL clearly recalls the moment when he activated the first energy bridge.',answer:['TOPKRENDEL','REMEMBERS','ACTIVATING','THE FIRST BRIDGE'],blocks:['TOPKRENDEL','REMEMBERS','TO ACTIVATE','ACTIVATING','THE FIRST BRIDGE','ACTIVATE']},
  {verb:'FORGET',context:'PANGVA had a duty to lock the robot hangar, but she did not do it.',answer:['PANGVA','FORGOT','TO LOCK','THE HANGAR'],blocks:['PANGVA','FORGOT','LOCKING','TO LOCK','THE HANGAR','LOCK']},
  {verb:'TRY',context:'The main controls were frozen, so LEXA tested restarting the bridge network as a possible solution.',answer:['LEXA','TRIED','RESTARTING','THE NETWORK'],blocks:['LEXA','TRIED','TO RESTART','RESTARTING','THE NETWORK','RESTART']},
  {verb:'STOP',context:'The hunter interrupted the repair work in order to rescue residents from an isolated tower.',answer:['THE HUNTER','STOPPED','TO RESCUE','THE RESIDENTS'],blocks:['THE HUNTER','STOPPED','RESCUING','TO RESCUE','THE RESIDENTS','RESCUE']},
  {verb:'REGRET',context:'The engineer is sorry that he reported the bridge failure before checking the evidence.',answer:['THE ENGINEER','REGRETS','REPORTING','THE FAILURE'],blocks:['THE ENGINEER','REGRETS','TO REPORT','REPORTING','THE FAILURE','REPORT']},
  {verb:'MEAN',context:'Restoring the final bridge will involve entering the robots’ heavily guarded command tower.',answer:['THE MISSION','MEANS','ENTERING','THE COMMAND TOWER'],blocks:['THE MISSION','MEANS','TO ENTER','ENTERING','THE COMMAND TOWER','ENTER']},
  {verb:'GO ON',context:'After reconnecting the residential towers, the team moved to a different task: repairing the central gate.',answer:['THE TEAM','WENT ON','TO REPAIR','THE CENTRAL GATE'],blocks:['THE TEAM','WENT ON','REPAIRING','TO REPAIR','THE CENTRAL GATE','REPAIR']},
  {verb:'LIKE',context:'The residents consider a daily bridge inspection a sensible routine, whether it is enjoyable or not.',answer:['THE RESIDENTS','LIKE','TO CHECK','THE BRIDGES DAILY'],blocks:['THE RESIDENTS','LIKE','CHECKING','TO CHECK','THE BRIDGES DAILY','CHECK']}
];

const locations=[
  {scene:'staircase',title:'REBUILD THE ASCENT'},
  {scene:'rubble',title:'CROSS THE RUBBLE CHAMBER'},
  {scene:'doors',title:'ESCAPE THE FALSE DOORS'},
  {scene:'doors',title:'RESTORE THE FINAL BRIDGES'}
];

export class InfiniteLoopMission{
  constructor(root,{onComplete,onExit}){
    this.root=root;this.onComplete=onComplete;this.onExit=onExit;
    this.work=root.querySelector('#loopWorkarea');this.title=root.querySelector('#loopTitle');
    this.trial=root.querySelector('#loopTrial');this.context=root.querySelector('#loopContext');
    this.feedback=root.querySelector('#loopFeedback');this.stage=root.querySelector('.loop-stage-label');
    this.rings=[...root.querySelectorAll('.loop-rings i')];this.timers=[];
    document.addEventListener('keydown',e=>{if(e.code!=='KeyE'||!this.root.classList.contains('active'))return;const target=this.root.querySelector('.sentence-block:hover')||(document.activeElement?.closest?.('#infiniteLoop')?document.activeElement:null);target?.click()})
  }
  later(fn,delay){const timer=setTimeout(fn,delay);this.timers.push(timer);return timer}
  clear(){this.timers.forEach(clearTimeout);this.timers=[];clearInterval(this.battleTimer);this.work.innerHTML='';this.root.className='screen'}
  play(){this.clear();this.root.classList.add('active','loop-briefing');this.root.querySelector('.loop-exit').textContent='ABORT SECRET RIFT';this.rings.forEach(r=>r.className='');this.trial.textContent='LEXA // CLASSIFIED DISTRESS SIGNAL';this.title.textContent='THE BROKEN BRIDGE SECTOR';this.context.textContent='Rogue construction robots have severed every bridge between the residential towers. Rebuild eight sentence paths to reconnect the district before the Infinite Loop erases it.';this.stage.textContent='SECRET LEVEL // MISSION BRIEFING';this.feedback.textContent='FORM WORDS CREATE PHYSICAL PATHS IN THIS FORGOTTEN SECTOR.';this.work.innerHTML='<div class="loop-briefing-story"><small>LEXA // ARCHIVE RECOVERED</small><p>Before the Syntax Collapse, this hidden district tested bridges made from FORM energy. A corrupted command turned its repair robots against the city. Families are trapped in isolated towers above the rift.</p><b>YOUR MISSION: RESTORE ALL 8 BRIDGES.</b><button>BEGIN RESTORATION</button></div>';this.work.querySelector('button').onclick=()=>this.startSentence(0)}
  scene(name){this.root.className=`screen active loop-${name}`;this.work.innerHTML='';this.feedback.className='loop-feedback'}
  shuffle(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
  sentencePuzzle(data,onComplete,dragMode=false){
    let selected=[];this.work.innerHTML='<div class="sentence-slots"></div><div class="sentence-blocks"></div>';
    const slots=this.work.querySelector('.sentence-slots'),bank=this.work.querySelector('.sentence-blocks');
    slots.innerHTML=data.answer.map((_,i)=>`<button class="sentence-slot" data-slot="${i}">[ ]</button>`).join('');
    const choose=value=>{const expected=data.answer[selected.length];if(value!==expected){this.feedback.textContent='MEANING MISMATCH DETECTED.';this.feedback.classList.add('error');this.work.classList.add('path-collapse');this.later(()=>{selected=[];slots.querySelectorAll('button').forEach(x=>{x.textContent='[ ]';x.className='sentence-slot'});bank.querySelectorAll('button').forEach(x=>x.disabled=false);this.work.classList.remove('path-collapse');this.feedback.classList.remove('error');this.feedback.textContent='THE LOOP HAS RETURNED YOU TO THE START.'},950);return}selected.push(value);const slot=slots.children[selected.length-1];slot.textContent=value;slot.classList.add('stable');[...bank.children].find(x=>x.dataset.value===value&&!x.disabled).disabled=true;if(selected.length===data.answer.length){this.feedback.textContent='SENTENCE PATH STABLE';this.feedback.classList.add('success');this.work.classList.add('path-stable');this.later(onComplete,1050)}};
    this.shuffle(data.blocks).forEach(value=>{const block=document.createElement('button');block.className=`sentence-block ${dragMode?'drag-block':'choice-block'}`;block.textContent=value;block.dataset.value=value;block.draggable=dragMode;if(dragMode)block.ondragstart=e=>e.dataTransfer.setData('text/plain',value);else block.onclick=()=>choose(value);bank.append(block)});if(dragMode){slots.ondragover=e=>e.preventDefault();slots.ondrop=e=>{e.preventDefault();choose(e.dataTransfer.getData('text/plain'))}}
  }
  startSentence(index){
    const zone=Math.floor(index/2),location=locations[zone],data=sentences[index];this.scene(location.scene);
    this.rings.forEach((ring,i)=>ring.classList.toggle('destroyed',i<zone));
    this.stage.textContent=`SENTENCE ${index+1} OF ${sentences.length} // SECTOR ${zone+1}`;
    const selection=index<4;this.root.classList.toggle('loop-drag-task',!selection);this.root.querySelector('.loop-exit').textContent='ABORT SECRET RIFT';this.trial.textContent=selection?'LEXA // SELECT WORDS IN THE CORRECT ORDER':'LEXA // DRAG THE WORDS INTO THE EMPTY SLOTS';this.title.textContent=location.title;this.context.textContent=data.context;
    this.feedback.textContent=selection?'CLICK THE WORD BLOCKS TO BUILD THE SENTENCE.':'DRAG EACH WORD BLOCK INTO THE NEXT EMPTY SLOT.';
    const complete=()=>{if((index+1)%2===0)this.rings[zone].classList.add('destroyed');this.later(()=>index+1<sentences.length?this.startSentence(index+1):this.onComplete?.(),1050)};
    this.sentencePuzzle(data,complete,!selection)
  }
  startBattle(){this.scene('battle');this.rings.forEach(r=>r.classList.add('destroyed'));this.stage.textContent='FINAL PHASE // 10.0 SECONDS';this.trial.textContent='ALL 8 SENTENCES RESTORED';this.title.textContent='THE LOOPKEEPER IS VULNERABLE';this.context.textContent='Fire repeatedly into the exposed FORM energy core.';this.feedback.textContent='DESTROY THE CORE TO CLAIM THE UNIQUE REWARD.';let hits=0,time=10,finished=false;this.work.innerHTML='<button class="loopkeeper-core"><i></i><b>FORM CORE</b><span>0 / 8</span></button><div class="battle-clock">10.0</div>';const core=this.work.querySelector('.loopkeeper-core'),clock=this.work.querySelector('.battle-clock');core.onclick=()=>{if(finished)return;hits++;core.querySelector('span').textContent=`${hits} / 8`;core.classList.remove('hit');void core.offsetWidth;core.classList.add('hit');if(hits>=8){finished=true;core.disabled=true;clearInterval(this.battleTimer);this.feedback.textContent='LOOPKEEPER DESTROYED // REWARD SIGNAL ACQUIRED';this.root.classList.add('loopkeeper-defeated');this.later(()=>this.onComplete?.(),1200)}};this.battleTimer=setInterval(()=>{time-=.1;clock.textContent=Math.max(0,time).toFixed(1);if(time<=0&&!finished){this.feedback.textContent='CORE RECHARGED // FIRE AGAIN';time=10;hits=0;core.querySelector('span').textContent='0 / 8'}},100)}
  exit(){this.clear();this.onExit?.()}
}
