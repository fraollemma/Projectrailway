document.addEventListener("DOMContentLoaded", () => {

const form = document.querySelector(".add-egg-form");
if(!form) return;

const submitBtn = form.querySelector('button[type="submit"]');
const clearBtn = form.querySelector(".clear-form");

const priceInput = document.getElementById("id_price_per_dozen");
const quantityInput = document.getElementById("id_min_order_quantity");
const quantityAvailableInput = document.getElementById("id_quantity_available");
const phoneInput = document.getElementById("id_phone");

/* =====================================================
VALIDATION
===================================================== */

function validateField(field){

clearError(field);

if(field.required && !field.value.trim()){
showError(field,"This field is required");
return false;
}

if(field.type === "email" && field.value){

const pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!pattern.test(field.value)){
showError(field,"Enter a valid email");
return false;
}

}

return true;

}

function showError(field,message){

field.classList.add("is-invalid");
field.setAttribute("aria-invalid","true");

const error=document.createElement("div");
error.className="invalid-feedback";
error.textContent=message;

field.parentNode.appendChild(error);

}

function clearError(field){

field.classList.remove("is-invalid");
field.removeAttribute("aria-invalid");

const err=field.parentNode.querySelector(".invalid-feedback");
if(err) err.remove();

}

/* =====================================================
FORM SUBMIT
===================================================== */

form.addEventListener("submit", e=>{

const fields=form.querySelectorAll("[required]");

let valid=true;

fields.forEach(f=>{
if(!validateField(f)) valid=false;
});

if(quantityInput && quantityInput.value < 1){
showError(quantityInput,"Minimum order must be at least 1");
valid=false;
}

if(priceInput && priceInput.value <= 0){
showError(priceInput,"Price must be greater than 0");
valid=false;
}

if(!valid){
e.preventDefault();
return;
}

submitBtn.disabled=true;
submitBtn.classList.add("loading");

});

/* =====================================================
REALTIME VALIDATION
===================================================== */

form.addEventListener("blur",e=>{
if(e.target.matches("[required]")){
validateField(e.target);
}
},true);

/* =====================================================
CLEAR FORM
===================================================== */

if(clearBtn){

clearBtn.addEventListener("click",()=>{

if(confirm("Clear all form data?")){
form.reset();
document.querySelectorAll(".invalid-feedback").forEach(el=>el.remove());
document.querySelectorAll(".is-invalid").forEach(el=>el.classList.remove("is-invalid"));
}

});

}

/* =====================================================
PHONE FORMAT
===================================================== */

if(phoneInput){

phoneInput.addEventListener("input",()=>{

let digits=phoneInput.value.replace(/\D/g,"");

if(digits.length>0){
digits=digits.match(/.{1,4}/g).join(" ");
}

phoneInput.value=digits;

});

}

/* =====================================================
TOTAL VALUE CALCULATOR
===================================================== */

if(priceInput && quantityAvailableInput){

const totalSpan=document.createElement("span");
totalSpan.className="total-value";

quantityAvailableInput.parentNode.appendChild(totalSpan);

function updateTotal(){

const quantity=parseFloat(quantityAvailableInput.value)||0;
const price=parseFloat(priceInput.value)||0;

const total=quantity*price;

totalSpan.textContent=
quantity && price
? `Total value: $${total.toFixed(2)}`
: "";

}

priceInput.addEventListener("input",updateTotal);
quantityAvailableInput.addEventListener("input",updateTotal);

updateTotal();

}

/* =====================================================
TEXTAREA COUNTER
===================================================== */

form.querySelectorAll("textarea[maxlength]").forEach(textarea=>{

const max=textarea.getAttribute("maxlength");

const counter=document.createElement("div");
counter.className="char-counter";

textarea.parentNode.appendChild(counter);

function update(){

const remaining=max-textarea.value.length;

counter.textContent=`${remaining} characters remaining`;

}

textarea.addEventListener("input",update);
update();

});

});