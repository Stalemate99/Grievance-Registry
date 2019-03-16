var sigbtn = sel("#signbtn");
var logbtn = sel("#loginbtn");
var sig = sel(".signin");
var log = sel(".login");
var home = sel(".home");
var lsubmit = sel("#lsub");
var ssubmit = sel("#ssub");
var db = firebase.firestore();
var email = sel("#semail");
var password = sel("#spass");
var gid = sel("#sgid");
var did = sel("#sdis");
var logemail = sel("#lemail");
var logpass = sel("#lpass");


sigbtn.addEventListener('click', () => {
    home.setAttribute("style", "display:none");
    sig.removeAttribute("style", "display:none");
});
logbtn.addEventListener('click', () => {
    home.setAttribute("style", "display:none");
    log.removeAttribute("style", "display:none");
});
lsubmit.addEventListener("click", () => {
    signIn(logemail.value,logpass.value);
});
ssubmit.addEventListener("click", () => {
    // signIn(email.value, password.value);
    signUp(email.value, password.value);
});

function sel(tag) {
    return document.querySelector(tag);
}


///////////////////////////

let auth = firebase.auth();
var signedUp = false;
// let db = firebase.firestore();


// sel("#signup").addEventListener("click", function () {
//     regex(sel("#username").value, sel("#password").value);
// });

auth.onAuthStateChanged(function (authdata) {
    if (authdata && (!signedUp)) {
        window.open("office.html", "_self");
        return;
    } else {
        console.log("Signed out");
    }
});

function signUp(email, pass) {
    signedUp = true;

    var pro = new Promise((res, rej) => {
        console.log("hmmm");
        db.collection("districts").where("Name", "==", did.value).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
                res(doc.id);
            });
        });
    });

    pro.then(data => {
        console.log(data);
        auth.createUserWithEmailAndPassword(email, pass).then(function () {
            console.log("hmmm");
            console.log( gid.value,data,email.value)
            db.collection("officer").add({

                    gid: gid.value,
                    districtid: data,
                    password: password.value,
                    email: email,
                    uid:firebase.auth().currentUser.uid
                }).then(() => window.open("office.html", "_self"))
                .catch(err=>console.log(err));          
        })
    });

}
// auth.createUserWithEmailAndPassword(email, pass).then(function (authdata) {
//     return db.collection("users").add({
//         name: name,
//         email: email,
//         password: pass,
//         uid: firebase.auth().currentUser.uid
//     })
// }).then((data) => window.open("home.html", "_self"))
// .catch((err) => {
//     alert(err);
// });

// }



function signIn(email, pass) {
    auth.signInWithEmailAndPassword(email, pass).catch((err) => alert(err));
}