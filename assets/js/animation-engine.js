import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class AnimationEngine {

constructor(){

    this.initialize();

}

initialize(){

    this.heroAnimation();

    this.splitTitles();

    this.fadeAnimations();

    this.scaleAnimations();

    this.blurAnimations();

    this.rotateAnimations();

    this.imageReveal();

    this.parallaxImages();

    this.productCards();

    this.categoryCards();

    this.statistics();

    this.marquee();

    this.scrollProgress();

    this.scrollVelocityEffects();

    this.mouseParallax();

    this.floatingElements();

    this.staggerGrid();

    this.horizontalSections();

    this.heroZoom();

    this.magneticButtons();

    this.revealCards();

    this.revealSections();

    this.textMaskReveal();

    this.imageZoomOnScroll();

    this.footerReveal();

    this.backToTopAnimation();

    this.lazyAnimations();

    this.pageTransitions();

    this.syncLenis();

    this.observeDom();

    this.refreshTriggers();

    this.optimizeMedia();

    this.gpuAcceleration();

    this.performanceMode();

    this.refresh();

}

  heroAnimation(){

const hero=document.querySelector(".hero-content-alignment");

if(!hero) return;

const tl=gsap.timeline();

tl.from(".hero-label",{

opacity:0,

y:40,

duration:.8,

ease:"power3.out"

})

.from(".hero-main-title",{

opacity:0,

y:70,

duration:1,

ease:"power4.out"

},"-=.35")

.from(".hero-description",{

opacity:0,

y:50,

duration:.8,

ease:"power3.out"

},"-=.5")

.from(".hero-actions .premium-btn,.hero-actions .premium-btn-outline",{

opacity:0,

y:40,

stagger:.15,

duration:.8,

ease:"power3.out"

},"-=.4");

}

splitTitles(){

const titles=document.querySelectorAll(".split-title");

titles.forEach(title=>{

if(typeof SplitType==="undefined") return;

const split=new SplitType(title,{

types:"chars,words"

});

gsap.from(split.chars,{

opacity:0,

y:60,

rotateX:-90,

transformOrigin:"0% 50%",

duration:1,

stagger:.03,

ease:"power4.out",

scrollTrigger:{

trigger:title,

start:"top 85%"

}

});

});

}

fadeAnimations(){

gsap.utils.toArray(".fade-up").forEach(el=>{

gsap.fromTo(el,

{

opacity:0,

y:60

},

{

opacity:1,

y:0,

duration:1,

ease:"power3.out",

scrollTrigger:{

trigger:el,

start:"top 88%",

toggleActions:"play none none reverse"

}

});

});

}

scaleAnimations(){

gsap.utils.toArray(".scale-in").forEach(el=>{

gsap.fromTo(el,

{

opacity:0,

scale:.85

},

{

opacity:1,

scale:1,

duration:1,

ease:"power4.out",

scrollTrigger:{

trigger:el,

start:"top 85%"

}

});

});

}

blurAnimations(){

gsap.utils.toArray(".blur-in").forEach(el=>{

gsap.fromTo(el,

{

opacity:0,

filter:"blur(15px)"

},

{

opacity:1,

filter:"blur(0px)",

duration:1,

ease:"power4.out",

scrollTrigger:{

trigger:el,

start:"top 90%"

}

});

});

}

rotateAnimations(){

gsap.utils.toArray(".rotate-in").forEach(el=>{

gsap.fromTo(el,

{

opacity:0,

rotate:-6,

y:50

},

{

opacity:1,

rotate:0,

y:0,

duration:1,

ease:"power3.out",

scrollTrigger:{

trigger:el,

start:"top 88%"

}

});

});

}

refresh(){

ScrollTrigger.refresh();

}

}

export const animationEngine=new AnimationEngine();
imageReveal(){

gsap.utils.toArray(".image-mask").forEach(mask=>{

gsap.fromTo(mask,

{

clipPath:"polygon(0 100%,100% 100%,100% 100%,0 100%)"

},

{

clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)",

duration:1.4,

ease:"power4.out",

scrollTrigger:{

trigger:mask,

start:"top 85%",

toggleActions:"play none none reverse"

}

});

});

}

parallaxImages(){

gsap.utils.toArray("[data-parallax-strength]").forEach(card=>{

const img=card.querySelector(".luxury-card-img");

if(!img) return;

const strength=parseFloat(

card.dataset.parallaxStrength||20

);

gsap.fromTo(img,

{

yPercent:-strength,

scale:1.15

},

{

yPercent:strength,

scale:1,

ease:"none",

scrollTrigger:{

trigger:card,

start:"top bottom",

end:"bottom top",

scrub:true

}

});

});

}

