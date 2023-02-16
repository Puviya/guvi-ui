$(document).ready(function () {
    $("#logout").on("click", function () { 
        $.ajax({
            type : 'POST',
            url : 'http://localhost:5000/session_delete',  
            data:  JSON.stringify({"session_id":window.localStorage.getItem("key")}),
            success:function(data){
                if(data.status == "success"){
                    localStorage.removeItem('key');
                }
                window.location.href="login.html"; 
                window.localStorage.removeItem("time");
            }
        }); 
    });
});