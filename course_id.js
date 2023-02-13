var session_id = window.localStorage.getItem('key');

if (!session_id) {
    var page = "./login.html";
    window.location.href = page;
}

$(document).ready(function () {
  $("#course_form").submit(function (e) {
    e.preventDefault();
    var course_id = document.getElementById("courseId").value;
     if (course_id=="") {
      $("#error").html("This Field Required");
    } else {
       var dict = { course_id: course_id };
      
      $.ajax({
        method:'POST',
        url: 'http://127.0.0.1:5000/course_status',
        datatype: 'json',
        data:JSON.stringify(dict),
        contentType: "application/json",
        success: function (data) {
          
          if (data.status == "success") {
            alert(data.status);
            document.getElementById("course_id_page").style.display = "none";
            $("#coursenamestatus").html(data.course_name);
            $("#courseidstatus").html(data.course_id);
            $("#courselangstatus").html(data.lang);
            if (data.live == true) {
              $("#livestatusstatus").html("Live");
              document.getElementById("livestatusstatus").style.color = "green";
              document.getElementById("live_check").style.display = "block";
            } else {
              $("#livestatusstatus").html("No Live");
              document.getElementById("livestatusstatus").style.color = "red";
              document.getElementById("live_check").style.display = "none";
              document.getElementById("live_close").style.display = "block";
            }
            if (data.update == true) {
              $("#updatesstatus").html("Available");
              document.getElementById("updatesstatus").style.color = "green";
            
            }
            else {
              $("#updatesstatus").html("Un Available");
              document.getElementById("updatesstatus").style.color = "red";
            }
            if (data.video == true) {
              document.getElementById("video_check").style.display = "block";
            }
            else {
              document.getElementById("video_close").style.display = "block";
              document.getElementById("video_check").style.display = "none";
            }
            if (data.quiz == true) {
              document.getElementById("quiz_check").style.display = "block";
            }
            else {
              document.getElementById("quiz_close").style.display = "block";
              document.getElementById("quiz_check").style.display = "none";
            }

            document.getElementById("course_id_individual_page").style.display = "block";
            if (data.update == true) {
              var updates_det = {
                update: data.update
              }
              
              $.ajax({
                method: 'POST',
                url: 'http://127.0.0.1:5000/course_status',
                datatype: 'json',
                data: JSON.stringify(updates_det),
                contentType: "application/json",
                success: function (data) {
                  alert(data);
                }

              })
            }
            
          }
          else if(data.status=="invalid") {
            alert("Enter a Valid course_Id");
          }
          else if(data.status=="login"){
            window.location.href = "login.html";
          }
        }
          
      })
 
    }
  });
});

