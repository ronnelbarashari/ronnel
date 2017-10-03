var i = 0;
var user_backlogs = [];
var user_teams = [];
var backlog_create = "";
var stakeholder_member = "";
var key_holder = "";
var planning_date = "";
var list_teams = [];
var dayArr = {Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6};
var dayArrKeys = Object.keys(dayArr);
var arrPo = [];

$(document).ready(function() {
    $("#rs-main-header").remove();
    
    getMyUserKey();
    
    $('#SM-select').on('change', function() {
        update_teamselectdisplay();    
    });
    $('#PO-select').on('change', function() {
        update_teamdisplay();            
    });
    $("#scrum-team").on('change', function() {
        $('#scrum-backlog').empty();
        $('#scrum-backlog').append('<option>Choose Backlog</option>');

        var backlog_dropdown = "";
        user_backlogs.forEach(function(child_data){
            if(child_data.team == $("#scrum-team option:selected").val()) {
                backlog_dropdown += '<option value="'+ child_data.key+'">'+child_data.title+'</option>';    
            }
        });
        $('#scrum-backlog').append(backlog_dropdown);
    });
});

function getMyUserKey() {
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
        getMyTeams();
    });
}

function getMyTeams(){
    $('.dashboard-loading-animation').css("display", "block");
    var user_role="";
    var database = firebase.database();
    var teamref = database.ref('teams/');
    var backlog_ref = database.ref('backlogs/');
    var is_member = false;
    var is_shmember = false;
    var sh_members = "";
    list_teams = [];

    var userkey= $("#user_key").val();
    teamref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val(); 
            var key = childSnapshot.key;
            is_member = false;
            is_shmember = false;
            if(child_data.members.stakeholders !== undefined && child_data.members.stakeholders != ""){
                var stakeholdersarray = child_data.members.stakeholders.split(',');
                if(stakeholdersarray.indexOf(userkey) > -1){
                    is_shmember = true;
                    user_role="Stakeholder";
                }else{
                    is_shmember = false;
                }
            }else{
                is_shmember = false;
            }

            switch(userkey){
                case child_data.members.product_owner:
                    user_role="Product Owner";
                    is_member = true;
                    break;
                case child_data.members.scrum_master:
                    user_role="Scrum Master";
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
            
            if(is_member || is_shmember) {
                user_teams.push({key: key, title: child_data.title});
                sp_length = child_data.sprintlength;
                var sh_members = child_data.members.stakeholders;

                var teamhtml = '<div class="dashboard-team-container ' + key + '">';
                teamhtml += '<div class="dashboard-column left">Team Name:</div>';
                teamhtml += '<div class="dashboard-column right"><a href="#" onclick="editTeam(\'' + key + '\');">' + child_data.title + '</a></div>';
                teamhtml += '</div>';
                teamhtml += '<div class="dashboard-loading-animation-members-' + key + '" style="display:none;">';
                teamhtml += '<span>Loading team members...</span>';
                teamhtml += '<div id="loader">';
                teamhtml += '<div id="loader_1" class="loader"></div>';
                teamhtml += '<div id="loader_2" class="loader"></div>';
                teamhtml += '<div id="loader_3" class="loader"></div>';
                teamhtml += '<div id="loader_4" class="loader"></div>';
                teamhtml += '<div id="loader_5" class="loader"></div>';
                teamhtml += '</div>';
                teamhtml += '</div>';
                teamhtml += '<input type="hidden" class="dashboard-role" id="user_role' + key + '" value="'+ user_role +'">';
                list_teams.push({key : key, title : child_data.title});
                $(".dashboard-team-single").append(teamhtml); 
                getTeamMembers(child_data.title, key, child_data.members.product_owner, child_data.members.scrum_master, child_data.members.team_member1, child_data.members.team_member2, child_data.members.team_member3, child_data.members.team_member4, child_data.members.team_member5, child_data.members.team_member6, child_data.members.team_member7, child_data.members.team_member8, child_data.members.team_member9, child_data.sprintlength, child_data.planning_day, child_data.planning_time_picker, child_data.daily_scrum_time_picker, child_data.sprint_review_day, child_data.review_time_picker, child_data.retrospective_day, child_data.retrospective_time_picker, sp_length,sh_members);
                getTeamBacklogs(key, child_data.backlogs,user_role,dayEvent(child_data.planning_time_picker));
            }
        });

        $('.dashboard-loading-animation').css("display", "none");
    });
}

