 var db = firebase.firestore();
 var idofdoc;
 var address;
 var depart;

 function initMap() {
   var geocoder = new google.maps.Geocoder;
   geocodeLatLng(geocoder);
 }

 function geocodeLatLng(geocoder) {
   navigator.geolocation.getCurrentPosition(function (data) {
     var latlng = {
       lat: parseFloat(data.coords.latitude),
       lng: parseFloat(data.coords.longitude)
     };
     geocoder.geocode({
       'location': latlng
     }, function (results, status) {
       if (status === 'OK') {
         if (results[0]) {
           address = results[0].formatted_address;
           var regex = /\d{6}/g;
           var pincode = results[0].formatted_address.match(regex)[0];
           db.collection("districts").where("pincodes", "array-contains", pincode).get()
             .then(async (qs) => {
               if (qs.size === 0) {
                 var district = await getDistrict(pincode);
                 district = district.PostOffice[0].District;
                 db.collection("districts").where("Name", "==", district).get().then((qs) => {
                   if (qs.size === 0) {
                     db.collection("districts").add({
                       Name: district,
                       pincodes: [pincode]
                     });
                   } else {
                     qs.forEach((doc) => {
                       console.log(doc);
                       db.collection("districts").doc(doc.id).update({
                         pincodes: firebase.firestore.FieldValue.arrayUnion(pincode)
                       });
                     });
                   }
                 })
               }
               db.collection("districts").where("pincodes", "array-contains", pincode).get().then((qs) => {
                 qs.forEach((doc) => {
                   console.log("District recognized");
                   idofdoc = doc.id;
                   startProcess();
                 });
               })

             });
           getDistrict(pincode);

         } else {
           window.alert('No results found');
         }
       } else {
         window.alert('Geocoder failed due to: ' + status);
       }
     });
   });

 }


 function getDistrict(pincode) {
   return new Promise((resolve, reject) => {
     fetch(`http://localhost:4000/reversegeocode/${pincode}`).then(function (response) {
       return response.json();
     }).then(function (data) {
       resolve(data);
     }).catch(function (err) {
       reject(err);
     });
   });


 }





 function sel(d) {
   return document.querySelector(d);
 }

 var v = document.querySelector("#voter");
 var num = document.querySelector("#cnt");
 var count = 0;
 var main = document.querySelector("#main");
 var clsbtn = document.querySelector("#mdlclsbtn");
 var addbtn = document.querySelector("#addon");
 var sub = document.querySelector("#submit");
 var uploaded = sel("#uploaded");
 var myuploader = sel(".fileupload");

 sub.addEventListener("click", () => {
   var file = myuploader.files[0];
   console.log(file);
   var storageRef = firebase.storage().ref("images/" + file.name);
   var task = storageRef.put(file);

   task.on('state_changed', function (snapshot) {

     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
     console.log('Upload is ' + progress + '% done');
     switch (snapshot.state) {
       case firebase.storage.TaskState.PAUSED: // or 'paused'
         console.log('Upload is paused');
         break;
       case firebase.storage.TaskState.RUNNING: // or 'running'
         console.log('Upload is running');
         break;
     }
   }, function (error) {
     console.log(error);
   }, function () {

     task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
       console.log('File available at', downloadURL);
       httpreq('http://localhost:4000/visionai', JSON.stringify({
         path: downloadURL
       })).then((data) => {

         db.collection("complaints").add({
           department: data,
           uid: firebase.auth().currentUser.uid,
           district: idofdoc,
           description: sel("#messaget").value,
           imageurl: downloadURL,
           address,
           status: "posted",
           votes: 1,
           title: sel("#title").value,
           date: firebase.firestore.FieldValue.serverTimestamp()
         }).then((d) => {
           console.log("Successfully Recorded complaint");
         });

       });
     });
   });
 });

 function httpreq(route, json) {
   var http = new Promise((res, rej) => {
     var xhttp = new XMLHttpRequest();
     xhttp.open('POST', route, true);
     xhttp.onreadystatechange = function () {
       if (this.readyState == 4 && this.status == 200) {
         res(this.response);
       } else if (this.readyState === 4 && this.status === 404) {
         rej("error:file not found");
       } else if (this.readyState === 4 && this.status === 401) {
         rej(this.response);
       }
     };

     xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
     xhttp.send(json);
   });

   return http;
 }

 function postreq(path) {
   console.log(path);
   return new Promise((res, rej) => {
     var obj = {
       path
     }
     fetch("http://localhost:3300/visionai", {
       method: 'post',
       body: JSON.stringify(obj)
     }).then((response) => response.json()).then((data) => {
       res(data);
     }).catch((err) => {
       rej(err);
     })
   });
 }

 function startProcess() {
  //  db.collection("complaints").where("district", "==", idofdoc).get().then((qs) => {
  //    qs.forEach((doc) => {
  //      var docdata = doc.data();
  //      var card = generateCard(docdata.title, docdata.description, docdata.date, docdata.department, docdata.address, docdata.status, docdata.imageurl, docdata.votes);
  //      var div = document.createElement("div");
  //      div.className = "complaintlist";
  //      div.innerHTML = card;
  //      sel(".showdown").appendChild(div);
  //    });
     db.collection("complaints").where("district", "==", idofdoc)
       .onSnapshot(function (snapshot) {
         snapshot.docChanges().forEach(function (change) {
           if (change.type === "added") {
             var docdata = change.doc.data();
            //  console.log(new Date(docdata.date.seconds*1000));
             var card = generateCard(change.doc.id,docdata.title, docdata.description, new Date(docdata.date.seconds*1000), docdata.department, docdata.address, docdata.status, docdata.imageurl, docdata.votes);
             var div = document.createElement("div");
             div.className = "complaintlist";
             div.innerHTML = card;
             sel(".showdown").appendChild(div);
           }

         });
       });
  //  }).catch(console.err);
 }

 function generateCard() {
   var temp = sel("#cardtemplate").innerHTML;
   Array.from(arguments).forEach((data, i) => {
     temp = temp.replace(/{data}/, data);
   });

   return temp;
 }

 function switchtabs(str){
  var classified= Array.from(document.querySelectorAll(".classify"));
  classified.forEach((data)=>{
    if(str=="all"){
      data.parentElement.parentElement.style.display="block";
      return ;
    }
    var surr=data.textContent.toLowerCase().split(':')[1];
    console.log(surr,str);
    if(surr!=str){
        console.log(data);
      none(data.parentElement.parentElement);
    }else{
      data.parentElement.parentElement.style.display="block";
    }
  })
 }

 function none(el){
   el.style.display="none";
 }


 

 sel("#all").addEventListener("click",function(){
   console.log("all");
switchtabs("all");
 })
 sel("#sewage").addEventListener("click",function(){
  switchtabs("sewage");

 })
 sel("#garbage").addEventListener("click",function(){
  switchtabs("garbage");

   
})
 sel("#road").addEventListener("click",function(){
  switchtabs("road maintanence");

})

sel(".showdown").addEventListener("click",function(e){
  if(e.target.id=="voter"){
    var votes=(e.target.nextElementSibling.textContent);
    var n=+votes.split(":")[1];
    var docid=e.target.parentElement.getAttribute("data-docid");
    db.collection("complaints").doc(docid).update({
      votes:n+1
    }).then(()=>{
      e.target.nextElementSibling.textContent=`votes :${n+1}`;
e.target.disabled="true";
    });

  }
});