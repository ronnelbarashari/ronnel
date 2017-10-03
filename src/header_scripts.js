$(document).ready(function() {

var access;
var database = firebase.database();
var users = database.ref('user');

users.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();

            //added check if user is logged in
            if(firebase.auth().currentUser != null) {
                console.log("no access to this page.");

        		if(child_data.email == firebase.auth().currentUser.email) {
                    access = child_data.userpermission;

                    //get team
                    var isteammember = false;
                    var permittedbacklogs = "";

                    var membercount = 0;

                    var teamsref = database.ref('teams');
                    teamsref.once('value').then(function(snapshot1) {
                        snapshot1.forEach(function(childSnapshot1) {
                            var teamkey = childSnapshot1.key;
                            var child_data1 = childSnapshot1.val();

                            var backlogkey = child_data1.backlogs;

                            var membersref = database.ref('teams/' + teamkey + "/members");
                            membersref.once('value').then(function(snapshot2) {
                                snapshot2.forEach(function(childSnapshot2) {
                                    var key2 = childSnapshot2.key;
                                    var val2 = childSnapshot2.val();
                                    if(val2 == key) {
                                        isteammember = true;
                                        if(permittedbacklogs == "") {
                                            permittedbacklogs = backlogkey;
                                        } else {
                                            permittedbacklogs += "," + backlogkey;  
                                        }

                                        access = permittedbacklogs;

                                        if(access != "") {
                                            $('.dashboard-loading-animation-initial').css("display", "none");
                                            
                                            $('#main-loading-container').css('display','none');
                                            $('#main_screen').css('display','block');
                                            $('#no_backlog').css('display','none');
                                            $('.dashboard_can_access').css('display','block');
                                            $('.dashboard_no_access').css('display','none');
                                            //$('#settingsli #role_settings').remove();
                                            //$('#settingsli #admin_settings').remove();

                                            $(".container-dashboard").css("display", "block");
                                            $("#dashboard-container").css("display", "block");

                                            $("#permitted_backlog").val(access);
                                        }

                                        return true;
                                    }
                                });   
                                if(!isteammember) {
                                    $('.dashboard-loading-animation-initial').css("display", "none");  
                                    $('#main-loading-container').css('display','none');
                                    $('#main_screen').css('display','block');
                                    $('#no_backlog').css('display','none');
                                    $('.dashboard_can_access').css('display','block');
                                    $('.dashboard_no_access').css('display','none');
                                    //$('#settingsli #role_settings').remove();
                                    //$('#settingsli #admin_settings').remove();

                                    $(".container-dashboard").css("display", "block");
                                    $("#dashboard-container").css("display", "block");

                                    $("#permitted_backlog").val(access);
                                }
                            });
                        });
                    });
                }
            }else{
                $('.dashboard-loading-animation-initial').css("display", "none");

                $('.dashboard_can_access').css('display','none');
                $('.dashboard_no_access').css('display','block');
                $('#main-loading-container').css('display','none');
                $('#main_screen').css('display','block');
                $('#no_access').css('display','block');

                $(".container-dashboard").css("display", "none");
                $("#dashboard-container").css("display", "none");
            }

            $('#main-loading-container').css('display','none');
            $('#main_screen').css('display','block');
        });
    });
     jQuery(document).ready(function() { 
        jQuery('#rs-top-header .icon-gear').click(function() {
            $('.dropdown ul').toggle();
        });
    });

 
});