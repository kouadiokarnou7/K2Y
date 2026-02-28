import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import * as THREE from "three";
import {
  User, Mail, Lock, Eye, EyeOff, ChevronRight,
  Globe, Users, Sparkles, MapPin, BookOpen, Camera,
  Plane, CheckCircle2, ArrowLeft, Shield
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";

const ETHNIES = [
  { value:"akan",        label:"Akan (Baoulé, Agni, Abron…)" },
  { value:"krou",        label:"Krou (Bété, Guéré, Wobé…)" },
  { value:"mande-nord",  label:"Mandé du Nord (Dioula, Malinké…)" },
  { value:"mande-sud",   label:"Mandé du Sud (Gouro, Dan…)" },
  { value:"gur",         label:"Gur / Voltaïque (Sénoufo, Lobi…)" },
  { value:"lagounaires", label:"Lagounaires (Avikam, Alladian…)" },
  { value:"autre",       label:"Autre / Mixte" },
];

const PROFILS = [
  { id:"jeune",     label:"Jeune 18–30 ans",          icon:Sparkles, color:"#F59E0B" },
  { id:"touriste",  label:"Touriste / Voyageur·se",    icon:Plane,    color:"#10B981" },
  { id:"passionne", label:"Passionné·e de culture",   icon:Globe,    color:"#8B5CF6" },
  { id:"chercheur", label:"Chercheur·se / Académique", icon:BookOpen, color:"#3B82F6" },
  { id:"artiste",   label:"Artiste / Créateur·rice",  icon:Camera,   color:"#EC4899" },
  { id:"diaspora",  label:"Diaspora africaine",        icon:MapPin,   color:"#C8973A" },
];

const REGIONS = [
  { name:"Savanes",           color:0xE91E8C, pts:[[-6.5,10.7],[-5.2,10.7],[-4.5,10.2],[-4.8,9.4],[-5.5,9.2],[-6.8,9.5],[-7.2,10.1]] },
  { name:"Zanzan",            color:0xF57C00, pts:[[-4.5,10.2],[-3.2,10.5],[-2.6,9.8],[-3.0,8.8],[-4.0,8.6],[-4.8,9.4]] },
  { name:"Denguélé",          color:0xCE93D8, pts:[[-8.0,10.5],[-6.5,10.7],[-7.2,10.1],[-7.8,9.4],[-8.5,9.8]] },
  { name:"Bafing",            color:0xB0BEC5, pts:[[-8.5,9.8],[-7.8,9.4],[-7.2,10.1],[-7.5,8.8],[-8.2,8.6],[-8.8,9.2]] },
  { name:"Worodougou",        color:0xAB47BC, pts:[[-6.8,9.5],[-5.5,9.2],[-5.8,8.4],[-6.5,8.0],[-7.2,8.5],[-7.5,8.8],[-7.2,10.1],[-6.8,9.5]] },
  { name:"Vallée du Bandama", color:0xFF8A65, pts:[[-4.8,9.4],[-4.0,8.6],[-4.5,7.8],[-5.2,7.5],[-5.8,8.4],[-5.5,9.2],[-4.8,9.4]] },
  { name:"Haut-Sassandra",    color:0x64B5F6, pts:[[-7.2,8.5],[-6.5,8.0],[-5.8,8.4],[-6.2,7.4],[-7.0,7.2],[-7.8,7.8],[-7.5,8.8]] },
  { name:"Marahoué",          color:0x4DD0E1, pts:[[-5.8,8.4],[-5.2,7.5],[-5.6,7.0],[-6.2,7.4],[-5.8,8.4]] },
  { name:"Lacs",              color:0x81C784, pts:[[-4.5,7.8],[-4.0,8.6],[-3.0,8.8],[-3.2,7.5],[-4.0,7.0],[-4.8,7.2],[-4.5,7.8]] },
  { name:"N'zi-Comoé",        color:0xFFF176, pts:[[-3.2,7.5],[-3.0,8.8],[-2.6,9.8],[-2.2,8.5],[-2.8,7.0],[-3.5,6.8],[-3.2,7.5]] },
  { name:"Dix-Huit Montagnes",color:0x4CAF50, pts:[[-8.2,8.6],[-7.5,8.8],[-7.8,7.8],[-7.0,7.2],[-7.5,6.5],[-8.5,6.8],[-8.8,7.5]] },
  { name:"Moyen-Cavally",     color:0xD4E157, pts:[[-8.5,6.8],[-7.5,6.5],[-7.0,7.2],[-6.2,6.5],[-6.8,5.8],[-8.0,5.5],[-8.8,6.2]] },
  { name:"Fromager",          color:0xFF7043, pts:[[-6.2,7.4],[-5.6,7.0],[-5.8,6.2],[-6.5,5.8],[-6.8,5.8],[-6.2,6.5],[-7.0,7.2]] },
  { name:"Moyen-Comoé",       color:0x26C6DA, pts:[[-2.6,9.8],[-2.2,8.5],[-2.8,7.0],[-2.5,6.2],[-3.0,5.8],[-3.5,6.8],[-2.8,7.0]] },
  { name:"Sud-Bandama",       color:0x26A69A, pts:[[-5.6,7.0],[-5.2,7.5],[-4.8,7.2],[-4.0,7.0],[-4.2,6.2],[-5.0,5.8],[-5.8,6.2]] },
  { name:"Agnéby",            color:0xEF5350, pts:[[-3.5,6.8],[-2.8,7.0],[-2.5,6.2],[-2.8,5.5],[-3.5,5.2],[-4.2,5.8],[-4.2,6.2],[-3.5,6.8]] },
  { name:"Lagunes",           color:0xFFA726, pts:[[-4.2,6.2],[-4.2,5.8],[-3.5,5.2],[-3.8,4.8],[-4.5,4.8],[-5.0,5.2],[-5.0,5.8],[-4.2,6.2]] },
  { name:"Bas-Sassandra",     color:0xE53935, pts:[[-6.8,5.8],[-6.5,5.8],[-5.8,6.2],[-5.0,5.8],[-5.0,5.2],[-5.5,4.8],[-6.5,4.8],[-7.5,5.0],[-8.0,5.5]] },
  { name:"Sud-Comoé",         color:0x7E57C2, pts:[[-2.8,5.5],[-2.5,6.2],[-2.2,5.5],[-2.5,4.8],[-3.0,4.8],[-3.5,5.2],[-2.8,5.5]] },
];

function geoTo3D(lon,lat){return new THREE.Vector2((lon+6.0)*4.5,(lat-7.5)*4.5);}

function IvoryCoast3D(){
  const mountRef=useRef(null);
  useEffect(()=>{
    const mount=mountRef.current;if(!mount)return;
    const W=mount.clientWidth,H=mount.clientHeight;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(45,W/H,0.1,1000);camera.position.set(0,0,55);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setSize(W,H);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0x000000,0);mount.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xfff0d0,0.7));
    const dl=new THREE.DirectionalLight(0xFFD700,1.3);dl.position.set(10,20,30);scene.add(dl);
    const rl=new THREE.DirectionalLight(0xC8973A,0.5);rl.position.set(-15,-10,10);scene.add(rl);
    const ptLight=new THREE.PointLight(0xFF6B35,0.9,120);scene.add(ptLight);
    const mapGroup=new THREE.Group();scene.add(mapGroup);
    REGIONS.forEach(r=>{try{const shape=new THREE.Shape();const pts=r.pts.map(([lo,la])=>geoTo3D(lo,la));shape.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(p=>shape.lineTo(p.x,p.y));shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:1.4,bevelEnabled:true,bevelThickness:.18,bevelSize:.12,bevelSegments:3});const col=new THREE.Color(r.color);const mesh=new THREE.Mesh(geo,[new THREE.MeshPhongMaterial({color:col,transparent:true,opacity:.88,shininess:90,specular:new THREE.Color(0xffffff)}),new THREE.MeshPhongMaterial({color:new THREE.Color(r.color).multiplyScalar(0.5),transparent:true,opacity:.95,shininess:40})]);mesh.position.z=-.7;mapGroup.add(mesh);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo,22),new THREE.LineBasicMaterial({color:0xC8973A,transparent:true,opacity:.6}));edges.position.z=-.7;mapGroup.add(edges);}catch(_){}});
    const N=500;const pp=new Float32Array(N*3);const pc=new Float32Array(N*3);const pal=[new THREE.Color(0xC8973A),new THREE.Color(0xE8C060),new THREE.Color(0xFF6B35),new THREE.Color(0xFFD700)];
    for(let i=0;i<N;i++){pp[i*3]=(Math.random()-.5)*90;pp[i*3+1]=(Math.random()-.5)*70;pp[i*3+2]=(Math.random()-.5)*45;const c=pal[i%4];pc[i*3]=c.r;pc[i*3+1]=c.g;pc[i*3+2]=c.b;}
    const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pp,3));pg.setAttribute("color",new THREE.BufferAttribute(pc,3));
    scene.add(new THREE.Points(pg,new THREE.PointsMaterial({size:.3,vertexColors:true,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false})));
    let drag=false,prev={x:0,y:0},tgt={x:.3,y:0},cur={x:.3,y:0},auto=true,timer=null;
    const onMD=e=>{drag=true;prev={x:e.clientX,y:e.clientY};auto=false;clearTimeout(timer);};
    const onMU=()=>{drag=false;timer=setTimeout(()=>{auto=true;},3000);};
    const onMM=e=>{if(!drag)return;tgt.y+=(e.clientX-prev.x)*.012;tgt.x+=(e.clientY-prev.y)*.012;tgt.x=Math.max(-1.3,Math.min(1.3,tgt.x));prev={x:e.clientX,y:e.clientY};};
    const onRz=()=>{camera.aspect=mount.clientWidth/mount.clientHeight;camera.updateProjectionMatrix();renderer.setSize(mount.clientWidth,mount.clientHeight);};
    window.addEventListener("mousedown",onMD);window.addEventListener("mouseup",onMU);window.addEventListener("mousemove",onMM);window.addEventListener("resize",onRz);
    let raf;const tick=()=>{raf=requestAnimationFrame(tick);if(auto){tgt.y+=.004;tgt.x=.3+Math.sin(Date.now()*.0005)*.18;}cur.x+=(tgt.x-cur.x)*.055;cur.y+=(tgt.y-cur.y)*.055;mapGroup.rotation.x=cur.x;mapGroup.rotation.y=cur.y;ptLight.position.set(Math.sin(Date.now()*.001)*22,Math.cos(Date.now()*.0007)*16,20);renderer.render(scene,camera);};
    tick();
    return()=>{cancelAnimationFrame(raf);clearTimeout(timer);window.removeEventListener("mousedown",onMD);window.removeEventListener("mouseup",onMU);window.removeEventListener("mousemove",onMM);window.removeEventListener("resize",onRz);renderer.dispose();if(mount.contains(renderer.domElement))mount.removeChild(renderer.domElement);};
  },[]);
  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{zIndex:0,cursor:"grab"}}/>;
}

