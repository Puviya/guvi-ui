var session_id = window.localStorage.getItem('key');
var changes;
let video, quiz;

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
    current_date = new Date().getTime();
    window.localStorage.setItem("time",current_date);
  },1000)
}

function getDetails(course_id){
    let status;
    if (course_id=="") {
      $("#error").html("<center><br>Course ID is required</center>");
    }
    else {
      const url = new URL(window.location.href)
      const id = url.searchParams.get("courseId") || "";
      if(id == "" || id != course_id){
        url.searchParams.set("courseId", course_id);
        window.history.pushState({}, '', url)
      }
      // else{
      //   if(url.searchParams.get("courseId")!=course_id){
      //     url.searchParams.set("course_id") = course_id;
      //   }
      // }
      

      var dict = {"course_id": course_id, "session_id": session_id};
      // document.getElementById("loader").style.display = "block";
      $("#spining").show();
      $("#loader").show();
      $.ajax({
        method: 'POST',
        url: 'http://127.0.0.1:5000/course_status',
        datatype: 'JSON',
        data: JSON.stringify(dict),
        contentType: "application/json",
        success: function (data) {
          status = data.status;
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
                    document.getElementById("update_btn").disabled = false;
                    document.getElementById("updatesstatus").style.color = "green";
                  
                  }
                  else {
                    $("#updatesstatus").html("Unavailable");
                    document.getElementById("update_btn").disabled = true;
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
                  video = data;
                  if(data.status == true || data.status == false){
                    $("#livestatusstatus").html("Live");
                    document.getElementById("livestatusstatus").style.color = "green";
                  }
                  else if(data.status == null){
                    $("#livestatusstatus").html("No Live");
                    document.getElementById("livestatusstatus").style.color = "red";
                  }

                  if(data.status == true){
                    document.getElementById("video_check").style.display = "block"
                  }
                  else if(data.status == false){
                    document.getElementById("video_link").innerHTML = "(Video availability)";
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
                  quiz = data;
                  if(data.status == true){
                    document.getElementById("quiz_check").style.display = "block"
                  }
                  else if(data.status == false){
                    document.getElementById("quiz_link").innerHTML = "(Quiz availability)";
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

                  if(video.status == true && quiz.status == true && data.status == true){
                    document.getElementById("live_check").style.display = "block";
                  }else {
                    document.getElementById("live_check").style.display = "none";
                    document.getElementById("live_close").style.display = "block";
                  }
                }
            },()=>{});
            $("#loader").hide()
            $("#spining").hide();
            if(new URL(window.location.href).searchParams.get("courseId")==course_id){
              document.querySelector(".content").style.display = "none";
              document.querySelector(".container").style.display = "block";
              $("#coursenamestatus").html(data.course_name);
              $("#courseidstatus").html(data.course_id);
              $("#courselangstatus").html(data.lang);
              logo_url="https://static.guvi.in/course-thumbnail/webps/"+data.logo+".webp";
              document.getElementById("image_preview").src=logo_url;
            }
            else{
              console.log("check url");
            }
          })
          
          }else if(data.status == "invalid"){
            $("#error").html("<center><br>Invalid Course ID</center>");
            document.querySelector(".container").style.display = "none";
            document.querySelector(".content").style.display = "block";
          }
          $("#loader").hide();
          $("#spining").hide();
        },
        error: function(response){
         alert(response)
        }
      });
    }

    return status;
}

function checkQueryParams(){
  const course_id = new URL(window.location.href).searchParams.get("courseId") || "";
  
  if(course_id != ""){
    document.querySelector(".content").style.display = "none";
    getDetails(course_id);
  }

}

$(document).ready(function () {
  $("#loader").hide();
  checkQueryParams();

  $("#course_form").submit(function (e) {
    e.preventDefault();
    var course_id = document.getElementById("courseId").value;
    getDetails(course_id);
  });

  window.addEventListener('popstate', (event) => {
    const url = window.location.href.split("?")[0];
    window.location.href =  url;
  });

});

function update(){
  if(changes.status == true){
    $.ajax({
      method: 'POST',
      url: 'http://127.0.0.1:5000/update',
      datatype: 'json',
      data: JSON.stringify(changes.values),
      contentType: "application/json",
      success: function (data) {
        $("#loading").hide();
        if(data.update_status == "success"){
          alert("Update success!!!!");
        }
      }
    })
  }
}

function check_video(){
  if(video.status == false){
    var head = `<table class="table table-striped">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Remarks</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody id="video-body"></tbody>
                </table>`

    $(".modal-body").empty();
    $(".modal-title").empty();
    $(".modal-title").html("Youtube link available");
    $(".modal-body").html(head);
      Object.keys(video.values).forEach(element => {
        var row =  `<tr><td >${video.values[element].title}</td>`;
        if (video.values[element].is_yt_video == true){
          row += `<td >youtube video</td>`;
        }
        else{
          row += `<td>No video</td>`;
        }
        
        row += `<td >${video.values[element].video_url}</td></tr>`;
     $("#video-body").append(row);
      });
  }
}

function check_quiz(){
  //quiz.values={"0":{"topic":"jdvjfbv"},"1":{"topic":"cbdjbcd"}}
  if(quiz.status == false){
    var head = `<table id="urls" class="table table-striped">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody id="quiz-body"></tbody>
                </table>`

    $(".modal-body").empty();
    $(".modal-title").empty();
    $(".modal-title").html("Quiz");
    $(".modal-body").html(head);
      Object.keys(quiz.values).forEach(element => {
        var row =  `<tr><td >${quiz.values[element].lessonId}</td>
                    <td >Missing</td></tr>`;

     $("#quiz-body").append(row);
      });
  }
   

  }

function showChanges(){
  $(".modal-body").empty();
  $(".modal-title").empty();

  if(changes.status == true){
    var head = `<table class="table table-bordered">
    <thead>
        <tr >
            <th  scope="col">Field</th>
            <th  scope="col">Action</th>
            <th  scope="col">Course ID</th>
            <th  scope="col">Database</th>
            <th  scope="col">Lession ID</th>
            <th  scope="col">New</th>
            <th  scope="col">Previous</th>
          </tr>
        </thead>
        <tbody id="table"></tbody>
    </tbody>
  </table>`
    $(".modal-title").html("Changes");
    $(".modal-body").html(head);
    appendTable(changes.values);
    // flag = 1;
    
  }  
  else{
    $(".modal-title").html("Message");
    $(".modal-body").html("No Update Available");
  }
}

function appendTable(data){
  const arr = ["Field","action","course_id","db","lessonId","new","previous"];
  Object.keys(data).forEach(element => {
    var row = "<tr>";//row ="";
    arr.forEach(e=>{
      var row_data;
      if(data[element].hasOwnProperty(e))
        row_data = data[element][e]
      else{
        row_data = "-";
      }
      row =  row + "<td >"+row_data+"</td>"
  })
    $("#table").append(row+"</tr>");
    //`<tr>{row}</tr>`
  });
}

function appendVideo(){

  var head = `<table id="urls" class="table table-striped">
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Topic</th>
                </tr>
              </thead>
              <tbody id="video-body"></tbody>
              </table>`

  $(".modal-body").empty();
  $(".modal-title").empty();
  $(".modal-title").html("Youtube link available");
  $(".modal-body").html(head);

}

