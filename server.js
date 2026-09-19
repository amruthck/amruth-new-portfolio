const express=require("express");
const path=require("path");
const fs=require("fs");

const app=express();
const PORT=process.env.PORT||3000;
const DATA_DIR=path.join(__dirname,"data");
const DATA_FILE=path.join(DATA_DIR,"data.json");

if(!fs.existsSync(DATA_DIR))fs.mkdirSync(DATA_DIR,{recursive:true});
if(!fs.existsSync(DATA_FILE))fs.writeFileSync(DATA_FILE,JSON.stringify({
  visitors:0,progress:[],messages:[],
  projects:[
    {title:"AI / Full-Stack Project",tag:"FLAGSHIP",description:"Replace this card with your strongest project. Explain the problem, what you built and the measurable result.",tech:["React","Node.js","MongoDB"],url:""},
    {title:"Cloud / DevOps Project",tag:"CLOUD",description:"A project demonstrating deployment, containers, CI/CD or infrastructure automation.",tech:["AWS","Docker","Jenkins"],url:""},
    {title:"Generative AI Project",tag:"AI",description:"An AI-powered application showing practical use of LLMs, RAG or automation.",tech:["Python","LLM","RAG"],url:""},
    {title:"Problem-Solving Project",tag:"BUILD",description:"A project that demonstrates algorithms, backend engineering or product thinking.",tech:["Java","DSA","REST API"],url:""}
  ]
},null,2));

app.use(express.json({limit:"100kb"}));
app.use(express.static(path.join(__dirname,"public")));

function read(){return JSON.parse(fs.readFileSync(DATA_FILE,"utf8"))}
function write(d){fs.writeFileSync(DATA_FILE,JSON.stringify(d,null,2))}

app.get("/api/projects",(req,res)=>res.json(read().projects));

app.get("/api/stats",(req,res)=>{
  const d=read();d.visitors++;write(d);
  res.json({visitors:d.visitors});
});

app.post("/api/progress",(req,res)=>{
  const {level,xp}=req.body||{};
  if(!level||typeof xp!=="number")return res.status(400).json({error:"Invalid progress"});
  const d=read();d.progress.push({level,xp,at:new Date().toISOString()});write(d);
  res.json({ok:true});
});

app.post("/api/contact",(req,res)=>{
  const {name,email,message}=req.body||{};
  if(!name||!email||!message)return res.status(400).json({error:"All fields are required"});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:"Invalid email"});
  const d=read();d.messages.push({name,email,message,at:new Date().toISOString()});write(d);
  res.json({ok:true});
});

app.get("/api/admin/messages",(req,res)=>{
  // Add authentication before deploying this endpoint publicly.
  res.json(read().messages);
});

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT,()=>console.log(`Interactive resume running at http://localhost:${PORT}`));