function getTeamMembers(teamname, teamkey, product_owner, scrum_master, team_member1, team_member2, team_member3, team_member4, team_member5, team_member6, team_member7, team_member8, team_member9,spntln, plan_day,plan_timepicker,scrum_timepicker,review_day,reviewtime_picker,retro_day,retro_timepicker,sp_length,sh_members) {
    $('.dashboard-loading-animation-members-' + teamkey).css("display", "block");
    /*sh_members.forEach(function(keys){
    });*/

    var database = firebase.database();
    var users = database.ref('user');

    var is_bestpractices_enabled = 0;

    users.once('value').then(function(snapshot) {
        var teamhtml = pohtml = smhtml = tmshtml = shhtml = "";
        var team = teamname;
    
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
            var key = childSnapshot.key;

            //if(child_data.displayname != undefined && child_data.displayname != ""){
                if(key == product_owner) {
                   /* pohtml = '<div class="dashboard-team-container ' + teamkey + '">';
                    pohtml += '<div class="dashboard-column left">Product Owner:</div>';
                    pohtml += '<div class="dashboard-column right">' + '<a href="#" style = "font-style:italic" onclick="showProfile(\'' + child_data.displayname + '\',\'' + child_data.email + '\')">' + child_data.displayname + '</a>' + '</div>';
                    pohtml += '</div>';*/
                    if(child_data.bestpractice == 1) {
                        is_bestpractices_enabled = 1;
                    }
                    arrPo.push({name : child_data.displayname, team_key : teamkey, userkey: key, email: child_data.email});
                } 
                if(key == scrum_master) {
                    smhtml = '<div class="dashboard-team-container ' + teamkey + '">';
                    smhtml += '<div class="dashboard-column left">Scrum Master:</div>';
                    smhtml += '<div class="dashboard-column right">' + '<a href="#" style = "font-style:italic" onclick="showProfile(\'' + child_data.displayname + '\',\'' + child_data.email + '\')">' + child_data.displayname + '</a>' + '</div>';
                    smhtml += '</div>';
                    if(child_data.bestpractice == 1) {
                        is_bestpractices_enabled = 1;
                    }
                    arrPo.push({name: child_data.displayname, userkey: key, email: child_data.email});
                }
                if(key == team_member1 || key == team_member2 || key == team_member3 || key == team_member4 || key == team_member5 || key == team_member6 || key == team_member7 || key == team_member8 || key == team_member9) {
                    if(tmshtml == "") {
                        tmshtml = '<a href="#" style = "font-style:italic" onclick="showProfile(\'' + child_data.displayname + '\',\'' + child_data.email + '\')">' + child_data.displayname + '</a>';
                    } else {
                        tmshtml += ", " + '<a href="#" style = "font-style:italic" onclick="showProfile(\'' + child_data.displayname + '\',\'' + child_data.email + '\')">' + child_data.displayname + '</a>';
                    }
                    if(child_data.bestpractice == 1) {
                        is_bestpractices_enabled = 1;
                    }
                    arrPo.push({name: child_data.displayname, userkey: key, email: child_data.email});
                }

                if(sh_members !== undefined && sh_members != ""){
                    var splitshmem = sh_members.split(",");
                    splitshmem.forEach(function(shmember){
                        if(key == shmember){
                            if(shhtml == "") {
                                shhtml = '<a href="#" style = "font-style:italic" onclick="showProfile(\'' + child_data.displayname + '\',\'' + child_data.email + '\')">' + child_data.displayname + '</a>';
                                arrPo.push({name: child_data.displayname, userkey: key, email: child_data.email});
                            }else{
                                shhtml += ", " + '<a href="#" style = "font-style:italic" onclick="showProfile(\'' + child_data.displayname + '\',\'' + child_data.email + '\')">' + child_data.displayname + '</a>';
                                arrPo.push({name: child_data.displayname, userkey: key, email: child_data.email});
                            }
                            if(child_data.bestpractice == 1) {
                                is_bestpractices_enabled = 1;
                            }

                        }
                    });
                }
            //}
        });


    
        if(pohtml == "") {
            /*pohtml = '<div class="dashboard-team-container ' + teamkey + '">';
            pohtml += '<div class="dashboard-column left">Product Owner:</div>';
            pohtml += '<div class="dashboard-column right"></div>';
            pohtml += '</div>';*/
        }
        
        if (smhtml == "") {
            smhtml = '<div class="dashboard-team-container ' + teamkey + '">';
            smhtml += '<div class="dashboard-column left">Scrum Master:</div>';
            smhtml += '<div class="dashboard-column right"></div>';
            smhtml += '</div>';
        }


        var teamprehtml = '<div class="dashboard-team-container ' + teamkey + '">';
        teamprehtml += '<div class="dashboard-column left">Team Members:</div>';
        teamprehtml += '<div class="dashboard-column right">' + tmshtml + '</div></div>';

        var shprehtml = '<div class="dashboard-team-container ' + teamkey + '">';
        shprehtml += '<div class="dashboard-column left">Stakeholders:</div>';
        shprehtml += '<div class="dashboard-column right">' + shhtml + '</div></div>';

        tmshtml = "";
        shhtml = "";

        var teamhtml = pohtml + smhtml + teamprehtml  + shprehtml + '</div>';
        $(".dashboard-team-container." + teamkey + ":last").after(teamhtml);
        
        var addtlhtml = '<div class="dashboard-team-container ' + teamkey + '">';
        addtlhtml += '<div class="dashboard-column left">Scrum Score:</div>';
        addtlhtml += '<div class="dashboard-column right">(coming soon)</div>';
        addtlhtml +='</div>';
        addtlhtml += '<div class="dashboard-team-container ' + teamkey + '">';
        addtlhtml += '<div class="dashboard-column left">Team Happiness:</div>';
        addtlhtml += '<div class="dashboard-column right">(coming soon)</div>';
        addtlhtml +='</div>';
        addtlhtml = '<div class="dashboard-team-container ' + teamkey + '">';
        addtlhtml += '<div class="dashboard-column left">Sprint Length:</div>';
        if(spntln !== undefined && spntln != ""){
            addtlhtml += '<div class="dashboard-column right">' + spntln + '</div>';
        }else{
            addtlhtml += '<div class="dashboard-column right">  </div>';
        }
        addtlhtml +='</div>';
        
        var sprint_planning = daily_scrum = sprint_review = sprint_retrospective = "";
        
        var d = new Date(); // now, or the specific date in question
        var s = d.toLocaleString("en", {timeZoneName: "short"}).split(' ').pop();
        
        sprint_planning = "Every Monday at 9:00am " + s;
        daily_scrum = "Daily at 9:00am " + s;
        sprint_review = "Every Friday at 2:00pm " + s;
        sprint_retrospective = "Every Friday at 2:00pm " + s;

        
        addtlhtml += '<div class="dashboard-team-container ' + teamkey + '">';
        addtlhtml += '<div class="dashboard-column left">Sprint Planning:</div>';
        if(plan_timepicker !== undefined && plan_timepicker != ""){
            addtlhtml += '<div class="dashboard-column right">Every ' + dayArrKeys[dayEvent(plan_timepicker)] + ' at ' + timeEvent(plan_timepicker) + ' '+ s +'</div>';
        }else{
            addtlhtml += '<div class="dashboard-column right"></div>';
        }
        addtlhtml +='</div>';
        addtlhtml += '<div class="dashboard-team-container ' + teamkey + '">';
        addtlhtml += '<div class="dashboard-column left">Daily Scrum:</div>';
        if(scrum_timepicker !== undefined && scrum_timepicker != ""){
            addtlhtml += '<div class="dashboard-column right">Daily at ' + timeEvent(scrum_timepicker) + ' '+ s +'</div>';
        }else{
            addtlhtml += '<div class="dashboard-column right"></div>';
        }
        addtlhtml +='</div>';
        addtlhtml += '<div class="dashboard-team-container ' + teamkey + '">';
        addtlhtml += '<div class="dashboard-column left">Sprint Review:</div>';
        if(reviewtime_picker !== undefined && reviewtime_picker != ""){
            addtlhtml += '<div class="dashboard-column right">Every ' + dayArrKeys[dayEvent(reviewtime_picker)] + ' at ' + timeEvent(reviewtime_picker) + ' '+ s +'</div>';
        }else{
            addtlhtml += '<div class="dashboard-column right"></div>';
        }
        addtlhtml +='</div>';
        addtlhtml += '<div class="dashboard-team-container ' + teamkey + '">';
        addtlhtml += '<div class="dashboard-column left">Sprint Retrospective:</div>';
        if(retro_timepicker !== undefined && retro_timepicker != ""){
            addtlhtml += '<div class="dashboard-column right">Every ' + dayArrKeys[dayEvent(retro_timepicker)] + ' at ' + timeEvent(retro_timepicker) + ' '+ s +'</div>';
        }else{
            addtlhtml += '<div class="dashboard-column right"></div>';
        }
        addtlhtml +='</div>';
        addtlhtml += '<div class="dashboard-team-container ' + teamkey + '">';
        addtlhtml += '<div class="dashboard-column left">Product Backlogs: <br>';
        //addtlhtml += '<div class="dashboard-column right">';
        addtlhtml += '<div class="dashboard-loading-animation-backlog-' + teamkey + '" style="display:block;">';
        addtlhtml += '<span>Loading team backlogs...</span>';
        addtlhtml += '<div id="loader">';
        addtlhtml += '<div id="loader_1" class="loader"></div><div id="loader_2" class="loader"></div><div id="loader_3" class="loader"></div><div id="loader_4" class="loader"></div><div id="loader_5" class="loader"></div>';
        addtlhtml += '</div></div>';
        addtlhtml += '<span class="user-backlog-' + teamkey + '"></span></div>';
        addtlhtml +='</div>';

        addtlhtml += '<input type="hidden" id="best-practice-' + teamkey + '" value="' + is_bestpractices_enabled + '" />';
        
        $(".dashboard-team-container." + teamkey + ":last").after(addtlhtml);
        $(".dashboard-team-container." + teamkey + ":last").after("<hr/>");
        $('.dashboard-loading-animation-members-' + teamkey).css("display", "none");
    });
}
function timeEvent(time){
    var eventTime = new Date(time);
    return eventTime.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
}
function dayEvent(time){
    var eventDay = new Date(time);
    return eventDay.getDay();
}
function getBacklogProdOwner(userkey, teamkey){     
    var arrName_Email = [];     
    if(userkey == "" || userkey == undefined){      
        for (var x=0; x<arrPo.length; x++){     
            if( arrPo[x].team_key == teamkey){      
                arrName_Email.push(arrPo[x].name, arrPo[x].email);      
                return arrName_Email;       
            }       
        }       
    }       
    else{       
        for (var x=0; x<arrPo.length; x++){     
            if( arrPo[x].userkey == userkey){       
                arrName_Email.push(arrPo[x].name, arrPo[x].email);      
                return arrName_Email;       
            }       
        }       
    }       
}
function getTeamBacklogs(team_key,teambacklogs,teamuserrole,planday) {
    var database = firebase.database();
    var backlogs = database.ref('backlogs');
    var thiskey = team_key;
    var i = 0;
    var team_backlogs = "";
    var tbl_backlog_po = "<table id='tbl_backlog_po'> <tr> <td> Name </td> <td> Product Owner </td> </tr>"; 
    backlogs.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child = childSnapshot.val();
            if(child.status != "archive" && child.status != "inactive"){
                if(isselectedbacklog(child.key,teambacklogs)){
                    if(team_backlogs == "") {
                        tbl_backlog_po += '<tr> <td> <a onclick="showProductBacklog(\'' + child.key + '\',\'' + child.title + '\', \'\',\'' + teamuserrole + '\')" href="#" data-backlog="' + child.key + '">' + child.title + ' </a> </td> ';
                        tbl_backlog_po += '<td> ' + '<a href="#" style = "font-style:italic" onclick="showProfile(\'' + getBacklogProdOwner(child.productowner, team_key)[0] + '\',\'' + getBacklogProdOwner(child.productowner, team_key)[1] + '\')">' + getBacklogProdOwner(child.productowner, team_key)[0] + '</a>'  +  ' </td>  </tr>';
                        //team_backlogs = '<br> <a onclick="showProductBacklog(\'' + child.key + '\',\'' + child.title + '\', \'\',\'' + teamuserrole + '\')" href="#" data-backlog="' + child.key + '">' + child.title + ' </a> ';
                        //team_backlogs += getBacklogProdOwner(child.productowner, team_key);
                    } else {
                        //console.log(getBacklogProdOwner(child.productowner, team_key));
                        tbl_backlog_po += '<tr> <td> <a onclick="showProductBacklog(\'' + child.key + '\',\'' + child.title + '\', \'\',\'' + teamuserrole + '\')" href="#" data-backlog="' + child.key + '">' + child.title + ' </a> </td> ';
                        tbl_backlog_po += '<td> ' + '<a href="#" style = "font-style:italic" onclick="showProfile(\'' + getBacklogProdOwner(child.productowner, team_key)[0] + '\',\'' + getBacklogProdOwner(child.productowner, team_key)[1] + '\')">' + getBacklogProdOwner(child.productowner, team_key)[0] + '</a>'  +  ' </td>  </tr>';
                        //team_backlogs += '<br> ' + '<a onclick="showProductBacklog(\'' + child.key + '\',\'' + child.title + '\', \'\',\'' + teamuserrole + '\')" href="#" data-backlog="' + child.key + '">' + child.title + '</a>';
                        //team_backlogs +=  getBacklogProdOwner(child.productowner, team_key);
                    }
                    user_backlogs.push({key: child.key, title: child.title, team: team_key});
                }
                i++;
            }
        });
        
        tbl_backlog_po += "</table>";
        team_backlogs += '<br> &nbsp;&nbsp;<a href="#" class="create-new-link" onclick="createNewBacklog(\'' + team_key + '\')" >&lt;Create New&gt;</a>' + '&nbsp;&nbsp;<a href="/scrumnow_wallmonitor.php?key=' + $("#user_key").val() + '&planning_day='+ planday +' " target="_blank">[Wall Monitor]</a>';
        
        $('.user-backlog-' + team_key).html(tbl_backlog_po);
        $('.user-backlog-' + team_key).append(team_backlogs);
        $('.dashboard-loading-animation-backlog-' + team_key).css("display", "none");
    });    
}

