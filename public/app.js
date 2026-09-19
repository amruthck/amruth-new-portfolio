let xp=0;const visited=new Set();const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];

function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),1800)}
function updateXP(){const lvl=Math.min(7,Math.floor(xp/100)+1);$("#level").textContent=lvl;$("#xpBar").style.width=Math.min(100,xp%100)+"%";$("#xpText").textContent=`${xp} / 700`}

async function unlock(target,reward){
  if(visited.has(target)) return;
  visited.add(target);xp=Math.min(700,xp+reward);updateXP();toast(`LEVEL UNLOCKED • +${reward} XP`);
  try{await fetch("/api/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({level:target,xp:reward})})}catch(e){}
}

function go(target){document.getElementById(target)?.scrollIntoView({behavior:"smooth"})}

$$("[data-target]").forEach(b=>b.addEventListener("click",async()=>{
  const target=b.dataset.target;
  await unlock(target,Number(b.dataset.xp||0));
  go(target);
}));

async function loadProjects(){
  const grid=$("#projectsGrid");
  try{
    const r=await fetch("/api/projects");const projects=await r.json();
    grid.innerHTML=projects.map((p,i)=>`
      <article class="card project ${i===0?"featured":""}">
        <span class="tag">${p.tag}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tech">${p.tech.join(" • ")}</div>
        ${p.url?`<a class="ghost-link" href="${p.url}" target="_blank" rel="noreferrer">VIEW PROJECT ↗</a>`:""}
      </article>`).join("");
  }catch(e){grid.innerHTML="<div class='card'><h3>Project Vault Offline</h3><p>Start the backend to load projects.</p></div>"}
}

async function loadVisitors(){
  try{const r=await fetch("/api/stats");const d=await r.json();$("#visitors").textContent=d.visitors}catch(e){}
}

$("#contactForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const payload={name:$("#name").value,email:$("#email").value,message:$("#message").value};
  try{
    const r=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const d=await r.json();
    if(!r.ok) throw new Error(d.error);
    e.target.reset();toast("MESSAGE RECEIVED • +50 XP");xp=Math.min(700,xp+50);updateXP();
  }catch(err){toast("MESSAGE FAILED — CHECK SERVER")}
});

const sections=$$("section[id]");const navs=$$(".nav");
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)navs.forEach(n=>n.classList.toggle("active",n.dataset.target===e.target.id))}),{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>obs.observe(s));
updateXP();loadProjects();loadVisitors();
