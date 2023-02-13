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
        // form_data = new FormData();
        // form_data.append("username",$('#username').val());
        // form_data.append('password',$('#password').val());
        const data = {"username":$("#username").val(),"password":$("#password").val()}

        
        $.ajax({
            type : 'POST',
            url : 'http://localhost:5000/login',
            // headers: {
            //     'Content-Type': 'multipart/form-data/application/json'
            // },
            //data : JSON.stringify(data),
            data : $("#datas").serialize(),
            // data : {
            //     username:$('#username').val(),
            //     password:$('#password').val()
            // },
            //datatype : 'JSON',
            //data : data,
            processData : false,
            success:function(data){
                console.log(data);
                console.log(data['status']);
                if(data['status']=="success" || data['status']=="exists"){
                    window.location.href='course_id.html'
                    console.log("success") 
                    localStorage.setItem('key', data['key'])
                }else if(data['status']=="incorrect"){
                    $("#error").html("Password incorrect")
                }else if(data['status']=="invalid"){
                    $("#error").html("Invalid Username")
                }
            },
            error: function(response){
                console.log(response)
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