function MagicCursor(){
  const x=useMotionValue(-100),y=useMotionValue(-100);
  const sx=useSpring(x,{stiffness:500,damping:28}),sy=useSpring(y,{stiffness:500,damping:28});
  const tx=useSpring(x,{stiffness:70,damping:18}),ty=useSpring(y,{stiffness:70,damping:18});
  useEffect(()=>{const h=e=>{x.set(e.clientX-6);y.set(e.clientY-6);};window.addEventListener("mousemove",h);return()=>window.removeEventListener("mousemove",h);},[]);
  return(<>
    <motion.div style={{x:sx,y:sy,position:"fixed",top:0,left:0,zIndex:9999,pointerEvents:"none"}} className="w-3 h-3 rounded-full bg-amber-400 mix-blend-screen"/>
    <motion.div style={{x:tx,y:ty,position:"fixed",top:-14,left:-14,zIndex:9998,pointerEvents:"none"}} className="w-10 h-10 rounded-full border border-amber-400/40 mix-blend-screen"/>
  </>);
}

function StrengthBar({pwd}){
  if(!pwd)return null;
  let s=0;if(pwd.length>=8)s++;if(/[A-Z]/.test(pwd))s++;if(/[0-9]/.test(pwd))s++;if(/[^A-Za-z0-9]/.test(pwd))s++;
  const cols=["#ef4444","#f97316","#eab308","#10b981"];const labs=["Faible","Moyen","Bon","Fort ✦"];
  return(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex gap-1.5 items-center mt-1.5">
    {[0,1,2,3].map(i=>(<motion.div key={i} className="h-0.5 flex-1 rounded-full" style={{background:i<s?cols[s-1]:"rgba(255,255,255,0.08)"}} initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:i*.05}}/>))}
    {s>0&&<span className="text-xs ml-1" style={{color:cols[s-1]}}>{labs[s-1]}</span>}
  </motion.div>);
}