function showProductBacklog(backlog_key, backlog_title,mode,user_role) {
    var database = firebase.database();
    var user_key = $("#user_key").val();
    user_role=(user_role!="") ? user_role : "Member";
    database.ref('user/'+ user_key).update(
    {
        "selected_backlogs/key": backlog_key,
        "selected_backlogs/title": backlog_title,
        "userrole": user_role
    });  
    if(mode == 'sprint_planning') {
        location.href = "scrumnow.php?backlog=" + backlog_key;
    } else {
        location.href = "scrumnow.php";
    }
}

function showProfile(display_name, email) {
    $('.dashboard-modal-profile').css("visibility", "visible");
    $('.dashboard-modal-title-text').html("User Profile");

    var profilehtml = '<div class="dashboard-team-container profile">';
    profilehtml += '<div class="dashboard-column left profile">Display Name:</div>';
    profilehtml += '<div class="dashboard-column right profile">' + display_name + '</div>';
    profilehtml += '</div>';
    profilehtml += '<div class="dashboard-team-container profile">';
    profilehtml += '<div class="dashboard-column left profile">Email Address:</div>';
    profilehtml += '<div class="dashboard-column right profile">' + email + '</div>';
    profilehtml += '</div>';
    $('.dashboard-modal-profile-content').html(profilehtml);
}

