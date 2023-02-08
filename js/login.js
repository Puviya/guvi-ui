// Document is ready
$(document).ready(function () {
    $("#btnlogin").click(function () {
        //console.log("hloo")
        if($("#username").val()=="" && $("#password").val()==""){
            $("#error").html("All fields are required")
        }
        else if($("#username").val()==""){
            $("#error").hide()
            $("#passcheck").hide()
            $("#usercheck").html("Enter Username")
        }else if($("#password").val()==""){
            $("#error").hide()
            $("#usercheck").hide()
            $("#passcheck").html("Enter Password")
        }
        $.ajax({
            method : 'POST',
            url : '../course_suite/main.py',
            data : {"usernmae":$("#username").val(),"password":$("#password").val()},
            datatype : 'JSON',
            success:function(data){
                console.log(data);
                var d=JSON.parse(data);
                //console.log()
                // if(d=="success"){
                //     console.log("success");   
                // }else{
                //     console.log("incorrect");
                // }
            }
        }); 
    });
});
// function validateUsername() {
//     let usernameValue = $("#username").val();
//     if (usernameValue.length == "") {
//     $("#usercheck").show();
//     usernameError = false;
//     return false;
//     } else {
//     $("#usercheck").hide();
//     }
// }
// function validatePassword() {
//     let passwordValue = $("#password").val();
//     if (passwordValue.length == "") {
//     $("#passcheck").show();
//     passwordError = false;
//     return false;
//     }else {
//     $("#passcheck").hide();
//     }
// }