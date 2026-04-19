// base.js

(function(){

"use strict";

const navToggle=document.getElementById("navToggle");
const mobileNav=document.getElementById("mobileNav");
const navClose=document.getElementById("navClose");
const backToTop=document.getElementById("backToTop");
const languageOverlay=document.getElementById("languageOverlay");
const skipLanguage=document.getElementById("skipLanguage");

/* Mobile Navigation */

if(navToggle && mobileNav){
navToggle.addEventListener("click",()=>{
mobileNav.classList.add("active");
navToggle.setAttribute("aria-expanded","true");
});
}

if(navClose && mobileNav){
navClose.addEventListener("click",()=>{
mobileNav.classList.remove("active");
navToggle.setAttribute("aria-expanded","false");
});
}

/* Close nav when clicking link */

document.querySelectorAll(".mobile-nav a").forEach(link=>{
link.addEventListener("click",()=>{
mobileNav.classList.remove("active");
});
});

/* Back to Top */

window.addEventListener("scroll",()=>{
if(window.scrollY>400){
backToTop.classList.add("show");
}else{
backToTop.classList.remove("show");
}
});

if(backToTop){
backToTop.addEventListener("click",()=>{
window.scrollTo({
top:0,
behavior:"smooth"
});
});
}

/* Language Popup */

function shouldShowLanguage(){
return !localStorage.getItem("languageSelected");
}

function showLanguagePopup(){
if(languageOverlay){
languageOverlay.classList.add("active");
languageOverlay.setAttribute("aria-hidden","false");
}
}

function hideLanguagePopup(){
if(languageOverlay){
languageOverlay.classList.remove("active");
languageOverlay.setAttribute("aria-hidden","true");
localStorage.setItem("languageSelected","true");
}
}

if(shouldShowLanguage()){
setTimeout(showLanguagePopup,500);
}

if(skipLanguage){
skipLanguage.addEventListener("click",hideLanguagePopup);
}

/* Stop polling when tab hidden */

let pollInterval;

function startPolling(){
pollInterval=setInterval(()=>{
const unread=document.getElementById("navbarUnread");
if(!unread) return;

fetch("/messages/unread-count/")
.then(r=>r.json())
.then(data=>{
unread.textContent=data.count;
})
.catch(()=>{});
},15000);
}

function stopPolling(){
clearInterval(pollInterval);
}

document.addEventListener("visibilitychange",()=>{
if(document.hidden){
stopPolling();
}else{
startPolling();
}
});

startPolling();

/* Prevent double form submission */

document.querySelectorAll("form").forEach(form=>{
form.addEventListener("submit",()=>{
const btn=form.querySelector("button[type='submit']");
if(btn){
btn.disabled=true;
btn.innerText="...";
}
});
});

})(); 