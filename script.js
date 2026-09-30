var TOTAL = 8;
var current = 0;
var pageLabels = ["Cover","Before you deliver","Run sheet","Demo script","Wrong-answer protocol","Answer bank","Contingencies","Closing"];

function buildJump(){
  var sel = document.getElementById('jumpSelect');
  sel.innerHTML = '';
  pageLabels.forEach(function(label, i){
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = (i+1) + '. ' + label;
    sel.appendChild(opt);
  });
}

function render(){
  document.querySelectorAll('.page').forEach(function(p){
    p.classList.toggle('active', parseInt(p.getAttribute('data-page')) === current);
  });
  document.getElementById('jumpSelect').value = current;
  document.getElementById('pageCount').textContent = (current+1) + ' / ' + TOTAL;
  document.getElementById('backBtn').disabled = (current === 0);
  document.getElementById('nextBtn').disabled = (current === TOTAL-1);
  window.scrollTo({top:0, behavior:'smooth'});
}

function changePage(delta){
  var next = current + delta;
  if(next < 0 || next > TOTAL-1) return;
  current = next;
  render();
}

function updateCheck(){
  var boxes = document.querySelectorAll('.check-item input');
  var checked = 0;
  boxes.forEach(function(b){ if(b.checked) checked++; });
  document.getElementById('checkProgress').textContent = checked + ' of ' + boxes.length + ' complete';
}

/* ================= RUN SHEET TIMELINE ================= */
var runBlocks = [
  {time:"0:00–0:15", title:"Opening and hook", exact:"\"Today isn't about whether AI is good or bad. It's about one habit: never send what you haven't checked.\"",
   guidance:"Introduce yourself and the session goal in your own words.",
   action:"Learners listen, no device needed yet.",
   evidence:"None required for this block.",
   recovery:"If the room is slow to settle, start the demo one minute early instead of waiting."},
  {time:"0:15–0:45", title:"Demo: controlled fabrication (Talk-Show)", exact:"See the full Demo Script page for exact lines.",
   guidance:"Run the industrial visit note demo. Keep this block talk-heavy but under 30 minutes.",
   action:"Learners watch and can ask questions, but do not yet correct anything themselves.",
   evidence:"None required for this block.",
   recovery:"If the projector fails, read the AI draft and the real register aloud instead."},
  {time:"0:45–1:15", title:"30-second marking routine (Do)", exact:"\"Your turn. Thirty seconds: mark every fact, figure, date, name and source. Go.\"",
   guidance:"Give learners their own fictional record. Time it visibly.",
   action:"Every learner marks their own copy.",
   evidence:"Marked copies, one per learner.",
   recovery:"If a learner has no record, pair them temporarily with a neighbour."},
  {time:"1:15–1:30", title:"Break", exact:"", guidance:"", action:"", evidence:"", recovery:"", isBreak:true},
  {time:"1:30–2:15", title:"Independent practice: mark and separate (Do)", exact:"",
   guidance:"Learners work through the Reading and Marking Card content at their own pace.",
   action:"Mark, then sort into supported / uncertain / unsupported.",
   evidence:"Completed marking and sorting sheet.",
   recovery:"Fast finishers move to the Practice Bot retry round; slow finishers get five extra minutes before the review."},
  {time:"2:15–2:45", title:"Review and peer check-in", exact:"",
   guidance:"Facilitate a short peer exchange using the Peer Exchange activity's rubric.",
   action:"Learners give and receive one strength, one risk, one suggested change.",
   evidence:"Peer rubric notes.",
   recovery:"If pairs are uneven, form one group of three and adjust timing slightly."},
  {time:"2:45–3:00", title:"Break", exact:"", guidance:"", action:"", evidence:"", recovery:"", isBreak:true},
  {time:"3:00–3:45", title:"Correct, qualify, remove practice (Do)", exact:"",
   guidance:"Learners complete the 'Correct It, Then Finish It' lab.",
   action:"Fix wrong statements, complete the missing ending, log the change made.",
   evidence:"Completed lab log.",
   recovery:"If time is short, prioritise completing the ending over all three corrections."},
  {time:"3:45–4:30", title:"Find the Planted Errors lab + live moment watch", exact:"",
   guidance:"Run the timed lab. Stay alert for any genuine wrong answer from a live tool during this block — see the Wrong-Answer Protocol page if one appears.",
   action:"Learners flag errors and state consequences under time pressure.",
   evidence:"Lab findings and consequence answers.",
   recovery:"If the timer causes visible stress, quietly extend it rather than stopping the activity."},
  {time:"4:30–5:00", title:"Closing, Rulebook check, questions", exact:"\"Before you leave, your Rulebook page for this section needs to be complete, not just started.\"",
   guidance:"Check each learner's Rulebook page and Practice Bot mastery status. Use the Answer Bank for last questions.",
   action:"Learners finalise and screenshot or print their Rulebook page.",
   evidence:"Completed Rulebook page, Practice Bot mastery, Lab logs.",
   recovery:"If a learner is not yet at mastery, note it and schedule a short follow-up rather than passing them through."}
];

