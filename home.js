function sel(d){
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
var myuploader=sel(".fileupload");

sub.addEventListener("click",()=>{
var file=myuploader.files[0];
    console.log(file);
    var storageRef = firebase.storage().ref("images/"+file.name);
    var task = storageRef.put(file);

    task.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
        });
      });
});


v.addEventListener("click",()=>{
    count = count+1;
    num.innerHTML=count;
});