productCards(){

gsap.utils.toArray(".product-card").forEach((card,index)=>{

gsap.from(card,{

opacity:0,

y:80,

scale:.9,

duration:1,

delay:index*.05,

ease:"power4.out",

scrollTrigger:{

trigger:card,

start:"top 88%"

}

});

});

}

categoryCards(){

gsap.utils.toArray(".category-card").forEach((card,index)=>{

gsap.from(card,{

opacity:0,

y:70,

duration:1,

delay:index*.08,

ease:"power3.out",

scrollTrigger:{

trigger:card,

start:"top 90%"

}

});

});

}

statistics(){

gsap.utils.toArray("[data-counter]").forEach(counter=>{

const target=Number(counter.dataset.counter);

const obj={value:0};

gsap.to(obj,{

value:target,

duration:2,

ease:"power2.out",

snap:"value",

scrollTrigger:{

trigger:counter,

start:"top 85%"

},

onUpdate(){

counter.textContent=obj.value;

}

});

});

}

marquee(){

const track=document.querySelector(".marquee-track");

if(!track) return;

gsap.to(track,{

xPercent:-50,

ease:"none",

repeat:-1,

duration:20

});

}

scrollProgress(){

const bar=document.getElementById("scrollBar");

if(!bar) return;

ScrollTrigger.create({

start:0,

end:"max",

onUpdate:self=>{

gsap.set(bar,{

width:(self.progress*100)+"%"

});

}

});

}
scrollVelocityEffects(){

let lastScroll=0;
let velocity=0;

window.addEventListener("scroll",()=>{

const current=window.scrollY;

velocity=current-lastScroll;

lastScroll=current;

gsap.to(".hero-video-asset",{

scale:1+Math.min(Math.abs(velocity)*0.00015,.08),

duration:.35,

overwrite:true

});

});

}

mouseParallax(){

const hero=document.querySelector(".hero-viewport-section");

if(!hero) return;

const layers=hero.querySelectorAll("[data-depth]");

hero.addEventListener("mousemove",(e)=>{

const x=e.clientX/window.innerWidth-.5;
const y=e.clientY/window.innerHeight-.5;

layers.forEach(layer=>{

const depth=Number(layer.dataset.depth)||20;

gsap.to(layer,{

x:x*depth,

y:y*depth,

duration:1,

ease:"power3.out"

});

});

});

}

floatingElements(){

gsap.utils.toArray(".floating").forEach(el=>{

gsap.to(el,{

y:-20,

duration:2,

repeat:-1,

yoyo:true,

ease:"sine.inOut"

});

});

}

staggerGrid(){

gsap.utils.toArray(".grid-layout-four-col").forEach(grid=>{

const items=grid.children;

gsap.from(items,{

opacity:0,

y:60,

stagger:.12,

duration:.9,

ease:"power3.out",

scrollTrigger:{

trigger:grid,

start:"top 80%"

}

});

});

}

horizontalSections(){

gsap.utils.toArray(".horizontal-scroll").forEach(section=>{

const wrapper=section.querySelector(".horizontal-wrapper");

if(!wrapper) return;

const distance=wrapper.scrollWidth-window.innerWidth;

gsap.to(wrapper,{

x:-distance,

ease:"none",

scrollTrigger:{

trigger:section,

start:"top top",

end:()=>"+="+distance,

scrub:true,

pin:true,

invalidateOnRefresh:true

}

});

});

}

heroZoom(){

const hero=document.querySelector(".hero-video-asset");

if(!hero) return;

gsap.fromTo(hero,

{

scale:1.2

},

{

scale:1,

ease:"none",

scrollTrigger:{

trigger:".hero-viewport-section",

start:"top top",

end:"bottom top",

scrub:true

}

});

}

refreshOnResize(){

window.addEventListener("resize",()=>{

ScrollTrigger.refresh();

});

}

performanceMode(){

gsap.ticker.fps(60);

gsap.config({

force3D:true,

nullTargetWarn:false

});

}
magneticButtons(){

const buttons=document.querySelectorAll(".magnetic");

buttons.forEach(button=>{

button.addEventListener("mousemove",(e)=>{

const rect=button.getBoundingClientRect();

const x=e.clientX-rect.left-rect.width/2;

const y=e.clientY-rect.top-rect.height/2;

gsap.to(button,{

x:x*0.35,

y:y*0.35,

duration:.4,

ease:"power3.out"

});

});

button.addEventListener("mouseleave",()=>{

gsap.to(button,{

x:0,

y:0,

duration:.6,

ease:"elastic.out(1,0.4)"

});

});

});

}