function buildTimeline(){
  var wrap = document.getElementById('timelineWrap');
  wrap.innerHTML = '';
  runBlocks.forEach(function(b, i){
    if(b.isBreak){
      var brk = document.createElement('div');
      brk.className = 'break-block';
      brk.textContent = b.time + ' — Break';
      wrap.appendChild(brk);
      return;
    }
    var block = document.createElement('div');
    block.className = 'tblock';
    var exactHtml = b.exact ? '<div class="trow"><span class="tlabel">Say exactly</span><span class="tval"><div class="exact-line">'+b.exact+'</div></span></div>' : '';
    block.innerHTML =
      '<div class="thead" onclick="this.parentElement.classList.toggle(\'open\')">'+
        '<span class="ttime">'+b.time+'</span><span class="ttitle">'+b.title+'</span>'+
        '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'+
      '</div>'+
      '<div class="tbody"><div class="tbody-inner">'+
        exactHtml+
        '<div class="trow"><span class="tlabel">Guidance</span><span class="tval">'+b.guidance+'</span></div>'+
        '<div class="trow"><span class="tlabel">Learner action</span><span class="tval">'+b.action+'</span></div>'+
        '<div class="trow"><span class="tlabel">Evidence</span><span class="tval">'+b.evidence+'</span></div>'+
        '<div class="trow"><span class="tlabel">Recovery</span><span class="tval">'+b.recovery+'</span></div>'+
      '</div></div>';
    wrap.appendChild(block);
  });
}

/* ================= ANSWER BANK ================= */
var qaData = [
  {cluster:"Concept", q:"What actually counts as evidence?", policy:false,
   direct:"Something you can point to and check right now — a register, a notice, a portal.",
   reason:"An AI's confident tone is not evidence by itself.",
   next:"Ask the learner to name the exact record they'd check, not just say 'it sounds right.'"},
  {cluster:"Concept", q:"What if there's no source available to check?", policy:false,
   direct:"Qualify the claim as unconfirmed, or remove it if it isn't essential.",
   reason:"Guessing in either direction is worse than saying plainly that it's unconfirmed.",
   next:"Model the phrase: 'this could not be confirmed and was qualified/removed.'"},
  {cluster:"Access", q:"What if a learner's device won't open the AI tool?", policy:false,
   direct:"Pair them with a neighbour for this block; don't let them fall behind alone.",
   reason:"Access issues are common on shared or older devices.",
   next:"Log the device issue for the facility coordinator after the session."},
  {cluster:"Privacy", q:"Can we use a learner's real name in the demo?", policy:false,
   direct:"No. Every name, figure and record in a demo must be fictional.",
   reason:"This is a firm rule, not a judgement call.",
   next:"If a learner suggests using their own details, thank them and use a fictional name instead."},
  {cluster:"Privacy", q:"A learner wants to type their marks or ID into the AI tool. What do I say?", policy:true,
   direct:"Stop them and explain this is never allowed, in this course or afterward.",
   reason:"Marks, IDs, phone numbers and health details must never go into an AI tool.",
   next:"If this keeps happening, escalate to your programme coordinator — this needs a policy conversation, not just correction in the moment."},
  {cluster:"Accuracy", q:"The AI gave two different answers to the same question. Which is right?", policy:false,
   direct:"Neither is automatically right — check both against a real record.",
   reason:"AI tools can answer inconsistently across attempts.",
   next:"Use this as a live example of why marking and checking matters, if it happens in front of the class."},
  {cluster:"Language", q:"Can learners answer in Hindi or another language during discussion?", policy:true,
   direct:"For this English-language delivery, guide discussion in English, but don't penalise a learner for briefly code-switching.",
   reason:"The written activity and English delivery standard has to stay consistent for the section, but classroom discussion tone is a facilitator judgement.",
   next:"If this comes up often, raise it with your production owner rather than setting your own rule."},
  {cluster:"Assessment", q:"Does finding zero planted errors mean the learner fails the whole unit?", policy:false,
   direct:"No — it means that specific lab needs another attempt, not automatic failure of the unit.",
   reason:"The lab is non-compensatory, meaning it must be passed, but retries are expected and normal.",
   next:"Direct the learner back to the lab's retry path."},
  {cluster:"Assessment", q:"Can I mark someone complete if they attempted but didn't reach mastery?", policy:true,
   direct:"No. Element 4 requires mastery, not just attempt.",
   reason:"This is a non-compensatory gate — attempting isn't the same as clearing it.",
   next:"Schedule a short follow-up session for that learner rather than marking them complete."},
  {cluster:"Escalation", q:"What if I genuinely don't know the answer to a learner's question?", policy:false,
   direct:"Say plainly: 'I will verify this and confirm next session' — then actually do it.",
   reason:"A confident guess from you teaches the opposite of this course's whole point.",
   next:"Note the question so you remember to follow up."},
  {cluster:"Escalation", q:"A learner is upset that an AI tool gave a wrong answer that affected their work. What now?", policy:true,
   direct:"Acknowledge it seriously, and do not decide the resolution alone.",
   reason:"This may affect grading or fairness across the batch.",
   next:"Follow your programme's escalation path and inform your coordinator the same day."}
];

function renderQA(){
  var cluster = document.getElementById('clusterSelect').value;
  var list = document.getElementById('qaList');
  list.innerHTML = '';
  qaData.forEach(function(item, i){
    if(cluster !== 'all' && item.cluster !== cluster) return;
    var el = document.createElement('div');
    el.className = 'qa-item';
    el.innerHTML =
      '<div class="qa-head" onclick="this.parentElement.classList.toggle(\'open\')">'+
        '<span class="qtext">'+item.q+'</span>'+
        (item.policy ? '<span class="policy-flag">Needs policy confirmation</span>' : '')+
        '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'+
      '</div>'+
      '<div class="qa-body"><div class="qa-body-inner">'+
        '<div class="ans-row"><span class="albl">Direct</span><span class="aval">'+item.direct+'</span></div>'+
        '<div class="ans-row"><span class="albl">Reason</span><span class="aval">'+item.reason+'</span></div>'+
        '<div class="ans-row"><span class="albl">Next action</span><span class="aval">'+item.next+'</span></div>'+
      '</div></div>';
    list.appendChild(el);
  });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', function(){
  buildJump();
  buildTimeline();
  renderQA();
  render();
});