$(document).ready(function() {

var access;
var database = firebase.database();
var users = database.ref('user');

users.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();

            if(firebase.auth().currentUser != null) {

                if(child_data.email == firebase.auth().currentUser.email) {
                
                    access = child_data.userpermission;
                }  
                
                if(access == "") {
                    $('#main-loading-container').css('display','none');
                    $('#main_screen').css('display','block');
                    $('#no_access').css('display','block');
                    $('#can_access').remove();
                    //$('#userSettings').css('display','none');
                }else{

                    $('#main-loading-container').css('display','none');
                    $('#main_screen').css('display','block');
                    $('#no_access').css('display','none');
                    $('#can_access').css('display','block');
                }

                    $('#no_access_user_feature').css('display','none');
                    $('#can_access_user_feature').css('display','block');
            }else{
                console.log("Hide loading ");
                $('#no_access').css('display','block');
                $('#main-loading-container').css('display','none');
                $('#main_screen').css('display','block');
                $('#no_access_user_feature').css('display','block');
                $('#can_access_user_feature').css('display','none');
            }
                $('#main-loading-container').css('display','none');
                $('#main_screen').css('display','block');
        });
    });

});