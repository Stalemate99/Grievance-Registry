// console.log(exd+"Hello wordl");

var main = sel("#main");
var finish = sel("#fnhbtn");


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