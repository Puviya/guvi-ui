var session_id = window.localStorage.getItem('key');
var updates_det;
var changes;

if (!session_id) {
    var page = "./login.html";
    window.location.href = page;
}

else {
  
  const toMilliseconds = (hrs,min,sec) => (hrs*60*60+min*60+sec)*1000;
  let hr=toMilliseconds(24,0,0);
  var dict = {"session_id":session_id};
  var prev = window.localStorage.getItem("time")
   if (prev) {
    var ses_time = new Date().getTime();
    console.log(ses_time)
    if (ses_time-prev>=hr) {
      console.log("hey")
      $.ajax({
        method: 'POST',
        url: "http://127.0.0.1:5000/session_delete",
        data: JSON.stringify(dict),
        success: function (res) {
          console.log(res)
          window.localStorage.removeItem("key");
          window.localStorage.removeItem("time");
          var page = "./login.html";
          window.location.href = page;
        }
  })
    }
    else {
      console.log("no")
    }
   
  } 
  
  window.setInterval(function(){
    current_date = new Date().getTime()
    //  console.log(current_date)
    window.localStorage.setItem("time",current_date)
    
    
  },1000)
}

$(document).ready(function () {
  $("#course_form").submit(function (e) {
    e.preventDefault();
    var course_id = document.getElementById("courseId").value;
    if (course_id=="") {
      $("#error").html("<br>This Field Required");
    }
    else {
      var dict = {"course_id": $("#courseId").val(), "session_id": session_id};

      $.ajax({
        method:'POST',
        url: 'http://127.0.0.1:5000/course_status',
        datatype: 'JSON',
        data: JSON.stringify(dict),
        contentType: "application/json",
        success: function(data){
          if(data.status == "success"){ 
            $.when(
              $.ajax({
                method: "POST",
                url: 'http://127.0.0.1:5000/course_changes',
                datatype: 'JSON',
                data: JSON.stringify(dict),
                contentType: "application/json",
                success: function(data){
                  console.log("working-course_changes api");
                }
              }),

              $.ajax({
                method: "POST",
                url: 'http://127.0.0.1:5000/check_video',
                datatype: 'JSON',
                data: JSON.stringify(dict),
                contentType: "application/json",
                success: function(data){
                  if(data.status == true){
                    document.getElementById("video_check").style.display = "block"
                  }
                  else{
                    document.getElementById("video_close").style.display = "block";
                    document.getElementById("video_check").style.display = "none";
                  }
                }
              }),

              $.ajax({
                method: "POST",
                url: 'http://127.0.0.1:5000/check_quiz',
                datatype: 'JSON',
                data: JSON.stringify(dict),
                contentType: "application/json",
                success: function(data){
                  if(data.status == true){
                    document.getElementById("quiz_check").style.display = "block"
                  }
                  else{
                    document.getElementById("quiz_close").style.display = "block";
                    document.getElementById("quiz_check").style.display = "none";
                  }
                }
              })
            ).then(()=>{
              $.ajax({
                type: "POST",
                url: 'http://127.0.0.1:5000/check_live',
                datatype: 'JSON',
                data: JSON.stringify(dict),
                contentType: "application/json",
                success: function(data){
                  if(data.live == true){
                    $("#livestatusstatus").html("Live");
                    document.getElementById("livestatusstatus").style.color = "green";
                    document.getElementById("live_check").style.display = "block";
                  }else {
                    $("#livestatusstatus").html("No Live");
                    document.getElementById("livestatusstatus").style.color = "red";
                    document.getElementById("live_check").style.display = "none";
                    document.getElementById("live_close").style.display = "block";
                  }
                }
            }, ()=>{});
            document.getElementById("course_id_page").style.display = "none";
            document.querySelector(".content").style.display = "none";
            $("#coursenamestatus").html(data.course_name);
            $("#courseidstatus").html(data.course_id);
            $("#courselangstatus").html(data.lang);
          }
        },
        error: function(response){
          console.log(response);
        }
          
      })
    }
  });

});

function update(){
  //prompt("Changes :\n", JSON.stringify(changes));
  $.ajax({
    method: 'POST',
    url: 'http://127.0.0.1:5000/update_concern',
    datatype: 'json',
    data: JSON.stringify(updates_det),
    contentType: "application/json",
    success: function (data) {
      if(data.update_status == "update_success"){
        alert("Update success!!!!");
        window.location.href = "course_id.html";
      }
    }

  })
}

function showChanges(){
  let old = JSON.stringify(changes['old']);
  let curr = JSON.stringify(changes['new']);

  if(old=="{}" && curr=="{}"){
    alert("No updates available");
  }
  else{
    alert("Changes :\n old : "+old +"\nNew : "+curr);
  }
  
}