const BASE_STYLE={width:"100%",background:"rgba(0,0,0,0.28)",border:"1px solid rgba(200,151,58,0.3)",color:"#F5E6C8",fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",letterSpacing:"0.02em",borderRadius:"4px",padding:".85rem 1rem",outline:"none",transition:"border-color .3s, box-shadow .3s"};
const handleFocus=e=>{e.target.style.borderColor="rgba(200,151,58,0.75)";e.target.style.boxShadow="0 0 0 3px rgba(200,151,58,0.15)";};
const handleBlur=e=>{e.target.style.borderColor="rgba(200,151,58,0.3)";e.target.style.boxShadow="none";};

function Field({label,icon:Icon,error,delay=0,children}){
  return(
    <motion.div initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} transition={{duration:.5,delay,ease:[.25,.8,.25,1]}} className="space-y-1.5">
      <Label className="text-amber-200/65 text-xs tracking-widest uppercase flex items-center gap-2">
        {Icon&&<Icon className="w-3.5 h-3.5 text-amber-500"/>}{label}
      </Label>
      {children}
      <AnimatePresence>
        {error&&<motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="text-red-400/80 text-xs">{error}</motion.p>}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RegisterPage(){
  const navigate = useNavigate();
  const [step,setStep]=useState(1);
  const [showPass,setShowPass]=useState(false);
  const [showConf,setShowConf]=useState(false);
  const [isIvorian,setIsIvorian]=useState(null);
  const [errors,setErrors]=useState({});
  const [done,setDone]=useState(false);
  const [form,setForm]=useState({pseudo:"",email:"",password:"",confirm:"",ethnie:"",profil:"",terms:false});

  const setField=(k,v)=>setForm(f=>({...f,[k]:v}));
  const clrErr=k=>setErrors(e=>({...e,[k]:""}));

  const validate1=()=>{const e={};if(!form.pseudo.trim()||form.pseudo.length<3)e.pseudo="Pseudo requis (min. 3 car.)";if(!/\S+@\S+\.\S+/.test(form.email))e.email="Email invalide";if(!form.password||form.password.length<8)e.password="Minimum 8 caractères";if(form.confirm!==form.password)e.confirm="Mots de passe différents";setErrors(e);return Object.keys(e).length===0;};
  const validate2=()=>{const e={};if(isIvorian===null)e.ivorian="Choisir une option";if(isIvorian===true&&!form.ethnie)e.ethnie="Choisir votre ethnie";if(isIvorian===false&&!form.profil)e.profil="Choisir votre profil";if(!form.terms)e.terms="Accepter les conditions";setErrors(e);return Object.keys(e).length===0;};

  const pageVariants={enter:{opacity:0,x:50,filter:"blur(6px)"},center:{opacity:1,x:0,filter:"blur(0px)"},exit:{opacity:0,x:-50,filter:"blur(6px)"}};

  if(done) return(
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background:"#0A0602",cursor:"none"}}>
      <MagicCursor/><IvoryCoast3D/>
      <div className="absolute inset-0 z-[1]" style={{background:"radial-gradient(ellipse 60% 70% at 50% 50%,rgba(10,6,2,.45),rgba(10,6,2,.85))"}}/>
      <div className="relative z-10 text-center flex flex-col items-center gap-8 px-8">
        <motion.div initial={{scale:0,rotate:-180}} animate={{scale:1,rotate:0}} transition={{type:"spring",stiffness:200,damping:14}} className="w-28 h-28 rounded-full border-2 border-amber-400 flex items-center justify-center" style={{boxShadow:"0 0 80px rgba(200,151,58,0.6)"}}>
          <CheckCircle2 className="text-amber-400 w-14 h-14"/>
        </motion.div>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.4}}>
          <p className="text-amber-400/50 text-xs tracking-widest uppercase mb-3" style={{fontFamily:"'Cinzel Decorative',serif"}}>— Akwaba ! Le portail s'est ouvert —</p>
          <h1 className="text-5xl font-black text-amber-50 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>Bienvenue,<br/><span className="italic text-amber-400">{form.pseudo}</span></h1>
          <p className="text-amber-100/40 text-lg mt-5 max-w-sm leading-relaxed">La Côte d'Ivoire et ses mémoires s'ouvrent à toi.</p>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}>
          <button onClick={()=>navigate("/app")} className="px-12 py-4 text-xs tracking-widest uppercase font-bold rounded-sm" style={{background:"linear-gradient(135deg,#C8973A,#E8C060)",color:"#1A0E05",boxShadow:"0 12px 40px rgba(200,151,58,0.45)",fontFamily:"'Cinzel Decorative',serif"}}>
            Accéder à mon espace →
          </button>
        </motion.div>
      </div>
    </div>
  );

  return(
    <div className="relative min-h-screen flex overflow-hidden" style={{background:"#0A0602",cursor:"none"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Cormorant+Garamond:wght@300;400;600&family=Cinzel+Decorative:wght@400&display=swap');
        input::placeholder{color:rgba(200,151,58,0.28)!important;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:rgba(200,151,58,0.25);border-radius:2px;}
        .glass-card{background:rgba(8,4,1,0.42);backdrop-filter:blur(20px) saturate(1.5);-webkit-backdrop-filter:blur(20px) saturate(1.5);border-top:1px solid rgba(200,151,58,0.28);border-left:1px solid rgba(200,151,58,0.14);border-right:1px solid rgba(200,151,58,0.07);border-bottom:1px solid rgba(200,151,58,0.07);box-shadow:0 32px 80px rgba(0,0,0,0.55),inset 0 1px 0 rgba(200,151,58,0.15);}
        @keyframes letterFloat{0%,100%{transform:translateY(0px) rotate(-1.5deg);}50%{transform:translateY(-10px) rotate(1.5deg);}}
      `}</style>

      <IvoryCoast3D/>
      <MagicCursor/>

      {/* Dégradé vers gauche pour laisser la carte visible à droite */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{background:"linear-gradient(to left,rgba(10,6,2,0.0) 0%,rgba(10,6,2,0.0) 48%,rgba(10,6,2,0.65) 100%)"}}/>

      {/* Filigrane losanges */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{opacity:.022,backgroundImage:`url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35 8 L62 35 L35 62 L8 35 Z' fill='none' stroke='%23C8973A' stroke-width='0.8'/%3E%3C/svg%3E")`,backgroundSize:"70px 70px"}}/>

      {/* ── AKWABA — côté DROIT ── */}
      <div className="absolute right-0 top-0 bottom-0 z-[3] hidden lg:flex flex-col items-center justify-center pointer-events-none" style={{width:"40%",paddingRight:"4rem"}}>
        <motion.div className="w-px mb-8" style={{height:80,background:"linear-gradient(to bottom, transparent, rgba(200,151,58,0.55), transparent)"}} initial={{scaleY:0}} animate={{scaleY:1}} transition={{duration:1,delay:.3}}/>
        <div className="flex flex-col items-center" style={{fontFamily:"'Playfair Display',serif"}}>
          {"AKWABA".split("").map((letter,i)=>(
            <motion.span key={i} className="block font-black leading-none select-none"
              style={{fontSize:"clamp(3rem,6.5vw,5.5rem)",color:"transparent",WebkitTextStroke:"1.5px rgba(200,151,58,0.72)",letterSpacing:".05em",textShadow:"0 0 40px rgba(200,151,58,0.2),0 0 80px rgba(200,151,58,0.08)",animation:`letterFloat ${3.2+i*.28}s ease-in-out ${i*.35}s infinite`}}
              initial={{opacity:0,y:-35,scale:.75}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.65,delay:.6+i*.11,ease:[.25,.8,.25,1]}}
            >{letter}</motion.span>
          ))}
        </div>
        <motion.p className="mt-8 text-amber-400/45 text-xs tracking-widest text-center leading-relaxed" style={{fontFamily:"'Cinzel Decorative',serif",maxWidth:160}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.9}}>
          Bienvenue en<br/>Côte d'Ivoire
        </motion.p>
        <motion.div className="w-px mt-8" style={{height:80,background:"linear-gradient(to bottom, rgba(200,151,58,0.55), transparent)"}} initial={{scaleY:0}} animate={{scaleY:1}} transition={{duration:1,delay:.5}}/>
        <motion.div className="mt-6 flex overflow-hidden rounded-sm" style={{width:48,height:30,boxShadow:"0 4px 16px rgba(0,0,0,0.6)"}} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:2.1,type:"spring"}}>
          <div style={{flex:1,background:"#F77F00"}}/><div style={{flex:1,background:"#FFFFFF"}}/><div style={{flex:1,background:"#009A44"}}/>
        </motion.div>
      </div>

      {/* Hint glisser */}
      <motion.div className="absolute z-[5] pointer-events-none" style={{bottom:"1.5rem",left:"50%",transform:"translateX(-50%)"}} initial={{opacity:0}} animate={{opacity:[0,.45,0]}} transition={{delay:2.2,duration:4,times:[0,.4,1]}}>
        <p className="text-amber-400/45 text-xs tracking-widest whitespace-nowrap" style={{fontFamily:"'Cormorant Garamond',serif"}}>✦ Glisser pour faire tourner la carte ✦</p>
      </motion.div>

      {/* ── Formulaire — GAUCHE ── */}
      <div className="relative z-10 flex items-center w-full justify-start">
        <div className="w-full lg:w-[480px] px-4 py-10 overflow-y-auto max-h-screen">

          {/* Logo mobile */}
          <motion.p initial={{opacity:0,y:-15}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="text-center text-amber-400 tracking-widest text-xs mb-6 lg:hidden" style={{fontFamily:"'Cinzel Decorative',serif"}}>✦ HÉRITAGE · VIVANT ✦</motion.p>

          {/* Bouton retour */}
          <motion.div initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:.15}} className="mb-5">
            <Link to="/">
              <button className="flex items-center gap-2 text-amber-400/50 hover:text-amber-400 transition-colors" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".9rem",letterSpacing:".05em"}}>
                <ArrowLeft className="w-4 h-4"/><span>Accueil</span>
              </button>
            </Link>
          </motion.div>

          {/* Étapes */}
          <motion.div className="flex items-center gap-3 mb-6" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.25}}>
            {[1,2].map(n=>(
              <div key={n} className="flex items-center gap-3 flex-1">
                <motion.div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border"
                  animate={{borderColor:step>=n?"#C8973A":"rgba(200,151,58,0.15)",background:step>=n?"rgba(200,151,58,0.16)":"rgba(0,0,0,0.28)",color:step>=n?"#E8C060":"rgba(245,230,200,0.25)",boxShadow:step===n?"0 0 24px rgba(200,151,58,0.55)":"none"}}
                  transition={{duration:.4}}>
                  {step>n?<CheckCircle2 className="w-4 h-4 text-amber-400"/>:n}
                </motion.div>
                {n<2&&(<div className="flex-1 h-px overflow-hidden rounded-full" style={{background:"rgba(200,151,58,0.1)"}}>
                  <motion.div className="h-full rounded-full" style={{background:"linear-gradient(90deg,#C8973A,#E8C060)"}} animate={{width:step>n?"100%":"0%"}} transition={{duration:.55,ease:[.25,.8,.25,1]}}/>
                </div>)}
              </div>
            ))}
          </motion.div>

          {/* Carte verre */}
          <div className="glass-card rounded-md overflow-hidden">
            {/* Header */}
            <div className="pt-7 px-7 pb-5">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.36}}>
                  <span className="inline-block mb-3 px-3 py-1 text-xs border border-amber-500/30 text-amber-400 tracking-widest rounded-sm" style={{fontFamily:"'Cinzel Decorative',serif",fontSize:".6rem",background:"rgba(200,151,58,0.08)"}}>
                    {step===1?"⟢ ÉTAPE 1 — Identité":"⟢ ÉTAPE 2 — Racines"}
                  </span>
                  <h2 className="text-3xl font-black leading-tight text-amber-50" style={{fontFamily:"'Playfair Display',serif"}}>
                    {step===1?<>Créer mon<br/><span className="italic text-amber-400">sanctuaire</span></>:<>Mon profil<br/><span className="italic text-amber-400">culturel</span></>}
                  </h2>
                  <p className="text-amber-100/40 mt-2 text-sm leading-relaxed">
                    {step===1?"Tes identifiants sacrés pour accéder à l'héritage.":"Ces données personnalisent ton expérience dans la communauté."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Body */}
            <div className="px-7 pb-2">
              <AnimatePresence mode="wait">
                {/* Étape 1 */}
                {step===1&&(
                  <motion.div key="s1" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{duration:.4,ease:[.25,.8,.25,1]}} className="space-y-4">
                    <Field label="Pseudo" icon={User} error={errors.pseudo} delay={0}>
                      <input style={BASE_STYLE} placeholder="nom_ancestral" value={form.pseudo} onChange={e=>{setField("pseudo",e.target.value);clrErr("pseudo");}} onFocus={handleFocus} onBlur={handleBlur}/>
                    </Field>
                    <Field label="Email — ton sceau" icon={Mail} error={errors.email} delay={.08}>
                      <input style={BASE_STYLE} type="email" placeholder="toi@exemple.ci" value={form.email} onChange={e=>{setField("email",e.target.value);clrErr("email");}} onFocus={handleFocus} onBlur={handleBlur}/>
                    </Field>
                    <Field label="Mot de passe sacré" icon={Lock} error={errors.password} delay={.16}>
                      <div className="relative">
                        <input style={{...BASE_STYLE,paddingRight:"3rem"}} type={showPass?"text":"password"} placeholder="••••••••" value={form.password} onChange={e=>{setField("password",e.target.value);clrErr("password");}} onFocus={handleFocus} onBlur={handleBlur}/>
                        <button type="button" onClick={()=>setShowPass(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500/35 hover:text-amber-400 transition-colors">
                          {showPass?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                        </button>
                      </div>
                      <StrengthBar pwd={form.password}/>
                    </Field>
                    <Field label="Confirmer le sceau" icon={Shield} error={errors.confirm} delay={.24}>
                      <div className="relative">
                        <input style={{...BASE_STYLE,paddingRight:"3.5rem"}} type={showConf?"text":"password"} placeholder="••••••••" value={form.confirm} onChange={e=>{setField("confirm",e.target.value);clrErr("confirm");}} onFocus={handleFocus} onBlur={handleBlur}/>
                        <button type="button" onClick={()=>setShowConf(v=>!v)} className="absolute right-9 top-1/2 -translate-y-1/2 text-amber-500/35 hover:text-amber-400 transition-colors">
                          {showConf?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                        </button>
                        <AnimatePresence>
                          {form.confirm&&form.confirm===form.password&&(
                            <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute right-3 top-1/2 -translate-y-1/2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400"/>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Field>
                  </motion.div>
                )}

                {/* Étape 2 */}
                {step===2&&(
                  <motion.div key="s2" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{duration:.4,ease:[.25,.8,.25,1]}} className="space-y-5">
                    {/* Ivoirien ? */}
                    <div className="space-y-2">
                      <Label className="text-amber-200/65 text-xs tracking-widest uppercase flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-amber-500"/> Es-tu ivoirien·ne ?
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[{v:true,emoji:"🇨🇮",t:"Oui, ivoirien·ne"},{v:false,emoji:"🌍",t:"Non, d'ailleurs"}].map(({v,emoji,t})=>(
                          <motion.button key={String(v)} type="button" whileHover={{scale:1.04}} whileTap={{scale:.96}}
                            onClick={()=>{setIsIvorian(v);setField("ethnie","");setField("profil","");clrErr("ivorian");}}
                            className="py-4 px-3 text-sm rounded text-left border transition-all duration-300"
                            style={{borderColor:isIvorian===v?"#C8973A":"rgba(200,151,58,0.15)",background:isIvorian===v?"rgba(200,151,58,0.14)":"rgba(0,0,0,0.22)",color:isIvorian===v?"#E8C060":"rgba(245,230,200,0.45)",boxShadow:isIvorian===v?"0 0 28px rgba(200,151,58,0.28),inset 0 0 12px rgba(200,151,58,0.08)":"none",fontFamily:"'Cormorant Garamond',serif"}}>
                            <span className="text-xl block mb-1">{emoji}</span>{t}{isIvorian===v&&<span className="ml-1.5 text-amber-400">✦</span>}
                          </motion.button>
                        ))}
                      </div>
                      {errors.ivorian&&<p className="text-red-400/80 text-xs">{errors.ivorian}</p>}
                    </div>

                    {/* Ethnie */}
                    <AnimatePresence>
                      {isIvorian===true&&(
                        <motion.div key="eth" initial={{opacity:0,height:0,y:-8}} animate={{opacity:1,height:"auto",y:0}} exit={{opacity:0,height:0}} transition={{duration:.38,ease:[.25,.8,.25,1]}} className="overflow-hidden space-y-2">
                          <Label className="text-amber-200/65 text-xs tracking-widest uppercase flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-amber-500"/> Votre ethnie / groupe culturel
                          </Label>
                          <Select value={form.ethnie} onValueChange={v=>{setField("ethnie",v);clrErr("ethnie");}}>
                            <SelectTrigger style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(200,151,58,0.3)",color:form.ethnie?"#F5E6C8":"rgba(200,151,58,0.4)",fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",borderRadius:"4px",padding:"1.3rem 1rem"}}>
                              <SelectValue placeholder="— Choisir votre ethnie —"/>
                            </SelectTrigger>
                            <SelectContent style={{background:"rgba(12,6,2,0.96)",border:"1px solid rgba(200,151,58,0.25)",backdropFilter:"blur(20px)"}}>
                              {ETHNIES.map(et=>(<SelectItem key={et.value} value={et.value} style={{color:"#F5E6C8",fontFamily:"'Cormorant Garamond',serif",cursor:"pointer"}}>{et.label}</SelectItem>))}
                            </SelectContent>
                          </Select>
                          {errors.ethnie&&<p className="text-red-400/80 text-xs">{errors.ethnie}</p>}
                          <AnimatePresence>
                            {form.ethnie&&(<motion.p initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} className="text-amber-400/50 text-xs italic">✦ Sagesse ancestrale reconnue. Bienvenue, gardien·ne.</motion.p>)}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Profils */}
                    <AnimatePresence>
                      {isIvorian===false&&(
                        <motion.div key="pro" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:.38}} className="overflow-hidden space-y-2">
                          <Label className="text-amber-200/65 text-xs tracking-widest uppercase flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500"/> Ton lien avec la culture
                          </Label>
                          {errors.profil&&<p className="text-red-400/80 text-xs">{errors.profil}</p>}
                          <div className="grid grid-cols-2 gap-2">
                            {PROFILS.map((p,i)=>(
                              <motion.button key={p.id} type="button" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.055}} whileHover={{scale:1.04}} whileTap={{scale:.96}}
                                onClick={()=>{setField("profil",p.id);clrErr("profil");}}
                                className="flex items-center gap-2 py-2.5 px-3 text-left text-sm rounded border transition-all duration-300"
                                style={{borderColor:form.profil===p.id?p.color:"rgba(200,151,58,0.12)",background:form.profil===p.id?`${p.color}18`:"rgba(0,0,0,0.22)",color:form.profil===p.id?p.color:"rgba(245,230,200,0.45)",boxShadow:form.profil===p.id?`0 0 20px ${p.color}35`:"none",fontFamily:"'Cormorant Garamond',serif"}}>
                                <p.icon className="w-3.5 h-3.5 flex-shrink-0" style={{color:form.profil===p.id?p.color:"rgba(200,151,58,0.4)"}}/>
                                <span className="flex-1 text-xs leading-snug">{p.label}</span>
                                {form.profil===p.id&&<CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{color:p.color}}/>}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CGU */}
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}} className="flex items-start gap-3 pt-1">
                      <Checkbox id="terms" checked={form.terms} onCheckedChange={v=>{setField("terms",v);clrErr("terms");}} className="border-amber-500/30 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 mt-0.5"/>
                      <Label htmlFor="terms" className="text-xs text-amber-100/35 leading-relaxed cursor-pointer">
                        Je m'engage à{" "}<span className="text-amber-400/60 border-b border-amber-400/20">préserver et honorer</span>{" "}les mémoires partagées.
                      </Label>
                    </motion.div>
                    {errors.terms&&<p className="text-red-400/80 text-xs -mt-3">{errors.terms}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-7 pt-5 pb-7 flex flex-col gap-4">
              <div className="flex gap-3 w-full">
                {step===2&&(
                  <motion.div initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}}>
                    <button type="button" onClick={()=>{setStep(1);setErrors({});}} className="h-full px-4 rounded border transition-all hover:border-amber-500/40" style={{borderColor:"rgba(200,151,58,0.2)",color:"rgba(245,230,200,0.4)",background:"rgba(0,0,0,0.2)"}}>
                      <ArrowLeft className="w-4 h-4"/>
                    </button>
                  </motion.div>
                )}
                <motion.button
                  className="flex-1 py-4 text-center rounded relative overflow-hidden group"
                  style={{background:"linear-gradient(135deg,#C8973A 0%,#E8C060 50%,#C8973A 100%)",backgroundSize:"200%",color:"#1A0E05",fontFamily:"'Cinzel Decorative',serif",fontSize:".68rem",letterSpacing:".2em",fontWeight:"700",boxShadow:"0 10px 36px rgba(200,151,58,0.42),0 2px 8px rgba(200,151,58,0.2)"}}
                  whileHover={{scale:1.025,boxShadow:"0 14px 48px rgba(200,151,58,0.6)"}} whileTap={{scale:.975}}
                  onClick={()=>{if(step===1){if(validate1())setStep(2);}else{if(validate2())setDone(true);}}}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {step===1?"Continuer":"Activer mon sceau"}
                    <motion.span animate={{x:[0,4,0]}} transition={{repeat:Infinity,duration:1.6}}>
                      <ChevronRight className="w-4 h-4"/>
                    </motion.span>
                  </span>
                  <motion.div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100" transition={{duration:.3}}/>
                </motion.button>
              </div>

              <p className="text-center text-sm text-amber-100/25" style={{fontFamily:"'Cormorant Garamond',serif"}}>
                Déjà un sceau actif ?{" "}
                <Link to="/auth/login" className="text-amber-400/70 hover:text-amber-300 transition-colors border-b border-amber-400/20 pb-px">
                  Réouvrir le portail
                </Link>
              </p>
            </div>
          </div>

          {/* Déco bas */}
          <div className="flex justify-center gap-2 mt-5">
            {[0,1,2,3,4].map(i=>(
              <motion.div key={i} className="h-px rounded-full" initial={{width:0,opacity:0}} animate={{width:24,opacity:i<(step===1?2:5)?0.5:0.1}} transition={{delay:.9+i*.07}} style={{background:"linear-gradient(90deg,#C8973A,#E8C060)"}}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}