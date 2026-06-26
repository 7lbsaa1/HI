import { gsap } from "gsap";

class NavigationController {

constructor(){

this.header=document.getElementById("globalHeader");

this.links=document.querySelectorAll(".desktop-nav a");

this.mobileButton=document.querySelector(".mobile-menu-btn");

this.mobileMenu=document.querySelector(".mobile-menu");

this.lastScroll=0;

this.ticking=false;

this.initialize();

}

initialize(){

this.hideOnScroll();

this.activeLinks();

this.glassEffect();

this.mobileNavigation();

this.outsideClick();

this.keyboardNavigation();

this.smoothAnchors();

this.rtlSupport();

this.scrollShadow();

}
hideOnScroll(){

if(!this.header) return;

window.addEventListener("scroll",()=>{

if(!this.ticking){

requestAnimationFrame(()=>{

const current=window.scrollY;

if(current>this.lastScroll&&current>120){

this.header.classList.add("nav-hidden");

}else{

this.header.classList.remove("nav-hidden");

}

this.lastScroll=current;

this.ticking=false;

});

this.ticking=true;

}

},{passive:true});

}

glassEffect(){

if(!this.header) return;

window.addEventListener("scroll",()=>{

if(window.scrollY>30){

this.header.classList.add("glass");

}else{

this.header.classList.remove("glass");

}

},{passive:true});

}

activeLinks(){

const sections=document.querySelectorAll("section[id]");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const top=section.offsetTop-150;

const height=section.offsetHeight;

if(window.scrollY>=top&&window.scrollY<top+height){

current=section.id;

}

});

this.links.forEach(link=>{

link.classList.remove("active");

const href=link.getAttribute("href");

if(href==="#"+current){

link.classList.add("active");

}

});

},{passive:true});

}
  mobileNavigation(){

if(!this.mobileButton||!this.mobileMenu) return;

this.mobileButton.addEventListener("click",()=>{

const opened=this.mobileMenu.classList.toggle("active");

this.mobileButton.classList.toggle("active");

document.body.classList.toggle("menu-open");

gsap.to(this.mobileMenu,{

opacity:opened?1:0,

y:opened?0:-30,

duration:.45,

ease:"power3.out"

});

});

const links=this.mobileMenu.querySelectorAll("a");

links.forEach(link=>{

link.addEventListener("click",()=>{

this.mobileMenu.classList.remove("active");

this.mobileButton.classList.remove("active");

document.body.classList.remove("menu-open");

});

});

}

outsideClick(){

if(!this.mobileMenu) return;

document.addEventListener("click",(e)=>{

if(!this.mobileMenu.classList.contains("active")) return;

const inside=this.mobileMenu.contains(e.target);

const button=this.mobileButton.contains(e.target);

if(!inside&&!button){

this.mobileMenu.classList.remove("active");

this.mobileButton.classList.remove("active");

document.body.classList.remove("menu-open");

}

});

}

keyboardNavigation(){

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

this.mobileMenu?.classList.remove("active");

this.mobileButton?.classList.remove("active");

document.body.classList.remove("menu-open");

}

});

}

smoothAnchors(){

document.querySelectorAll('a[href^="#"]').forEach(link=>{

link.addEventListener("click",(e)=>{

const target=document.querySelector(

link.getAttribute("href")

);

if(!target) return;

e.preventDefault();

target.scrollIntoView({

behavior:"smooth",

block:"start"

});

});

});

}

rtlSupport(){

const rtl=document.documentElement.dir==="rtl";

if(!rtl) return;

this.header?.classList.add("rtl-navbar");

}

scrollShadow(){

if(!this.header) return;

window.addEventListener("scroll",()=>{

if(window.scrollY>80){

this.header.style.boxShadow=

"0 10px 35px rgba(0,0,0,.12)";

}else{

this.header.style.boxShadow="none";

}

},{passive:true});

}

destroy(){

window.removeEventListener("scroll",this.hideOnScroll);

window.removeEventListener("scroll",this.glassEffect);

window.removeEventListener("scroll",this.activeLinks);

}
  export const navigationController =
new NavigationController();
  
