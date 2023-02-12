// var id="";
function course_details() {
 
  // $.ajax({
  //   method: 'GET',
  //   url: 'courses.json',
  //   data: id,
  //   url:'courses.json',
  //   datatype:"json",
  //   success:function(res) {
  //     alert(res);
  //   }
  // })
}

$(document).ready(function () {
  
 
  $("#course_form").submit(function (e) {
    e.preventDefault();
    var course_id = document.getElementById("courseId").value;
    
    if (course_id=="") {
      $("#error").html("This Field Required");
    } else {
      var dict = {course_id : course_id};
      $.ajax({
        method:'POST',
        url: 'http://127.0.0.1:5000/course_Id',
        datatype: 'json',
        data:JSON.stringify(dict),
        contentType: "application/json",
        success: function (data) {
          alert(data.status);
          document.getElementById("course_id_page").style.display = "none";
           $("#coursenamestatus").html(data.course_name);
            $("#courseidstatus").html(data.course_id);
            $("#courselangstatus").html(data.course_language);
            $("#livestatusstatus").html(data.Live_status);
            $("#updatesstatus").html(data.Updates);
            document.getElementById("course_id_individual_page").style.display = "block";
        
        }
          
      })
 
    }
  });
});

