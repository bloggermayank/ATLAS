import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ArrowDown, ArrowUpRight, Compass, LocateFixed, Menu, Moon, Sun, X } from 'lucide-react';

const districts = [
  { id:'old-quarter', name:'Old Quarter', subtitle:'Where the city began', number:'01', position:[-13,0,-10], description:'A tangle of limestone lanes, quiet courtyards and stories held in sun-warmed walls.', mood:'Historic · Intimate · Timeless', color:'#b77c58' },
  { id:'grand-piazza', name:'Grand Piazza', subtitle:'The heart of ATLAS', number:'02', position:[0,0,0], description:'The city gathers here. A broad stone square, a fountain at its centre, and the slow rhythm of an afternoon.', mood:'Open · Social · Lively', color:'#c49b68' },
  { id:'villa-terraces', name:'Villa Terraces', subtitle:'A slower way of living', number:'03', position:[1,0,15], description:'Stepped gardens and private villas descend toward the sea, linked by little stairways and shaded paths.', mood:'Residential · Serene · Green', color:'#8b9a75' },
  { id:'garden-quarter', name:'Garden Quarter', subtitle:'A city in bloom', number:'04', position:[-1,0,-17], description:'Olive groves, hidden fountains and botanical paths make a softer world within the city.', mood:'Botanical · Quiet · Restorative', color:'#899b77' },
  { id:'atelier-district', name:'Atelier District', subtitle:'Made by curious minds', number:'05', position:[15,0,-1], description:'Studios, galleries and expressive courtyards bring a contemporary creative pulse to old materials.', mood:'Creative · Modern · Independent', color:'#a87962' },
  { id:'market-arcade', name:'Market Arcade', subtitle:'The everyday theatre', number:'06', position:[-17,0,2], description:'An arcade of little shops, cafés and open-air stalls where the day is always in motion.', mood:'Local · Warm · Energetic', color:'#c18b58' },
  { id:'sunset-heights', name:'Sunset Heights', subtitle:'The long view', number:'07', position:[-15,0,15], description:'A chain of terraces and belvederes opens toward the coast, especially beautiful at the last light.', mood:'Panoramic · Romantic · Calm', color:'#bd8b67' },
  { id:'observatory-hill', name:'Observatory Hill', subtitle:'Above it all', number:'08', position:[15,0,-16], description:'A hilltop pavilion watches over the rooftops and the open water beyond.', mood:'Landmark · Elevated · Expansive', color:'#9a886f' }
];

