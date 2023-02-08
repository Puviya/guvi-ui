

$(document).ready(function () {
  
 
  $("#course_form").submit(function (e) {
    e.preventDefault();
    var course_id = document.getElementById("courseId").value;
    
    if (course_id=="") {
      console.log("empty")
    } else {
      console.log(course_id);
      document.getElementById("course_id_page").style.display = "none";
      document.getElementById("course_id_individual_page").style.display="block";
 
 
    }
  });
});

