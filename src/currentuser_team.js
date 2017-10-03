





var currentuser_backlogs = [];

function get_currentuser_backlogs(userkey, dropdownid){
var database = firebase.database();
var teamref = database.ref('teams/');
var backlog_ref = database.ref('backlogs/');
var is_member = false;
var is_shmember = false;
var dropdown="";
    teamref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val(); 
            is_member = false;
            is_shmember = false;       
            if(child_data.members.stakeholders !== undefined && child_data.members.stakeholders != ""){     
                var stakeholdersarray = child_data.members.stakeholders.split(',');     
                if(stakeholdersarray.indexOf(userkey) > -1){        
                    is_shmember = true;     
                    user_role="Stakeholder";        
                }       
            }
            switch(userkey){
            	case child_data.members.product_owner:
                	is_member = true;
                	break;
            	case child_data.members.scrum_master:
                	is_member = true;
                	break;
            	case child_data.members.team_member1:
                	is_member = true;
                	break;
            	case child_data.members.team_member2:
                	is_member = true;
                	break;
            	case child_data.members.team_member3:
                	is_member = true;
                	break;
            	case child_data.members.team_member4:
                	is_member = true;
                	break;
            	case child_data.members.team_member5:
                	is_member = true;
                	break;
            	case child_data.members.team_member6:
                	is_member = true;
                	break;
            	case child_data.members.team_member7:
                	is_member = true;
                	break;
            	case child_data.members.team_member8:
                	is_member = true;
                	break;
            	case child_data.members.team_member9:
                	is_member = true;
                	break;
            }
            if(is_member||is_shmember){
            	var list_backlogs = child_data.backlogs;
                if(list_backlogs !== undefined) {
                    var backlogs = child_data.backlogs.split(",");
                    backlogs.forEach(function (backlog){
                        var is_included = false;
                        currentuser_backlogs.forEach(function (current_backlog){
                            if(current_backlog == backlog)
                            {
                                is_included = true;
                            }
                        });
                        if(!is_included){
                            currentuser_backlogs.push(backlog);
                        }
                    });
                }
            }
        });

        var backlogs_info = [];
		console.log("Current user backlogs:" + currentuser_backlogs);
		backlog_ref.orderByChild("title").on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var child_data2 = childSnapshot.val();
                currentuser_backlogs.forEach(function(currentuser_backlog){
                    if(currentuser_backlog == childSnapshot.val().key && child_data2.status != "archive" && child_data2.status != "inactive"){
                        backlogs_info.push({key: currentuser_backlog, title: childSnapshot.val().title});
                    }
                    
                });

            });
            dropdown = "";
            backlogs_info.forEach(function(child_data){
                if($('#selected_backlog').val() == child_data.key){
                    dropdown += '<option selected="selected" value="'+ child_data.key+'" >'+child_data.title+'</option>';
                }
                else{
                    dropdown += '<option value="'+ child_data.key+'">'+child_data.title+'</option>';
                }
            });
            $(dropdownid).html(dropdown);
            

        });

    });

}


function seteventlistener(dropdownid){
    
        //DataTable functions removed 
        $(document).on('change', '#select_backlog',function () {
        //$('#select_backlog').on('change', function () {
            var database = firebase.database();
            var title = this.options[this.selectedIndex].text;
            var key = this.options[this.selectedIndex].value;

            userref.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var child_data = childSnapshot.val();
                        

                    if(child_data.email == firebase.auth().currentUser.email) {
                        user_permission = child_data.permittedbacklog;
                    } 
                });
                
                if(user_permission != "" && user_permission !== undefined){
                    user_permissions = user_permission.split(";");
                }

                database.ref('user/' + $('#user_key').val() +'/selected_backlogs').set(
                {
                    title: title,
                    key: key
                });           
                
                window.location.href = "/scrumnow.php"
                       
            });
        });
}

