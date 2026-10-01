/* ==========================================================================
   AAI-E-MC1-S03-FAC01 — Facilitator Kit · slide navigation
   Every slide fits one screen. Slides are grouped under the original 8
   sections; the jump select goes to a section's first slide.
   ========================================================================== */
var sectionLabels = ["Cover","Before you deliver","Run sheet","Demo script","Wrong-answer protocol","Answer bank","Contingencies","Closing"];
var slides = [];
var current = 0;

/* ================= RUN SHEET DATA ================= */
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
  {split:3, time:"4:30–5:00", title:"Closing, Rulebook check, questions", exact:"\"Before you leave, your Rulebook page for this section needs to be complete, not just started.\"",
   guidance:"Check each learner's Rulebook page and Practice Bot mastery status. Use the Answer Bank for last questions.",
   action:"Learners finalise and screenshot or print their Rulebook page.",
   evidence:"Completed Rulebook page, Practice Bot mastery, Lab logs.",
   recovery:"If a learner is not yet at mastery, note it and schedule a short follow-up rather than passing them through."}
];

/* ================= ANSWER BANK DATA ================= */
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

var ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

function pageHead(icon, kicker, title){
  return '<div class="page-head"><span class="phicon">'+icon+'</span>'+
    '<div class="phtext"><p class="kicker saa-eyebrow">'+kicker+'</p><h2>'+title+'</h2></div></div>';
}

/* minutes from "h:mm" */
function mins(t){ var p = t.split(':'); return parseInt(p[0],10)*60 + parseInt(p[1],10); }

/* proportional 5-hour strip; `on` = index in runBlocks to highlight (or -1) */
function runStrip(on){
  var html = '<div class="run-strip" aria-hidden="true">';
  var n = 0;
  runBlocks.forEach(function(b, i){
    var t = b.time.split('–');
    var w = mins(t[1]) - mins(t[0]);
    if(!b.isBreak) n++;
    html += '<span class="seg'+(b.isBreak?' brk':'')+(i===on?' on':'')+'" style="flex-grow:'+w+'">'+(b.isBreak?'':n)+'</span>';
  });
  html += '</div><div class="run-ticks" aria-hidden="true"><span>0:00</span><span>1:00</span><span>2:00</span><span>3:00</span><span>4:00</span><span>5:00</span></div>';
  return '<div class="run-map">'+html+'</div>';
}

/* ================= BUILD GENERATED SLIDES ================= */
function buildRunSheet(){
  var ov = document.getElementById('runOverview');
  var n = 0;
  runBlocks.forEach(function(b){
    var li = document.createElement('li');
    if(b.isBreak){ li.className = 'is-break'; li.innerHTML = '<span class="ot">'+b.time+'</span><span>Break</span>'; }
    else { n++; li.innerHTML = '<span class="ot">'+b.time+'</span><span><b>'+n+'.</b> '+b.title+'</span>'; }
    ov.appendChild(li);
  });
  ov.insertAdjacentHTML('beforebegin', runStrip(-1));

  var slot = document.getElementById('runSlot');
  var total = runBlocks.filter(function(b){ return !b.isBreak; }).length;
  n = 0;
  runBlocks.forEach(function(b, i){
    if(b.isBreak) return;
    n++;
    var nextB = runBlocks[i+1];
    var rows = [];
    if(b.exact) rows.push('<div class="trow"><span class="tlabel">Say exactly</span><span class="tval"><div class="exact-line">'+b.exact+'</div></span></div>');
    rows.push('<div class="trow"><span class="tlabel">Guidance</span><span class="tval">'+b.guidance+'</span></div>');
    rows.push('<div class="trow"><span class="tlabel">Learner action</span><span class="tval">'+b.action+'</span></div>');
    rows.push('<div class="trow"><span class="tlabel">Evidence</span><span class="tval">'+b.evidence+'</span></div>');
    rows.push('<div class="trow"><span class="tlabel">Recovery</span><span class="tval">'+b.recovery+'</span></div>');
    /* a block too long for one phone screen is split across two slides */
    var parts = b.split ? [rows.slice(0, b.split), rows.slice(b.split)] : [rows];
    parts.forEach(function(part, p){
      var last = p === parts.length - 1;
      var brk = (last && nextB && nextB.isBreak) ? '<div class="break-block">Then: '+nextB.time+' — Break</div>' : '';
      var kicker = 'Run sheet · Block '+n+' of '+total + (p > 0 ? ' · continued' : '');
      var s = document.createElement('section');
      s.className = 'slide';
      s.setAttribute('data-section','2');
      s.setAttribute('aria-label', b.title + (p > 0 ? ' (continued)' : ''));
      s.innerHTML = '<div class="card">'+
        pageHead(ICON_CLOCK, kicker, b.title)+
        '<div class="tmeta"><span class="ttime">'+b.time+'</span>'+runStrip(i)+'</div>'+
        '<div class="tbody-inner">'+part.join('')+'</div>'+brk+'</div>';
      slot.parentNode.insertBefore(s, slot);
    });
  });
}

