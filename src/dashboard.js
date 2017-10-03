var database = firebase.database();
var userref = database.ref('user');


userref.once('value').then(function(snapshot) {
   
    snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var child_data = childSnapshot.val();
        
        if(firebase.auth().currentUser != null) {
            if(child_data.email == firebase.auth().currentUser.email) {
                $("#user_key").val(key);
            } 
        }
    });
});



function returntologin(){
    window.location.href = "https://rocketscrum.com/";
}


function viewmyteams(){
var database = firebase.database();
var teamref = database.ref('teams/');
var backlog_ref = database.ref('backlogs/');
var is_member = false;
var dropdown="";
var userkey= $("#user_key").val();
    teamref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val(); 
            is_member = false;
            switch(userkey){
                case child_data.members.product_owner:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.scrum_master:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member1:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member2:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member3:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member4:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member5:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member6:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member7:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member8:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>' + child_data.title + '</td></tr>');  
                    break;
                case child_data.members.team_member9:
                    is_member = true;
                    $("#dashboard_teams").last().append('<tr><td>-' + child_data.title + '</td></tr>');  
                    break;
            }
           

        });

    });

    $('#modal2').css('display','block');

}

function close_this_modal(){
    $('#modal1').css('display','none');
}

function close_dashboard_team(){
    $('#modal2').css('display','none');
    $('#dashboard_teams').empty();

}


function viewbacklogs(){
    $('#modal1').css('display','block');
    $('#user-backlogs').html('');
    get_currentuser_backlogs($("#user_key").val(),"#user-backlogs");
}

function viewmonitor(){
    window.location.href = "/scrumnow_wallmonitor.php?key="+ $("#user_key").val();
}

function viewsummary(){
    window.location.href = "/backlog_summary.php";
}

function viewsettings(){
    window.location.href = "/user_settings.php";
}

function proceed(){
    var database = firebase.database();
    var selected_backlog;
     database.ref('user/' + $('#user_key').val() +'/selected_backlogs').set(
                            {
                                title: $('#user-backlogs option:selected').text(),
                                key: $('#user-backlogs').val()
                            });           
                            
                            window.location.href = "/scrumnow.php"

}

$(document).ready(function(){



});