function createNewTeam() {
    $('#teams-title').val('');
    $('#teams-description').val('');
    $('#teams-title').prop('disabled', false);
    $('#teams-description').prop('disabled', false);
    $('#SprintLength').prop('selectedIndex', -1);
    $('#planning_day').prop('selectedIndex', -1);
    $('#sprint_review_day').prop('selectedIndex', -1);
    $('#retrospective_day').prop('selectedIndex', -1);
    /*$('#sprint_daily_planning').datepicker().val('');*/
    /*$('#PO-name').html('');*/
    $('#planning_timepicker').timepicki();
    $('#daily_scrum_timepicker').timepicki();
    $('#review_timepicker').timepicki();
    $('#retrospective_timepicker').timepicki();
    $('#planning_timepicker').val('');
    $('#daily_scrum_timepicker').val('');
    $('#review_timepicker').val('');
    $('#retrospective_timepicker').val('');
    $('.teams-modal #teams-caption').html("Create New Team");
    var modal = $('.teams-modal');
    modal.attr("style","visibility: visible;");
    $('.manage-set').css('visibility','hidden');
    $('.manage-set').css('display','none');
    get_current_team_member();
    get_backlogs();
}

function saveTeam() {
    var title, descriptions, planning_time_picker,daily_scrum_time_picker,review_time_picker,retrospective_time_picker,sh_member;
    var database = firebase.database();
    var teamsref = database.ref('teams/');
    title = $('#teams-title');
    descriptions = $('#teams-description');
    sprintlength = $('#SprintLength option:selected').val();
    planning_day = $('#planning_day option:selected').val();
    sprint_review_day = $('#sprint_review_day option:selected').val();
    retrospective_day = $('#retrospective_day option:selected').val();
    planning_time_picker = $('#planning_timepicker');
    daily_scrum_time_picker = $('#daily_scrum_timepicker');
    review_time_picker = $('#review_timepicker');
    retrospective_time_picker = $('#retrospective_timepicker');
    var hasblank = false;
    if(title.val() == ""){
        $('.Teams_DTE_Field_Error.error-teams-title').css("display","block");
        hasblank = true;
    }else{
        $('.Teams_DTE_Field_Error.error-teams-title').css("display","none");
    }

    if(descriptions.val() == ""){
        $('.Teams_DTE_Field_Error.error-teams-description').css("display","block");
        hasblank = true;
    }else{
        $('.Teams_DTE_Field_Error.error-teams-description').css("display","none");
    }

    if(!hasblank){
        var date_planning = new Date(dateEvent(planning_day, planning_time_picker.val()));
        var date_daily_scrum = new Date(dateEvent("Monday", daily_scrum_time_picker.val()));
        var date_review = new Date(dateEvent(sprint_review_day, review_time_picker.val()));
        var date_retro = new Date(dateEvent(retrospective_day, retrospective_time_picker.val()));
        var edit_key = $('#team_edit_key');
        if(edit_key.val() == ''){
             save_team_to_firebase(title.val(),descriptions.val(),sprintlength,dayArr[planning_day],dayArr[sprint_review_day],date_planning.toJSON(),date_daily_scrum.toJSON(),date_review.toJSON(),dayArr[retrospective_day],date_retro.toJSON());
        }
        else{
            update_team(title.val(),descriptions.val(),sprintlength,dayArr[planning_day],dayArr[sprint_review_day],date_planning.toJSON(),date_daily_scrum.toJSON(),date_review.toJSON(),dayArr[retrospective_day],date_retro.toJSON(),edit_key.val());
        }
        update_members();
        closeModal();
        //location.reload(true);
        $('.dashboard-team-single').empty();
        getMyTeams();
    }
}

function dateEvent(day, time){
    var eventDate = new Date();
    var dayNum = dayArr[day];
    var day_dif = eventDate.getDay() - dayNum;
    var date_dif = eventDate.getDate() - day_dif;
    var date_val = eventDate.setDate(date_dif);
    return eventDate.toDateString() + " " + time;
}

function update_team(title ,descriptions, length,planday,reviewday,plantimepicker,scrumtimepicker,reviewtimepicker,retrospectiveday,retrospectivetimepicker,key)
{
    var database = firebase.database();
    database.ref('/teams/' + key).update({
      title: title,
      descriptions: descriptions,
      sprintlength: length,
      planning_day: planday,
      planning_time_picker: plantimepicker,
      daily_scrum_time_picker: scrumtimepicker,
      sprint_review_day: reviewday,
      review_time_picker: reviewtimepicker,
      retrospective_day: retrospectiveday,
      retrospective_time_picker: retrospectivetimepicker
   });
   return key;
}

