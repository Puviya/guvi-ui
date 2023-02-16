var session_id = window.localStorage.getItem('key');

if (session_id) {
    var page = "./course_id.html";
    window.location.href = page;
}

// Document is ready
var session_id = window.localStorage.getItem('key');

if (session_id) {
    var page = "./course_id.html";
    window.location.href = page;
}
var session_id = window.localStorage.getItem('key');

if (session_id) {
    var page = "./course_id.html";
    window.location.href = page;
}
$(document).ready(function () {
    $("#btnlogin").click(function () {
        $("#loading").show();
        if($("#username").val()=="" && $("#password").val()==""){
            $("#error").html("All fields are required")
        }
        else if(($("#username").val()).trim()==""){
            $("#error").html("Username is required")
        }else if(($("#password").val()).trim()==""){
            $("#error").html("Password is required")
        }
        else{
        const data = {"username":$("#username").val(),"password":$("#password").val()}
        $.ajax({
            type : 'POST',
            url : 'http://localhost:5000/login',
            data : JSON.stringify(data),
            dataType: "JSON",
            contentType: "application/json",
            processData : false,
            success:function(data){
                $("#loading").hide();
                if(data['status']=="success" && data["key"] != null){
                    localStorage.setItem('key', data['key']);
                    window.location.href='course_id.html';  
                }else if(data['status']==null && data["key"] == null){
                    $("#error").html("Redis server error")
                }else if(data['status']=="exists"){
                    window.location.href='course_id.html';
                }else if(data['status']=="incorrect"){
                    $("#error").html("Password incorrect")
                }else if(data['status']=="invalid"){
                    $("#error").html("Invalid Username")
                }
            },
            error: function(response){
                console.log(response)
            }
        }); }
    });
});
