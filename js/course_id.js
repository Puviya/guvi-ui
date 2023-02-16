var session_id = window.localStorage.getItem('key');
var changes;


if (!session_id) {
    var page = "./login.html";
    window.location.href = page;
}

else {
  
  const toMilliseconds = (hrs,min,sec) => (hrs*60*60+min*60+sec)*1000;
  let hr=toMilliseconds(0,15,0);
  var dict = {"session_id":session_id};
  var prev = window.localStorage.getItem("time")
   if (prev) {
    var ses_time = new Date().getTime();
    if (ses_time-prev>=hr) {
      $.ajax({
        method: 'POST',
        url: "http://127.0.0.1:5000/session_delete",
        data: JSON.stringify(dict),
        success: function (res) {
          window.localStorage.removeItem("key");
          window.localStorage.removeItem("time");
          var page = "./login.html";
          window.location.href = page;
        }
  })
    }
    
   
  } 
  
  window.setInterval(function(){
    current_date = new Date().getTime()
    window.localStorage.setItem("time",current_date)
    
    
  },1000)
}

$(document).ready(function () {
  $("#course_form").submit(function (e) {
    e.preventDefault();
    var course_id = document.getElementById("courseId").value;
    if (course_id=="") {
      $("#error").html("<center><br>Course ID is required</center>");
    }
    else {
      var dict = {"course_id": $("#courseId").val(), "session_id": session_id};
      $("#spining").show();
      $.ajax({
        method: 'POST',
        url: 'http://127.0.0.1:5000/course_status',
        datatype: 'JSON',
        data: JSON.stringify(dict),
        contentType: "application/json",
        success: function (data) {
          if (data.status == "success") {
            //document.getElementById("course_id_page").style.display = "none";
            $.when(
              $.ajax({
                method: "POST",
                url: 'http://127.0.0.1:5000/course_changes',
                datatype: 'JSON',
                data: JSON.stringify(dict),
                contentType: "application/json",
                success: function(data){
                  changes = data;
                  if (data.status == true) {
                    $("#updatesstatus").html("Available");
                    document.getElementById("updatesstatus").style.color = "green";
                  
                  }
                  else {
                    $("#updatesstatus").html("Unavailable");
                    document.getElementById("updatesstatus").style.color = "red";
                  }
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

                  if(data.status == true){
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
            },()=>{});
            $("#spining").hide();
            document.querySelector(".content").style.display = "none";
             document.querySelector(".container").style.display = "block";
            $("#coursenamestatus").html(data.course_name);
            $("#courseidstatus").html(data.course_id);
            $("#courselangstatus").html(data.lang);
            logo_url="https://static.guvi.in/course-thumbnail/webps/"+data.logo+".webp";
            document.getElementById("image_preview").src=logo_url;
          })
          
          }else if(data.status == "invalid"){
            $("#error").html("<center><br>Invalid Course ID</center>");
          }
          $("#spining").hide();
        },
        error: function(response){
         alert(response)
        }
      });
        }
       
          
      });
    
  });



function update(){
  //prompt("Changes :\n", JSON.stringify(changes));
  $.ajax({
    method: 'POST',
    url: 'http://127.0.0.1:5000/update',
    datatype: 'json',
    data: JSON.stringify(updates_det),
    contentType: "application/json",
    success: function (data) {
      $("#loading").hide();
      if(data.update_status == "update_success"){
        alert("Update success!!!!");
        window.location.href = "course_id.html";
      }
    }

  })
}
function check_video(){
  $.ajax({
method:'POST',
url: 'http://127.0.0.1:5000/check_video',
datatype: 'JSON',
data: {"course_id":course_id},
contentType: "application/json",
success: function (data) {
//data={"status":false,"values":{"0":{"is_yt_video":true,"title":"AI for India","video_url":"v=nfjnvjfnvj"},"1":{"is_yt_video":false,"video_url":"v=nfjnvjfnvj"}}};
if (data.status == true) {
document.getElementById("video_check").style.display = "block";
}
else {
document.getElementById("video_status").style.display = "block";
document.getElementById("video_close").style.display = "block";
document.getElementById("video_check").style.display = "none";
var i=Object.keys(data.values).length;
for (j=0;j<i;j++){
  str=j.toString();
  console.log(data.values[str]['is_yt_video']);
if(data.values[str]['is_yt_video']){
  document.getElementById('urls').appendChild(document.createElement('tr'));
  document.getElementById('urls').appendChild(document.createElement('th')).innerHTML=data.values[str]['video_url'];
  document.getElementById('urls').appendChild(document.createElement('th')).innerHTML=data.values[str]['title'];
    }
}
}
}
})
}
function check_quiz(){
  $.ajax({
    method:'POST',
    url: 'http://127.0.0.1:5000/check_quiz',
    datatype: 'JSON',
    data: {"course_id":course_id},
    contentType: "application/json",
    success: function (data) {
      if (data.status == "True") {
    document.getElementById("quiz_check").style.display = "block";

  }
  else {
    document.getElementById("quiz_status").style.display = "block";
document.getElementById("quiz_close").style.display = "block";
document.getElementById("quiz_check").style.display = "none";
var i=Object.keys(data.values).length;
for (j=0;j<i;j++){
  str=j.toString();
  console.log(data.values[str]['lessonId']);
  document.getElementById('lessons').appendChild(document.createElement('tr'));
  document.getElementById('urls').appendChild(document.createElement('th')).innerHTML=data.values[str]['lessonId'];
    
}
   
}
    }
  })
  }
function showChanges(){
  if(changes.status == true){
    appendTable(changes.values);
  }  
  else{
    $(".modal-body").empty();
    $(".modal-title").empty();

    $(".modal-title").html("Message");
    $(".modal-body").html("No Update Available");
  }
}

function appendTable(data){
  Object.keys(data).forEach(element => {
      var row =  `<tr>
          <td >${data[element].db}</td>
          <td >${data[element].lesson_id}</td>
          <td >${data[element].Field}</td>
          <td >${data[element].previous}</td>
          <td >${data[element].new}</td>
      </tr>`
 $("#table").append(row);
  });
}

// function byPassSecondPage(){
//   document.querySelector(".content").style.display = "none";
//   $("#coursenamestatus").html("data.course_name");
//   $("#courseidstatus").html("data.course_id");
//   $("#courselangstatus").html("data.lang");

//   $("#livestatusstatus").html("Live");

//   $("#livestatusstatus").html("No Live");

//   $("#updatesstatus").html("Available");
//   document.getElementById("live_check").style.display = "block";
//   document.getElementById("live_close").style.display = "block";
//   //updateBtn.disabled = false;
//   document.getElementById("video_check").style.display = "block";
//   document.querySelector(".container").style.display = "block";
// }