function save_team_to_firebase(title ,descriptions, length,planday,reviewday,plantimepicker,scrumtimepicker,reviewtimepicker,retrospectiveday,retrospectivetimepicker) {
    var database = firebase.database();
    var tmp_key = database.ref('teams/').push().key;
    key_holder = tmp_key;
    var current_user = $('#user_key').val();

    database.ref('/teams/' + tmp_key).set(
    {
      backlogs: backlog_create,
      title: title,
      descriptions: descriptions,
      sprintlength: length,
      status: "active",
      key:tmp_key,
      planning_day: planday,
      planning_time_picker: plantimepicker,
      daily_scrum_time_picker: scrumtimepicker,
      sprint_review_day: reviewday,
      review_time_picker: reviewtimepicker,
      retrospective_day: retrospectiveday,
      retrospective_time_picker: retrospectivetimepicker,
      teams_edit: "<a class='edit_link'  onclick='edit_teams(\""+ tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_teams_modal(\""+ tmp_key +"\");' href='#'>Delete</a>"
      
    });
   
    //added for saving the current product owner
    database.ref('/teams/' + tmp_key + '/members').set({
        product_owner: current_user,
    });
    //end added

    return tmp_key;
}

function editTeam(team_key){
    $('#stake-select').empty();
    $(".teams-modal #teams-caption").html("Edit Team");
    $(".manage-set").css("display", "inline-block");
    $('#planning_timepicker').timepicki();
    $('#daily_scrum_timepicker').timepicki();
    $('#review_timepicker').timepicki();
    $('#retrospective_timepicker').timepicki();

    var current_user = $('#user_key').val();
    var database = firebase.database();
    var users = database.ref('user');
    $("#team_edit_key").val(team_key);
    database.ref('teams').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var team_child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var thiskey = team_key;
            if(key == thiskey){
                assignedteam=team_child_data.title;
                users.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var child_data = childSnapshot.val();
                        var key = childSnapshot.key;

                        //Day of Sprint Event
                        if(team_child_data.sprintlength == "1 Week"){
                            $('select option[value="1 Week"]').attr("selected",true);
                        }else if(team_child_data.sprintlength == "2 Weeks"){
                            $('select option[value="2 Weeks"]').attr("selected",true);
                        }else if(team_child_data.sprintlength == "3 Weeks"){
                            $('select option[value="3 Weeks"]').attr("selected",true);
                        }else{
                            $('select option[value="4 Weeks"]').attr("selected",true);
                        }

                        var planning_day_string = dayArrKeys[dayEvent(team_child_data.planning_time_picker)];

                        if(planning_day_string == "Monday"){
                            $('#planning_day option[value="Monday"]').attr("selected",true);
                        }else if(planning_day_string == "Tuesday"){
                            $('#planning_day option[value="Tuesday"]').attr("selected",true);
                        }else if(planning_day_string == "Wednesday"){
                            $('#planning_day option[value="Wednesday"]').attr("selected",true);
                        }else if(planning_day_string == "Thursday"){
                            $('#planning_day option[value="Thursday"]').attr("selected",true);
                        }else if(planning_day_string == "Friday"){
                            $('#planning_day option[value="Friday"]').attr("selected",true);
                        }else if(planning_day_string == "Saturday"){
                            $('#planning_day option[value="Saturday"]').attr("selected",true);
                        }else{ 
                            $('#planning_day option[value="Sunday"]').attr("selected",true);
                        }

                        var review_day_string = dayArrKeys[dayEvent(team_child_data.review_time_picker)];

                        if(review_day_string == "Monday"){
                            $('#sprint_review_day option[value="Monday"]').attr("selected",true);
                        }else if(review_day_string == "Tuesday"){
                            $('#sprint_review_day option[value="Tuesday"]').attr("selected",true);
                        }else if(review_day_string == "Wednesday"){
                            $('#sprint_review_day option[value="Wednesday"]').attr("selected",true);
                        }else if(review_day_string == "Thursday"){
                            $('#sprint_review_day option[value="Thursday"]').attr("selected",true);
                        }else if(review_day_string == "Friday"){
                            $('#sprint_review_day option[value="Friday"]').attr("selected",true);
                        }else if(review_day_string == "Saturday"){
                            $('#sprint_review_day option[value="Saturday"]').attr("selected",true);
                        }else{ 
                            $('#sprint_review_day option[value="Sunday"]').attr("selected",true);
                        }

                        var retrospective_day_string = dayArrKeys[dayEvent(team_child_data.retrospective_time_picker)];

                        if(retrospective_day_string == "Monday"){
                            $('#retrospective_day option[value="Monday"]').attr("selected",true);
                        }else if(retrospective_day_string == "Tuesday"){
                            $('#retrospective_day option[value="Tuesday"]').attr("selected",true);
                        }else if(retrospective_day_string == "Wednesday"){
                            $('#retrospective_day option[value="Wednesday"]').attr("selected",true);
                        }else if(retrospective_day_string == "Thursday"){
                            $('#retrospective_day option[value="Thursday"]').attr("selected",true);
                        }else if(retrospective_day_string == "Friday"){
                            $('#retrospective_day option[value="Friday"]').attr("selected",true);
                        }else if(retrospective_day_string == "Saturday"){
                            $('#retrospective_day option[value="Saturday"]').attr("selected",true);
                        }else{ 
                            $('#retrospective_day option[value="Sunday"]').attr("selected",true);
                        }

                        //Time of Sprint Event
                        $("#planning_timepicker").val(timeEvent(team_child_data.planning_time_picker));
                        $("#daily_scrum_timepicker").val(timeEvent(team_child_data.daily_scrum_time_picker));
                        $("#review_timepicker").val(timeEvent(team_child_data.review_time_picker));
                        $("#retrospective_timepicker").val(timeEvent(team_child_data.retrospective_time_picker));



                        if(team_child_data.members.product_owner == current_user){   
                               console.log("this is a member");
                               $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');                               
                               return true;
                        }
                        else if(team_child_data.members.scrum_master == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');                                
                                return true;
                        }
                        else if(team_child_data.members.team_member1 == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');                                
                                return true;
                        }
                        else if(team_child_data.members.team_member2 == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');                                
                                return true;
                        }
                        else if(team_child_data.members.team_member3 == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');                                
                                return true;
                        }
                        else if(team_child_data.members.team_member4 == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');                                
                                return true;
                        }
                        else if(team_child_data.members.team_member5 == current_user){
                               console.log("this is a member");
                               $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');                               
                               return true;
                        }
                        else if(team_child_data.members.team_member6 == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');
                                return true;
                        }
                        else if(team_child_data.members.team_member7 == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');
                                return true;
                        }
                        else if(team_child_data.members.team_member8 == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                $('#teams-title').removeAttr('disabled', '');
                                $('#teams-description').removeAttr('disabled', '');
                                return true;
                        }
                        else if(team_child_data.members.team_member9 == current_user){
                                console.log("this is a member");
                                $('#manage-teams-button').css('display','inline-block');
                                return true;
                        }else{
                            $('#manage-teams-button').css('display','none');
                            $('#teams-title').attr('disabled', '');
                            $('#teams-description').attr('disabled', '');
                            return true;
                        }


                    });
               
                });
            }
        });
    });
    loadTeamData(team_key);
    var user_role=$("#user_role"+ team_key).val();
    var team_del= "<a class='remove_link' id='team-del' onclick=\"display_delete_teams_modal('"+ team_key +"');\" href='#'>Delete Scrum Team</a>";
    if(user_role != "Product Owner")
        team_del = "<u> Delete Scrum Team </u>";
    $("#team-danger").html(team_del);
}
function display_delete_teams_modal(key){
    var deletebutton = $('#delete-teams');
    deletebutton.attr("onclick","delete_teams(\""+ key +"\");");
    var modal = $('.delete-teams-modal');
    modal.attr("style","visibility: visible;");
    closeModal();
}
function delete_teams(key){
    delete_teams_group(key);
    close_delete_teams_modal();
}
function close_delete_teams_modal(){
    var modal = $('.delete-teams-modal');
    modal.attr("style","visibility: hidden;");
}
function delete_teams_group(key){
    var database = firebase.database();
    database.ref('/teams/' + key).remove();
    location.reload();
    return key;
}