function seeded(i){ const x=Math.sin(i*127.1+311.7)*43758.5453; return x-Math.floor(x); }
function makeBuilding(scene,x,z,w,d,h,seed=1,accent=false,districtId=null){
  const stone = new THREE.MeshStandardMaterial({color: accent ? '#d9c5a5' : ['#e7d9c2','#d8c7ad','#cbb89e','#eee2ce'][Math.floor(seeded(seed)*4)], roughness:.92});
  const base = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),stone); base.position.set(x,h/2,z); base.castShadow=true; base.receiveShadow=true; base.userData.atlasDistrictId=districtId; scene.add(base);
  const roofMat = new THREE.MeshStandardMaterial({color:['#a85f45','#b96d4e','#96533f'][Math.floor(seeded(seed+4)*3)],roughness:1});
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*.78,Math.min(1.15,h*.22),4),roofMat); roof.rotation.y=Math.PI/4; roof.position.set(x,h+.28,z); roof.castShadow=true; scene.add(roof);
  const winMat = new THREE.MeshStandardMaterial({color:'#53685d',roughness:.8});
  const floors=Math.max(1,Math.floor(h/1.7));
  for(let f=0;f<floors;f++) for(let side=-1;side<=1;side+=2){
    const win=new THREE.Mesh(new THREE.BoxGeometry(.34,.58,.08),winMat); win.position.set(x+side*w*.22,1.05+f*1.55,z+d/2+.045); scene.add(win);
  }
  return base;
}
function addTree(scene,x,z,scale=1){
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12*scale,.19*scale,1.35*scale,7),new THREE.MeshStandardMaterial({color:'#806044'})); trunk.position.set(x,.68*scale,z); trunk.castShadow=true; scene.add(trunk);
  const leaves=new THREE.Mesh(new THREE.IcosahedronGeometry(.95*scale,1),new THREE.MeshStandardMaterial({color:'#657c59',roughness:1})); leaves.position.set(x,1.65*scale,z); leaves.scale.set(1,1.12,.95); leaves.castShadow=true; scene.add(leaves);
}
function createCity(scene){
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({color:'#d9c9ad',roughness:1})); ground.rotation.x=-Math.PI/2; ground.position.y=-.08; ground.receiveShadow=true; scene.add(ground);
  const coast=new THREE.Mesh(new THREE.PlaneGeometry(90,22),new THREE.MeshStandardMaterial({color:'#7dabb0',roughness:.42,metalness:.08})); coast.rotation.x=-Math.PI/2; coast.position.set(0,-.12,49); scene.add(coast);
  const coastLine=new THREE.Mesh(new THREE.BoxGeometry(90,.18,.7),new THREE.MeshStandardMaterial({color:'#f0dfc4'})); coastLine.position.set(0,.03,38); scene.add(coastLine);
  // A connected, branching pedestrian network.
  const roadMat=new THREE.MeshStandardMaterial({color:'#f2e8d7',roughness:1});
  const paths=[ [0,0,3.3,76,0], [0,0,76,3.3,0], [-13,0,3,44,.38], [14,0,3,42,-.4], [-22,0,2.5,28,.7], [22,0,2.5,28,-.7], [-9,0,2.4,34,-.7], [9,0,2.4,34,.7] ];
  paths.forEach(([x,y,w,d,rot])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),roadMat);p.rotation.x=-Math.PI/2;p.rotation.z=rot;p.position.set(x,.005,y);scene.add(p);});
  // Piazza and its concentric paving.
  const piazza=new THREE.Mesh(new THREE.CircleGeometry(7.3,64),new THREE.MeshStandardMaterial({color:'#c9b89d',roughness:1})); piazza.rotation.x=-Math.PI/2; piazza.position.y=.018; scene.add(piazza);
  const ring=new THREE.Mesh(new THREE.RingGeometry(6.2,6.35,64),new THREE.MeshStandardMaterial({color:'#eee2cf',roughness:1,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.03;scene.add(ring);
  // Fountain placeholder — replace with the approved Meshy GLB when export access is available.
  const basin=new THREE.Mesh(new THREE.CylinderGeometry(2.15,2.25,.42,48),new THREE.MeshStandardMaterial({color:'#d7c8ad',roughness:.65}));basin.position.set(0,.25,0);basin.castShadow=true;scene.add(basin);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(1.92,1.92,.035,48),new THREE.MeshStandardMaterial({color:'#8db5b7',roughness:.22,metalness:.18}));water.position.set(0,.48,0);scene.add(water);
  const column=new THREE.Mesh(new THREE.CylinderGeometry(.42,.55,1.55,16),new THREE.MeshStandardMaterial({color:'#e0d0b6',roughness:.72}));column.position.set(0,1.25,0);column.castShadow=true;scene.add(column);
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.92,.5,.2,32),new THREE.MeshStandardMaterial({color:'#d8c7ab',roughness:.7}));bowl.position.set(0,2.12,0);scene.add(bowl);
  // District clusters, connected to the central square.
  districts.forEach((district,di)=>{
    const [cx,,cz]=district.position;
    for(let i=0;i<15;i++){
      const a=seeded(di*100+i)*Math.PI*2, r=5+seeded(di*100+i+33)*6;
      const x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;
      if(Math.abs(x)<5&&Math.abs(z)<5)continue;
      makeBuilding(scene,x,z,1.5+seeded(i+di*9)*1.3,1.5+seeded(i+di*11)*1.2,2.5+seeded(i+di*13)*4,di*50+i,false,district.id);
    }
    for(let t=0;t<5;t++){const a=seeded(di*50+t)*Math.PI*2,r=7+seeded(t+di*7)*5;addTree(scene,cx+Math.cos(a)*r,cz+Math.sin(a)*r,.8+seeded(t+3)*.35);}
  });
  // Signature lookout on Observatory Hill.
  const hx=15,hz=-16;
  const plinth=new THREE.Mesh(new THREE.CylinderGeometry(4.2,4.8,.8,8),new THREE.MeshStandardMaterial({color:'#c6b397'}));plinth.position.set(hx,.4,hz);scene.add(plinth);
  const pavilion=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.8,3.1,8,1,true),new THREE.MeshStandardMaterial({color:'#e7d9c2',roughness:.9,side:THREE.DoubleSide}));pavilion.position.set(hx,2.25,hz);scene.add(pavilion);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(2.2,24,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#ad7659',roughness:.85}));dome.position.set(hx,3.8,hz);scene.add(dome);
  // Terraced green edges and cypress-like accents.
  for(let i=0;i<34;i++){const x=(seeded(i+500)-.5)*70,z=(seeded(i+700)-.5)*62;if(Math.abs(x)<22&&Math.abs(z)<22)continue;addTree(scene,x,z,.65+seeded(i+900)*.45);}
  // Distant island / horizon silhouettes.
  const island=new THREE.Mesh(new THREE.ConeGeometry(8,4,7),new THREE.MeshStandardMaterial({color:'#b8b09b',roughness:1}));island.position.set(-24,.9,43);island.rotation.z=Math.PI;scene.add(island);
}

