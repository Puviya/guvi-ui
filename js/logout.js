$(document).ready(function () {
    $("#logout").on("click", function () { 
        $.ajax({
            type : 'POST',
            url : 'http://localhost:5000/logout',     
            success:function(data){
                if(data.status == "success"){
                    localStorage.removeItem('key');
                }
                window.location.href="login.html"; 
            }
        }); 
    });
});