function loadTeamData(key){
    var teams = [];
    var database = firebase.database();
    var ref = database.ref('teams/' + key);
    ref.once('value').then(function(snapshot) {
                    var data = snapshot.val();
                    data.title,
                    data.descriptions,
                    data.key,
                    data.teams_edit
           title = $('#teams-title');
           descriptions = $('#teams-description');
            title.val(data.title);
            descriptions.val(data.descriptions);
            title = $('.teams-modal #teams-caption');
            title.html("Team Administration");
            var modal = $('.teams-modal');
            modal.attr("style","visibility: visible;");
            $('.manage-set').css('visibility','visible');
            $('.manage-set').css('display','inline-block');
    });
    get_team_details();
}


function show_members_modal(){
    var assignedteam = "";
    var database = firebase.database();
    database.ref('teams').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var thiskey = $('#team_edit_key').val();
            
            $("#PO-select option").each(function(){
               
                if(key == $(this).val()){
                    console.log($(this).val());
                }

            });

        });
    });
    get_team_details();
    $('.add-users-teams-modal').css('visibility','visible');
    $('.modal-content.teams-modal').css("visibility", "hidden");
}

function get_team_details(){
    var teamkey = $('#team_edit_key').val();
    var database = firebase.database();
    var ref = database.ref('teams/' + teamkey +'/members');
    var backlogs = database.ref('teams/' + teamkey);
    ref.once('value').then(function(snapshot) {
        var child = snapshot.val();
        if(child != null){
            var members = [child.team_member1,child.team_member2,child.team_member3,child.team_member4,child.team_member5,child.team_member6,child.team_member7,child.team_member8,child.team_member9];
            var shholders = child.stakeholders;
            get_current_team_member(child.product_owner,child.scrum_master,members, shholders);
        }
        else{
            get_current_team_member();
        }
    });
    backlogs.once('value').then(function(snapshot) {
        var child = snapshot.val();
        get_backlogs(child.backlogs);
    });
}

function get_current_team_member(currentpo = "",currentsm="",currentmemebers=[""], currentsh){
    var database = firebase.database();
    var users = database.ref('user');
    var teams = database.ref('teams');
    /*var membernumber = 1;*/
    var thiskey = $('#team_edit_key').val();
    $('#PO-select').html('');
    $('#PO-select').append('<option disabled="true" selected="" value="">Choose Product Owner</option>');
    $('#SM-select').html('');
    $('#SM-select').append('<option disabled="true" selected="" value="">Choose Scrum Master</option>');
    $('#members-select').html('');
    users.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
            var key = childSnapshot.key; 
            if(child_data.displayname != undefined && child_data.displayname != "" ){

                var formember = "input[value=" + key + "]";
                user_email = child_data.email.toLowerCase();
                var provider;
                //console.log(provider);
                if(user_email.includes("gmail.com")){
                    //console.log("TEST");
                    //console.log(child_data.displayname+ '-'+provider);
                    provider = "Gmail";
                }else{
                    provider = "O365";
                }
                var display_member_name = child_data.displayname + ' - '+provider;
                if(key == currentpo ){
                    $('#PO-select').append('<option value="'+ key+'" selected>'+display_member_name+'</option>');
                }else{
                    $('#PO-select').append('<option value="'+ key+'">'+display_member_name+'</option>');                    
                }
                if(key == currentsm){
                    $('#SM-select').append('<option value="'+ key+'" selected><span class="und_text">'+display_member_name+'</span></option>');
                }else{
                    $('#SM-select').append('<option value="'+ key+'"><span class="und_text">'+display_member_name+'</span></option>');
                }

                if(ismember(key,currentmemebers)){
                    $('#members-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="members_checkbox" name="members_checkbox" value="'+key+'"checked><span class="und_text">'+display_member_name+'</span></tr></table>');
                    //$('#stake-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="stakeholder_checkbox" name="stakeholder_checkbox" value="'+key+'"checked><span class="und_text">'+display_member_name+'</span></tr></table>');
                }else{
                    $('#members-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="members_checkbox" name="members_checkbox" value="'+key+'"><span class="und_text">'+display_member_name+'</span></tr></table>');
                    //$('#stake-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="stakeholder_checkbox" name="stakeholder_checkbox" value="'+key+'"checked><span class="und_text">'+display_member_name+'</span></tr></table>');
                }

                if(isstakeholder(key,currentsh)){
                    $('#stake-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="stakeholder_checkbox" name="stakeholder_checkbox" value="'+key+'"checked><span class="und_text">'+display_member_name+'</span></tr></table>');
                }else{
                    $('#stake-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="stakeholder_checkbox" name="stakeholder_checkbox" value="'+key+'"><span class="und_text">'+display_member_name+'</span></tr></table>');
                }
            }
        });
        update_teamdisplay();
    });
}

function update_teamdisplay(){
    var database = firebase.database();
    var users = database.ref('user');
    var j=0;
    users.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var child_data = childSnapshot.val();
        var key = childSnapshot.key;
        var thiskey = $('#team_edit_key').val();
            var formember = "input[value=" + key + "]";
            if(key == $('#PO-select').val()) { 
                $(formember).attr('checked', false);
                $(formember).attr("disabled", true);
                $(formember + " + .und_text").css("text-decoration", "line-through");
            }else {
                $(formember).attr("disabled", false);
                $(formember + " + .und_text").css("text-decoration", "none");
            }

            var forsm = "#SM-select option[value=" + key + "]";
            if(key == $('#PO-select').val()) {
                $(forsm).attr("disabled", true);
                $(forsm).css("text-decoration", "line-through");
            } else {
                $(forsm).attr("disabled", false);
                $(forsm).css("text-decoration", "none");
            }

            j++;
        });
    });
}

function update_teamselectdisplay(){
    var database = firebase.database();
    var users = database.ref('user');
    users.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var thiskey = $('#team_edit_key').val();
            var forpo = "#PO-select option[value=" + key + "]";
            if(key == $('#SM-select').val()) {
                $(forpo).attr("disabled", true);
                $(forpo).css("text-decoration", "line-through");
            } else {
                $(forpo).attr("disabled", false);
                $(forpo).css("text-decoration", "none");
            }
        });
    });
}

