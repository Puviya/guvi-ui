//if changes=>alert on html else if changes is empty alert no changes
//when update button is clicked,get the 
var course_id="Pythonimg";
var update=True;
updatebtn();
function updatebtn()
{
$.ajax({
    method:"POST",
    url:"/update_concern",
    data:{"course_id":course_id,"update":update},
    datatype:"JSON",
    success:function(data){
        console.log(data["update_status"])
    }
})
}