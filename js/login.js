var session_id = window.localStorage.getItem('key');

if (session_id) {
    var page = "./course_id.html";
    window.location.href = page;
}

// Document is ready
$(document).ready(function () {
    $("#btnlogin").click(function () {
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
        
        const data = {"username":$("#username").val(),"password":$("#password").val()}

        
        $.ajax({
            type : 'POST',
            url : 'http://localhost:5000/login',
            data : JSON.stringify(data),
            dataType: "JSON",
            contentType: "application/json",
            processData : false,
            success:function(data){
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