function get_backlogs(currentbacklogs){
    var database = firebase.database();
    var backlogs = database.ref('backlogs');
    $('#backlogs-select').html('');
    var thiskey = $('#team_edit_key').val();
    var i = 0;
    /*var backlognumber = 1;*/
    backlogs.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child = childSnapshot.val();
            if(child.status != "archive"){
                var is_member_backlog = false;
                user_backlogs.forEach(function(child_data){
                    if(child_data.key == child.key) {
                        is_member_backlog = true;
                        return;
                    }
                });

                if(is_member_backlog) {
                    if(isselectedbacklog(child.key,currentbacklogs)){
                        $('#backlogs-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="backlog_checkbox" name="backlog_checkbox" value="'+child.key+'" checked><span class="und_text">'+child.title+'</span> - '+child.status+'</table>');
                    }
                    else{
                        $('#backlogs-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="backlog_checkbox" name="backlog_checkbox" value="'+child.key+'"><span >'+child.title+'</span> - '+child.status+'</tr></table>');
                        /*backlognumber--;*/
                    }
                }
                i++;
                /*backlognumber++;*/
            }
        });
    });
}

function ismember(userkey,members){
    var ismember = false;
    members.forEach(function(member){
        if(userkey == member){
            ismember = true;
        }
    });
    return ismember;
}
function isstakeholder(userkey,shmembers){
    var isholder = false;
    if(shmembers !=undefined){
        var splitshmem = shmembers.split(",");
        splitshmem.forEach(function(shmember){
            if(userkey == shmember){
                isholder = true;
            }
        });
    }
    return isholder;
}

function isselectedbacklog(key, backlogs){
    var isselected = false;
    if(backlogs !=undefined){
        var splitbacklogs = backlogs.split(",");
        splitbacklogs.forEach(function(backlog){
            if(backlog == key){
                isselected = true;
            }
        });
    }
    return isselected;
}

function update_members(){
    var database = firebase.database();
    var po_key=$('#PO-select').val();
    var sm_key=$('#SM-select').val();
    var teamkey = ($('#team_edit_key').val() == "") ? key_holder : $('#team_edit_key').val();
    var members = ["","","","","","","","",""];
    var backlogs ="";
    var shmembers = "";
    var ctr =0;
    $('.members_checkbox:checked').each(function(){        
        key = $(this).val();
        members[ctr] = key;
        ctr++;
    });

    $('.stakeholder_checkbox:checked').each(function(){           
        key = $(this).val();
        shmembers +=key +",";   
    });
    if(shmembers != ""){
        shmembers = shmembers.slice(0,-1)
    }

    $('.backlog_checkbox:checked').each(function(){           
        key = $(this).val();
        backlogs +=key +",";   
    });
    if(backlogs != ""){
        backlogs = backlogs.slice(0,-1)
    }
    allbacklogs = backlogs;
    database.ref('teams/'+ teamkey).update(
    {
        "members/scrum_master": sm_key,
        "members/product_owner": po_key,
        "members/team_member1": members[0],
        "members/team_member2": members[1],
        "members/team_member3": members[2],
        "members/team_member4": members[3],
        "members/team_member5": members[4],
        "members/team_member6": members[5],
        "members/team_member7": members[6],
        "members/team_member8": members[7],
        "members/team_member9": members[8],
        "members/stakeholders": shmembers,
        backlogs: backlogs
        
    });  
    $('.dashboard-team-single').empty();
}

function selectTeamBacklog() {
    var team_dropdown = backlog_dropdown = "";
    user_teams.forEach(function(child_data){
        team_dropdown += '<option value="'+ child_data.key+'">'+child_data.title+'</option>';
    });
    /*user_backlogs.forEach(function(child_data){
        backlog_dropdown += '<option value="'+ child_data.key+'">'+child_data.title+'</option>';
    });*/
    $('#scrum-team').empty();
    $('#scrum-team').append('<option>Choose Team</option>');
    $('#scrum-team').append(team_dropdown);
    //$('#scrum-backlog').append(backlog_dropdown);
    $('.modal-content.scrum-events-modal').css("visibility", "visible");
}

function proceedToSprintPlanning() {
    if($("#scrum-team").val() == "Choose Team") {
        $("#scrum-team").focus();
        $("#scrum-team").css("border", "1px solid #f00 !important");
        return;
    }
    if($("#scrum-backlog").val() == "Choose Backlog") {
        $("#scrum-backlog").focus();
        $("#scrum-backlog").css("border", "1px solid #f00 !important");
        return;
    }
    closeModal();
    
    var backlog_key = $("#scrum-backlog option:selected").val();
    var backlog_title = $("#scrum-backlog option:selected").text();
    var team_key=$("#scrum-team option:selected").val();
    var user_role=$("#user_role"+ team_key).val();
    showProductBacklog(backlog_key, backlog_title, 'sprint_planning',user_role);
}

function createNewBacklog(team_key) {
    $('#teams-select').empty();
    $('.modal-content.backlogs-modal').css("visibility", "visible");
    $("#team_edit_key").val(team_key); 
    list_teams.forEach(function(list){
        if(team_key != list['key']){
            $('#teams-select').append( '<table><tr><input type="checkbox" class="scrum_teams_checkbox" name="scrum_teams_checkbox" value="'+list['key']+'"><span class="und_text">'+ list['title'] +'</span></tr></table>');
        }else{
            $('#teams-select').append( '<table><tr><input type="checkbox" class="scrum_teams_checkbox" name="scrum_teams_checkbox" value="'+list['key']+'" checked disabled><span class="und_text">'+ list['title'] +'</span></tr></table>');
        }
    });
    console.log(list_teams);
}

function save_backlog() {
    var title, descriptions;
    var database = firebase.database();
    var backlogsref = database.ref('backlogs_stories/');

    title = $('#backlogs-title');
    descriptions = $('#backlogs-description');
    var hasblank = false;
    if(title.val() == ""){
        $('.Backlog_DTE_Field_Error.error-backlogs-title').css("display","block");
        hasblank = true;
    }else{
        $('.Backlog_DTE_Field_Error.error-backlogs-title').css("display","none");
    }

    if(descriptions.val() == ""){
        $('.Backlog_DTE_Field_Error.error-backlogs-description').css("display","block");
        hasblank = true;
    }else{
        $('.Backlog_DTE_Field_Error.error-backlogs-description').css("display","none");
    }

    if(!hasblank){
        save_backlog_to_firebase(title.val(),descriptions.val());
        closeModal();
        location.reload();  
    }
}

