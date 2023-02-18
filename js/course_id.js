var session_id = window.localStorage.getItem('key');
var updates_det;
var changes;

if (!session_id) {
    var page = "./login.html";
    window.location.href = page;
}

$(document).ready(function () {
  $("#course_form").submit(function (e) {
    $("#loading").show();
    e.preventDefault();
    var course_id = document.getElementById("courseId").value;
     if (course_id=="") {
      $("#error").html("<br>This Field Required");
      byPassSecondPage();
    } else {
       var dict = {"course_id": $("#courseId").val()};
      
      $.ajax({
        method:'POST',
        url: 'http://127.0.0.1:5000/course_status',
        datatype: 'JSON',
        data: JSON.stringify(dict),
        contentType: "application/json",
        success: function (data) {
          if (data.status == "success") {
            $("#loading").hide();
            changes = data.changes;
            // document.getElementById("course_id_page").style.display = "none";
            document.querySelector(".content").style.display = "none";
            $("#coursenamestatus").html(data.course_name);
            $("#courseidstatus").html(data.course_id);
            $("#courselangstatus").html(data.lang);
            if (data.live == true) {
              $("#livestatusstatus").html("Live");
              document.getElementById("livestatusstatus").style.color = "green";
              document.getElementById("live_check").style.display = "block";
            } else {
              $("#livestatusstatus").html("No Live");
              document.getElementById("livestatusstatus").style.color = "red";
              document.getElementById("live_check").style.display = "none";
              document.getElementById("live_close").style.display = "block";
            }
            if (data.update == true) {
              $("#updatesstatus").html("Available");
              document.getElementById("updatesstatus").style.color = "green";
              const updateBtn = document.getElementById("update_btn");
              updateBtn.disabled = false;
              updates_det = {
                "course_id" : course_id,
                'update': true
              };

              //const availBtn = document.getElementById("updatesstatus");
            }
            else {
              $("#updatesstatus").html("Unavailable");
              document.getElementById("updatesstatus").style.color = "red";
            }
            if (data.video == true) {
              document.getElementById("video_check").style.display = "block";
            }
            else {
              document.getElementById("video_close").style.display = "block";
              document.getElementById("video_check").style.display = "none";
            }
            if (data.quiz == true) {
              document.getElementById("quiz_check").style.display = "block";
            }
            else {
              document.getElementById("quiz_close").style.display = "block";
              document.getElementById("quiz_check").style.display = "none";
            }

            // document.getElementById("course_id_individual_page").style.display = "block";
            document.querySelector(".container").style.display = "block";
            //alert("Changes :\n"+JSON.stringify(changes));
            
          }
          if(data.status =="login"){
            window.location.href="login.html";
          }
          if(data.status == "invalid"){
            $("#error").html("<br>Please enter valid course ID");
          }
        }
          
      })
 
    }
  });

});

function update(){
  //prompt("Changes :\n", JSON.stringify(changes));
  $.ajax({
    method: 'POST',
    url: 'http://127.0.0.1:5000/update_concern',
    datatype: 'json',
    data: JSON.stringify(updates_det),
    contentType: "application/json",
    success: function (data) {
      $("#loading").hide();
      if(data.update_status == "update_success"){
        alert("Update success!!!!");
        window.location.href = "course_id.html";
      }
    }

  })
}
// function for visual comparison of changes/updates 
var count = 0;
function showChanges(){
  if(true && count==0){
  //   const data = {
  //     "1": {
  //         "Field": "number",
  //         "db": "course",
  //         "lesson_id": "aFTEREFFECTSTAMILTUTORIAL999",
  //         "new": 8,
  //         "previous": 1
  //     },
  //     "2": {
  //         "Field": "level",
  //         "db": "course",
  //         "lesson_id": "aFTEREFFECTSTAMILTUTORIAL",
  //         "new": "l1",
  //         "previous": "l2"
  //     }
  // }
  const data = {
    "status": true,
    "values": {
        "1": {
            "Field": "number",
            "db": "course",
            "lesson_id": "aFTEREFFECTSTAMILTUTORIAL",
            "new": 4,
            "previous": 1
        },
        "2": {
            "Field": "level",
            "db": "course",
            "lesson_id": "aFTEREFFECTSTAMILTUTORIAL",
            "new": "l3",
            "previous": "l2"
        }
    }
}
  appendTable(data.values);
  count=1;
  return;
  }
  $.ajax({
    type : 'POST',
    url : 'http://localhost:5000/course_changes',
    data : $("#courseId").val(),
    dataType: "JSON",
    contentType: "application/json",
    processData : false,
    success:function(data){  
      appendTable(data);
    },
});  
}

function appendTable(data){
  const arr = ["Field","action","course_id","db","lessonId","new","previous"];
  Object.keys(data).forEach(element => {
    var row = "<tr>";//row ="";
    arr.forEach(e=>{
      var row_data;
      if(data[element].hasOwnProperty(e))
        row_data = data[element][e]
      else{
        row_data = "-";
      }
      row =  row + "<td >"+row_data+"</td>"
  })
    $("#table").append(row+"</tr>");
    //`<tr>{row}</tr>`
  });
}
// function appendTable(data){
//   Object.keys(data).forEach(element => {
//       var row =  `<tr>
//           <td >${data[element].db}</td>
//           <td >${data[element].lesson_id}</td>
//           <td >${data[element].Field}</td>
//           <td >${data[element].previous}</td>
//           <td >${data[element].new}</td>
//       </tr>`
//  $("#table").append(row);
//   });
// }

function byPassSecondPage(){
  document.querySelector(".content").style.display = "none";
  $("#coursenamestatus").html("data.course_name");
  $("#courseidstatus").html("data.course_id");
  $("#courselangstatus").html("data.lang");

  $("#livestatusstatus").html("Live");

  $("#livestatusstatus").html("No Live");

  $("#updatesstatus").html("Available");
  document.getElementById("live_check").style.display = "block";
  document.getElementById("live_close").style.display = "block";
  //updateBtn.disabled = false;
  document.getElementById("video_check").style.display = "block";
  document.querySelector(".container").style.display = "block";
}

// ,
//         "3": {
//           "Field": "level",
//           "db": "course",
//           "lesson_id": "aFTEREFFECTSTAMILTUTORIAL",
//           "new": "l3",
//           "previous": "l2"
//         },
//         "4": {
//           "Field": "level",
//           "db": "course",
//           "lesson_id": "aFTEREFFECTSTAMILTUTORIAL",
//           "new": "l3",
//           "previous": "l2"
//       },
//       "5": {
//         "Field": "level",
//         "db": "qui",
//         "lesson_id": "aFTEREFFECTSTAMILTUTORIAL",
//         "new": "l3",
//         "previous": "l2"
//     }