function CityCanvas({onSelect,night,focus}){
  const mount=useRef(null), api=useRef(null);
  useEffect(()=>{
    const el=mount.current;if(!el)return;
    const scene=new THREE.Scene();scene.background=new THREE.Color(night?'#263a3c':'#d9cbb5');scene.fog=new THREE.Fog(scene.background,42,105);
    const camera=new THREE.PerspectiveCamera(43,el.clientWidth/el.clientHeight,.1,180);camera.position.set(43,38,49);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));renderer.setSize(el.clientWidth,el.clientHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;el.appendChild(renderer.domElement);
    const hemi=new THREE.HemisphereLight(night?'#a5c2c9':'#fff0d8',night?'#33413b':'#a38b6b',night?1.2:1.8);scene.add(hemi);
    const sun=new THREE.DirectionalLight(night?'#a8c4d5':'#ffe0a5',night?1.25:3.2);sun.position.set(-25,42,-16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-55;sun.shadow.camera.right=55;sun.shadow.camera.top=55;sun.shadow.camera.bottom=-55;scene.add(sun);
    createCity(scene);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.maxPolarAngle=Math.PI/2.08;controls.minDistance=22;controls.maxDistance=88;controls.target.set(0,0,0);controls.autoRotate=false;
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();const clickable=[];
    scene.traverse(o=>{if(o.isMesh && o.userData?.atlasDistrictId)clickable.push(o);});
    const click=e=>{const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(clickable);if(hits.length){const districtId=hits[0].object.userData.atlasDistrictId;if(districtId)onSelect(districtId);}};
    renderer.domElement.addEventListener('click',click);
    const resize=()=>{camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight);};window.addEventListener('resize',resize);
    let frame;const animate=()=>{frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);};animate();
    api.current={camera,controls};
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);renderer.domElement.removeEventListener('click',click);controls.dispose();renderer.dispose();el.removeChild(renderer.domElement);scene.traverse(o=>{o.geometry?.dispose?.();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});};
  },[night,onSelect]);
  useEffect(()=>{if(!api.current||!focus)return;const d=districts.find(x=>x.id===focus);if(!d)return;const {camera,controls}=api.current;const target=new THREE.Vector3(d.position[0],0,d.position[2]);const offset=new THREE.Vector3(18,15,20);const fromCamera=camera.position.clone();const toCamera=target.clone().add(offset);const fromTarget=controls.target.clone();let start;let frame;const animateFocus=(time)=>{if(!start)start=time;const t=Math.min(1,(time-start)/850);const eased=1-Math.pow(1-t,3);camera.position.lerpVectors(fromCamera,toCamera,eased);controls.target.lerpVectors(fromTarget,target,eased);if(t<1)frame=requestAnimationFrame(animateFocus);};frame=requestAnimationFrame(animateFocus);return()=>cancelAnimationFrame(frame);},[focus]);
  return <div className="city-canvas" ref={mount}><div className="canvas-hint"><span className="hint-dot"/> DRAG TO EXPLORE <span className="hint-divider"/> TAP OR CLICK A BUILDING TO DISCOVER</div></div>;
}

