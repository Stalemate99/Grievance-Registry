var v = document.querySelector("#voter");
var num = document.querySelector("#cnt");
var count = 0;
var opnmdl = document.querySelector("#viewmore1");
var atag = document.querySelector("#viewmore");
var main = document.querySelector("#main");
var clsbtn = document.querySelector("#mdlclsbtn");
var addbtn = document.querySelector("#addon");
var comp = document.querySelector("#complaint");
var addclsbtn = document.querySelector("#addmdlclsbtn");
var sub = document.querySelector("#submit");
var exd = document.querySelector("#expand");
var oatag = document.querySelector("#exmdl");
var exclsbtn = document.querySelector("#exmdlclsbtn");
var imgs = document.querySelector("#imgs");
var apt = document.querySelector("#aptbtn");
var finish = document.querySelector("#fnhbtn");

exd.addEventListener("click",()=>{
    main.setAttribute("style","display:none");
    oatag.removeAttribute("style","display:none");
});

exclsbtn.addEventListener('click',()=>{
    main.removeAttribute("style","display:none");
    oatag.setAttribute("style","display:none");
});

apt.addEventListener("click",()=>{
    apt.setAttribute("style","display:none");
    finish.removeAttribute("style","display:none");
    finish.setAttribute("style","border-radius: 15px;font-size: 16px");
});

finish.addEventListener("click",()=>{
    finish.setAttribute("style","display:none");
    apt.removeAttribute("style","display:none");
    apt.setAttribute("style","border-radius: 15px;font-size: 16px");
});

v.addEventListener("click",()=>{
    count = count+1;
    num.innerHTML=count;
});

opnmdl.addEventListener("click",()=>{
    main.setAttribute("style","display:none");
    atag.removeAttribute("style","display:none");
});

clsbtn.addEventListener('click',()=>{
    main.removeAttribute("style","display:none");
    atag.setAttribute("style","display:none");
});

addon.addEventListener("click",()=>{
    main.setAttribute("style","display:none");
    comp.removeAttribute("style","display:none");
});

addclsbtn.addEventListener('click',()=>{
    main.removeAttribute("style","display:none");
    comp.setAttribute("style","display:none");
});

submit.addEventListener('click',()=>{
    main.removeAttribute("style","display:none");
    comp.setAttribute("style","display:none");
});

if(v===null){
    num.innerHTML=" "+count;
}

