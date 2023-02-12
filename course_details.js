var CourseID="PythonImg";
$(document).ready(function(){
    $.ajax({
        method:'GET',
        url:'courses.json',
        //data:{"courseID":CourseID},
        datatype:"json",
        success:function(data){
            console.log(data);
            $("#coursenamestatus").html(data.CourseName);
            $("#courseidstatus").html(data.CourseID);
            $("#courselangstatus").html(data.CourseLanguage);
            $("#livestatusstatus").html(data.LiveStatus);
            $("#updatesstatus").html(data.Updates);
        }
    })
});