export default function Atlas(){
  const [selected,setSelected]=useState('grand-piazza');const [night,setNight]=useState(false);const [panel,setPanel]=useState(false);const [menu,setMenu]=useState(false);
  const active=districts.find(d=>d.id===selected)||districts[1];
  const select=useCallback((id)=>{setSelected(id);setPanel(true);},[]);
  return <main className={night?'atlas night':'atlas'}>
    <header className="topbar">
      <a className="wordmark" href="#" onClick={e=>{e.preventDefault();setSelected('grand-piazza');setPanel(false);}}>ATLAS<span className="wordmark-dot">.</span><small>THE IMAGINED CITY</small></a>
      <nav className={menu?'nav-links open':'nav-links'}><a className="active" href="#explore">Explore</a><a href="#districts">Districts</a><a href="#about">The story</a></nav>
      <div className="top-actions"><span className="edition">A CITY TO GET LOST IN</span><button className="icon-button" aria-label="Toggle day and night" onClick={()=>setNight(!night)}>{night?<Sun size={17}/>:<Moon size={17}/>}</button><button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="Open menu">{menu?<X/>:<Menu/>}</button></div>
    </header>
    <section className="hero" id="explore">
      <div className="hero-copy"><div className="eyebrow"><span/> AN OPEN WORLD, AT YOUR OWN PACE</div><h1>Somewhere<br/><em>between</em> the sea<br/>and the sky.</h1><p>A Mediterranean city shaped by light, lived-in streets, and the beauty of taking the long way home.</p><button className="explore-cta" onClick={()=>{setPanel(false);setSelected('grand-piazza');document.querySelector('.world')?.scrollIntoView({behavior:'smooth'});}}><Compass size={16}/> EXPLORE THE CITY <ArrowDown size={15}/></button></div>
      <div className="hero-note"><span className="note-line"/> 36° NORTH, 18° EAST <small>AN IMAGINED PLACE</small></div>
      <div className="hero-index"><span>01</span> / 08</div>
    </section>
    <section className="world" aria-label="Interactive 3D city">
      <div className="world-heading"><div><span className="section-kicker">THE CITY, IN THREE DIMENSIONS</span><h2>Find your <i>place.</i></h2></div><div className="world-tools"><span><LocateFixed size={14}/> FREE ROAM</span><button onClick={()=>setNight(!night)}>{night?<Sun size={14}/>:<Moon size={14}/>} {night?'DAYLIGHT':'GOLDEN HOUR'}</button></div></div>
      <div className="world-frame"><CityCanvas onSelect={select} night={night} focus={selected}/>{panel&&<aside className="district-card"><button className="close-card" onClick={()=>setPanel(false)} aria-label="Close district"><X size={17}/></button><span className="section-kicker">DISTRICT {active.number}</span><h3>{active.name}</h3><p className="district-sub">{active.subtitle}</p><div className="card-rule"/><p>{active.description}</p><span className="district-mood">{active.mood}</span><button className="text-link" onClick={()=>setPanel(false)}>BACK TO THE CITY <ArrowUpRight size={14}/></button></aside>}</div>
      <div className="world-footer"><span>01 — 08 NEIGHBOURHOODS</span><span>SCROLL TO DISCOVER <ArrowDown size={13}/></span><span>ATLAS CITY V.01</span></div>
    </section>
    <section className="districts-section" id="districts"><div className="section-intro"><span className="section-kicker">A CITY OF MANY MOODS</span><h2>Eight places.<br/><i>One feeling.</i></h2><p>Every neighbourhood has its own rhythm. Wander between them and see what you find.</p></div><div className="district-list">{districts.map(d=><button key={d.id} className={'district-row '+(selected===d.id?'chosen':'')} onClick={()=>{select(d.id);document.querySelector('.world')?.scrollIntoView({behavior:'smooth'});}}><span className="district-number">{d.number}</span><span className="district-name">{d.name}<small>{d.subtitle}</small></span><span className="district-arrow"><ArrowUpRight size={18}/></span></button>)}</div></section>
    <section className="closing" id="about"><div className="closing-mark">A</div><span className="section-kicker">NOT A PLACE ON A MAP</span><h2>Made for the<br/><i>joy of wandering.</i></h2><p>ATLAS is an imagined coastal city — a living study of architecture, atmosphere, and the small discoveries that make a place feel like yours.</p><a href="#explore" className="closing-link">RETURN TO THE CITY <ArrowUpRight size={15}/></a></section>
    <footer><a className="footer-brand" href="#explore">ATLAS<span>.</span></a><span>AN IMAGINED MEDITERRANEAN CITY</span><span>BUILT TO BE EXPLORED © 2026</span></footer>
  </main>;
}