function buildAnswerBank(){
  var slot = document.getElementById('qaSlot');
  var clusters = [];
  qaData.forEach(function(item){ if(clusters.indexOf(item.cluster) < 0) clusters.push(item.cluster); });
  qaData.forEach(function(item, i){
    var opts = clusters.map(function(c){
      return '<option value="'+c+'"'+(c===item.cluster?' selected':'')+'>'+c+'</option>';
    }).join('');
    var s = document.createElement('section');
    s.className = 'slide qa-slide';
    s.setAttribute('data-section','5');
    s.setAttribute('data-cluster', item.cluster);
    s.setAttribute('aria-label', item.q);
    s.innerHTML = '<div class="card">'+
      pageHead(ICON_CHAT, 'Answer bank · '+(i+1)+' of '+qaData.length, 'Common learner questions')+
      '<div class="cluster-row"><label for="cluster'+i+'">Jump to cluster:</label>'+
      '<select class="cluster-select" id="cluster'+i+'">'+opts+'</select></div>'+
      '<div class="qa-item open"><div class="qa-head"><span class="qtext">'+item.q+'</span>'+
        (item.policy ? '<span class="policy-flag">Needs policy confirmation</span>' : '')+'</div>'+
      '<div class="qa-body"><div class="qa-body-inner">'+
        '<div class="ans-row"><span class="albl">Direct</span><span class="aval">'+item.direct+'</span></div>'+
        '<div class="ans-row"><span class="albl">Reason</span><span class="aval">'+item.reason+'</span></div>'+
        '<div class="ans-row"><span class="albl">Next action</span><span class="aval">'+item.next+'</span></div>'+
      '</div></div></div></div>';
    slot.parentNode.insertBefore(s, slot);
    var sel = s.querySelector('select');
    sel.addEventListener('change', function(){
      var c = sel.value;
      sel.value = item.cluster; /* each slide's own select keeps showing its own cluster */
      for(var k = 0; k < slides.length; k++){
        if(slides[k].getAttribute('data-cluster') === c){ go(k); break; }
      }
    });
  });
}

/* ================= NAVIGATION ================= */
function firstSlideOf(sec){
  for(var k = 0; k < slides.length; k++){ if(+slides[k].getAttribute('data-section') === sec) return k; }
  return 0;
}

function buildJump(){
  var sel = document.getElementById('jumpSelect');
  sel.innerHTML = '';
  sectionLabels.forEach(function(label, i){
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = (i+1) + '. ' + label;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', function(){ go(firstSlideOf(parseInt(sel.value,10))); });
}

function render(){
  slides.forEach(function(s, k){ s.classList.toggle('active', k === current); });
  var sec = +slides[current].getAttribute('data-section');
  var total = slides.length;
  document.getElementById('jumpSelect').value = sec;
  document.getElementById('pageCount').textContent = (current+1) + ' / ' + total;
  document.getElementById('sectionName').textContent = sectionLabels[sec];
  document.getElementById('fill').style.width = ((current+1) / total * 100) + '%';
  document.getElementById('backBtn').disabled = (current === 0);
  document.getElementById('nextBtn').disabled = (current === total-1);
}

function go(n){
  if(n < 0 || n > slides.length-1) return;
  current = n;
  render();
}
function changePage(delta){ go(current + delta); }

/* self-check tally spans both self-check slides */
function updateCheck(){
  var boxes = document.querySelectorAll('.check-item input');
  var checked = 0;
  boxes.forEach(function(b){ if(b.checked) checked++; });
  document.querySelectorAll('.check-progress').forEach(function(p){
    p.textContent = checked + ' of ' + boxes.length + ' complete';
    p.classList.toggle('done', checked === boxes.length);
  });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', function(){
  buildRunSheet();
  buildAnswerBank();
  slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  buildJump();
  document.querySelectorAll('.check-item input').forEach(function(b){ b.addEventListener('change', updateCheck); });
  updateCheck();
  document.getElementById('backBtn').addEventListener('click', function(){ changePage(-1); });
  document.getElementById('nextBtn').addEventListener('click', function(){ changePage(1); });
  document.addEventListener('keydown', function(e){
    var t = e.target.tagName;
    if(t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return;
    if(e.key === 'ArrowRight') changePage(1);
    if(e.key === 'ArrowLeft') changePage(-1);
  });
  render();
});