function save_backlog_to_firebase(title ,descriptions)
{
    var team_key = $('#team_edit_key').val();
    var database = firebase.database();
    var databaseformax = firebase.database();
    var tmp_key = database.ref('backlogs/').push().key;
    var backlogs = "";
    var newbacklog = "";
    var new_team = false;
    database.ref('/backlogs/' + tmp_key).set({
      title: title,
      descriptions: descriptions,
      status: "active",
      key:tmp_key, 
      edit_link: "<a class='edit_link'  onclick='edit_backlogs(\""+ tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_backlog_modal(\""+ tmp_key +"\");' href='#'>Delete</a>"
    });

    databaseformax.ref(tmp_key + '/max').set({
        storyid: 0
    });


    var createdSh="Member with Scrum Role Stakeholder created the backlog " + title + ".";     
    createdSh=($("#user_role"+team_key).val()=="Stakeholder") ? createdSh : "";     
    var changed_arr=[];     
    if (createdSh != '') {      
      changed_arr.push({        
          changed_column: "Backlog",        
          old_value: "",        
          new_value: "",        
          modified_by: firebase.auth().currentUser.email,       
          story: "",        
          remarks: createdSh        
      });       
      $.ajax({      
          type: "POST",     
          url: "log.php",       
          data: {data : changed_arr, backlog_path: tmp_key },       
          success: function(result){        
          }     
      });       
    }

    user_backlogs.push({key: tmp_key, title: title});
    
    var count = 0;
    $('.scrum_teams_checkbox:checked').each(function(){ 
        
        key = $(this).val();
        $('.user-backlog-' + key + ' a').each(function() {

            var backlog = $(this).attr('data-backlog');
            if(backlogs == '' && backlog !== undefined) {
                backlogs = backlog;
                count += 1;
            } else {
                if(backlog === undefined) {
                    backlog = tmp_key;
                }
                backlogs += ',' + backlog;
                count += 1;
            }

        });
        console.log(key +' - '+backlogs);

        database.ref('teams/'+ key).update(
        {
            backlogs: backlogs
        });
        
    });
    
    backlog_create = backlogs;
    
    if(count == 0 || backlogs === undefined) {
        new_team = true;
        backlogs = tmp_key;
    }
    
    /*database.ref('teams/'+ team_key).update(
    {
        backlogs: backlogs  
    });*/
 
    var newbackloghtml = "";
    if(new_team) {
        newbackloghtml = '<a onclick="showProductBacklog(\'' + tmp_key + '\',\'' + title + '\', \'\',\'\')" href="#" data-backlog="' + tmp_key + '">' + title + '</a>';
    } else {
        newbackloghtml = ', ' + '<a onclick="showProductBacklog(\'' + tmp_key + '\',\'' + title + '\', \'\',\'\')" href="#" data-backlog="' + tmp_key + '">' + title + '</a>';
    }
    $('.user-backlog-' + team_key + ' .create-new-link').remove();
    var team_backlogs = $('.user-backlog-' + team_key).html();
    team_backlogs += newbackloghtml + '&nbsp;&nbsp;<a href="#" class="create-new-link" onclick="createNewBacklog(\'' + team_key + '\')" >&lt;Create New&gt;</a>'; 
    $('.user-backlog-' + team_key).empty();
    $('.user-backlog-' + team_key).html(team_backlogs);
    
    return tmp_key;
}

function closeModal() {
    $('.dashboard-modal-profile').css("visibility", "hidden");
    $('.modal-content.teams-modal').css("visibility", "hidden");
    $('.add-users-teams-modal').css("visibility", "hidden");
    $('.modal-content.scrum-events-modal').css("visibility", "hidden");
    $('.modal-content.best-practices-modal').css("visibility", "hidden");
    $('.modal-content.backlogs-modal').css("visibility", "hidden");
    $('.manage-set').css("visibility", "hidden");
    $('#team_edit_key').val("");
    $('#stake-select').empty();
}

function returntologin(){
    window.location.href = "https://rocketscrum.com";
}

function addBestPracticesStories(team) {
    var backlog_dropdown = "";
    $("#scrum-backlog1").empty();
    user_backlogs.forEach(function(child_data){
        if(child_data.team == team) {
            backlog_dropdown += '<option value="'+ child_data.key+'">'+child_data.title+'</option>';    
        }
    });
    $('#scrum-backlog1').append(backlog_dropdown);
    $("#best-practices-team").val(team);
    $('.modal-content.best-practices-modal').css("visibility", "visible");
}

function addStories() {
    $(".dashboard-loading-animation-best-practices").css("display", "block");
    var backlog = $("#scrum-backlog1 option:selected").val();
    var group = $("#scrum-group option:selected").val();
    if(backlog == "" || backlog === undefined || group == "" || group === undefined || group == "Select Group") {
        $(".dashboard-loading-animation-best-practices").css("display", "none");
        $("#error-message").html("Please enter required fields.");
    } else {
        addBestPractices(backlog, group, $("#best-practices-team").val());
    }
}

function addBestPractices(backlog, group, team) {
    console.log("Add Best Practices: " + backlog + " " + group + " " + team);
    load_bestpractice_data(backlog, group, team);
}

function load_bestpractice_data(backlog, group, team){
    var bestpractice = [];
    var database = firebase.database();
    var ref = database.ref('bestpractice/');
    
    ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            i++;
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
            if(child_data.group == group) {
                var database1 = firebase.database();
                var maxref = database1.ref(backlog + '/max');
                var i = 0;
                maxref.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot1) {
                        i++;
                        var child_data1 = childSnapshot1.val();
                        var storyid = parseInt(child_data1) + 1; 
                        
                        add_best_practice_stories(bestpractice, backlog, team, storyid, key, child_data.storyid, child_data.sprint_number, child_data.as_a, child_data.i_want, child_data.so_that, child_data.acceptance_test, child_data.story_points, child_data.comments);
                    });
                    if(i == 0) {
                        add_best_practice_stories(bestpractice, backlog, team, 1, key, child_data.storyid, child_data.sprint_number, child_data.as_a, child_data.i_want, child_data.so_that, child_data.acceptance_test, child_data.story_points, child_data.comments);
                    } 
                });
            }
        }); 
        $(".dashboard-loading-animation-best-practices").css("display", "none");
        closeModal();
    });
}

function add_best_practice_stories(bestpractice, backlog, team, order_var, scenarios_tmp_key, storyid_var, sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var) {
    var database = firebase.database();
    var scenarios_tmp_key = database.ref(backlog + '/user_stories/').push().key;

    database.ref(backlog +'/user_stories/' + scenarios_tmp_key).set(
    {
      order: order_var,
      key: scenarios_tmp_key,
      storyid: storyid_var,
      sprint_number: sprint_number_var,
      as_a: as_a_var,
      i_want: i_want_var,
      so_that: so_that_var,
      acceptance_test: acceptance_test_var,
      story_points: story_points_var,
      comments: comments_var,
      status: "",
      edit_del: "<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>"
    });

    var database1 = firebase.database();
    database1.ref(backlog + '/max').update(
    {
        storyid: (parseInt(storyid_var))
    });

    return scenarios_tmp_key;
}