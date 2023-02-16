$(document).ready(function () {
    $("#logout").on("click", function () { 
        $.ajax({
            type : 'POST',
            url : 'http://localhost:5000/session_delete',
            data: JSON.stringify({"session_id": window.localStorage.getItem("key")}),
            dataType: "JSON",
            contentType: "application/json",     
            success:function(data){
                if(data.status == "success"){
                    localStorage.removeItem('time');
                    localStorage.removeItem('key');
                }
                localStorage.removeItem('time');
                window.location.href="login.html"; 
                
            }
        }); 
    });
});