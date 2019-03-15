// console.log(exd+"Hello wordl");

var main = sel("#main");
var oatag = sel("#exmdl");
var exclsbtn = sel("#exmdlclsbtn");
var imgs = sel("#imgs");
var apt = sel("#aptbtn");
var finish = sel("#fnhbtn");


// console.log(firebase);
exclsbtn.addEventListener('click', () => {
    main.removeAttribute("style", "display:none");
    oatag.setAttribute("style", "display:none");
});

apt.addEventListener("click", () => {
    apt.setAttribute("style", "display:none");
    finish.removeAttribute("style", "display:none");
    finish.setAttribute("style", "border-radius: 15px;font-size: 16px");
});

finish.addEventListener("click", () => {
    finish.setAttribute("style", "display:none");
    apt.removeAttribute("style", "display:none");
    apt.setAttribute("style", "border-radius: 15px;font-size: 16px");
});

var card = sel("#cardtemplate").innerHTML;

function populate(problemid, title, district, location, date, message, upvotes) {
    card = card.replace("{{title}}", title);
    card = card.replace("{{complaintmessage}}", message);
    card = card.replace("{{district}}", district);
    card = card.replace("{{location}}", location);
    card = card.replace("{{date}}", date);
    card = card.replace("{{count}}", upvotes);
    main.innerHTML = card;

}

(function () {

    populate(1, "sewage", "chennai", "choolaimedu", "20-oct-2019", "hi there", 5);
    var exd = sel("#expand");
    console.log(exd);
    exd.addEventListener("click", () => {
        main.setAttribute("style", "display:none");
        oatag.removeAttribute("style", "display:none");
    });
})();


function sel(d) {
    return document.querySelector(d);
}