revealCards(){

gsap.utils.toArray(".glass-card,.product-card,.category-card").forEach(card=>{

gsap.from(card,{

opacity:0,

y:80,

scale:.95,

duration:1,

ease:"power4.out",

scrollTrigger:{

trigger:card,

start:"top 88%"

}

});

});

}

revealSections(){

gsap.utils.toArray("section").forEach(section=>{

gsap.from(section,{

opacity:0,

duration:1,

ease:"power2.out",

scrollTrigger:{

trigger:section,

start:"top 92%"

}

});

});

}

textMaskReveal(){

gsap.utils.toArray(".mask-title").forEach(title=>{

gsap.set(title,{

overflow:"hidden"

});

const inner=title.querySelector("span")||title;

gsap.from(inner,{

yPercent:120,

duration:1.2,

ease:"power4.out",

scrollTrigger:{

trigger:title,

start:"top 85%"

}

});

});

}

imageZoomOnScroll(){

gsap.utils.toArray(".zoom-scroll").forEach(img=>{

gsap.fromTo(img,

{

scale:1.25

},

{

scale:1,

ease:"none",

scrollTrigger:{

trigger:img,

start:"top bottom",

end:"bottom top",

scrub:true

}

});

});

}

footerReveal(){

const footer=document.querySelector(".main-footer");

if(!footer) return;

gsap.from(footer,{

opacity:0,

y:120,

duration:1.2,

ease:"power4.out",

scrollTrigger:{

trigger:footer,

start:"top 92%"

}

});

}

backToTopAnimation(){

const button=document.querySelector(".back-to-top");

if(!button) return;

ScrollTrigger.create({

start:400,

onUpdate:self=>{

button.classList.toggle("show",self.scroll()>400);

}

});

button.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

lazyAnimations(){

const lazy=document.querySelectorAll("[data-lazy]");

lazy.forEach(item=>{

ScrollTrigger.create({

trigger:item,

start:"top 90%",

once:true,

onEnter:()=>{

item.classList.add("loaded");

}

});

});

}

pageTransitions(){

if(!document.startViewTransition) return;

document.querySelectorAll("a[data-transition]").forEach(link=>{

link.addEventListener("click",(e)=>{

const href=link.getAttribute("href");

if(!href||href.startsWith("#")) return;

e.preventDefault();

document.startViewTransition(()=>{

window.location.href=href;

});

});

});

}
syncLenis(){

if(typeof Lenis==="undefined") return;

this.lenis=new Lenis({

duration:1.2,

smoothWheel:true,

touchMultiplier:2,

gestureOrientation:"vertical",

orientation:"vertical",

infinite:false,

});

const raf=(time)=>{

this.lenis.raf(time);

requestAnimationFrame(raf);

};

requestAnimationFrame(raf);

this.lenis.on("scroll",ScrollTrigger.update);

gsap.ticker.add((time)=>{

this.lenis.raf(time*1000);

});

gsap.ticker.lagSmoothing(0);

}

observeDom(){

const observer=new MutationObserver(()=>{

ScrollTrigger.refresh();

});

observer.observe(document.body,{

childList:true,

subtree:true,

attributes:true

});

this.observer=observer;

}

refreshTriggers(){

window.addEventListener("load",()=>{

ScrollTrigger.refresh(true);

});

window.addEventListener("orientationchange",()=>{

setTimeout(()=>{

ScrollTrigger.refresh(true);

},300);

});

}

optimizeMedia(){

document.querySelectorAll("img").forEach(img=>{

img.loading="lazy";

img.decoding="async";

});

document.querySelectorAll("video").forEach(video=>{

video.setAttribute("playsinline","");

video.preload="metadata";

});

}

gpuAcceleration(){

gsap.set(

".product-card,.category-card,.glass-card,.hero-video-asset,.luxury-card-img",

{

force3D:true,

willChange:"transform"

}

);

}

destroy(){

ScrollTrigger.getAll().forEach(trigger=>{

trigger.kill();

});

if(this.lenis){

this.lenis.destroy();

}

if(this.observer){

this.observer.disconnect();

}

}

refresh(){

ScrollTrigger.refresh(true);

}

