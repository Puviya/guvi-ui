$(document).ready(function () {
    $("#btnlogin").click(function () {
        
        $.ajax({
            type : 'POST',
            url : 'http://localhost:5000/login',     
            success:function(data){
            
            },
        }); 
    });
});