$(function() {
  var username;
  $("#loginregisterbutton").html("Sign In");
  var socket = io();
   $("#loginregisterbutton").click(function(){
	   socket.emit("register", {username: $("#username").val()});
   });
   $("#username").keyup(function(){
     socket.emit("checkusername", $("#username").val());
   });
   socket.on("usernamecheckresponse", function(availability){
     if(availability != "available"){
       $("#loginregisterbutton").html("Sign In");
       $("#login #password").attr("placeholder", "Password");
     }
     else {
       $("#loginregisterbutton").html("Go");
       $("#login #password").attr("placeholder", "Password (optional)");
     }
   });
   socket.on("loggedin", function(usernamefromserver){
     username = usernamefromserver;
     $("#login").fadeOut(function(){
       $("#teamselection").fadeIn();
     });
   });
   $("#teamname").keyup(function(){
     socket.emit("checkteamname", $("#teamname").val());
   });
   socket.on("teamcheckresponse", function(state){
     if(state == "new"){
       $("#teamjoin").html("Create Team");
       $("#teamjoin").fadeIn();
       $("#teamfull").fadeOut();
     }
     else if(state == "exists"){
       $("#teamjoin").html("Join Team");
       $("#teamjoin").fadeIn();
       $("#teamfull").fadeOut();
     }
     else if(state == "full"){
       $("#teamjoin").fadeOut(function(){
         $("#teamfull").fadeIn();
       });
     }
   });
   $("#teamjoin").click(function(){
     socket.emit("jointeam", $("#teamname").val());
   });
   socket.on("joinedteam", function(){
     $("#teamselection").fadeOut(function(){
       $("#teammembers").fadeIn();
     });
   });
   socket.on("newmember", function(username){
     $("#teammembers>ul").html($("#teammembers>ul").html() + "<li>" + username + "</li>");
   });
   socket.on("readytoselect", function(){
     $("#teammembers #teamready").fadeIn();
   });
});
