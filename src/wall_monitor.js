

var user_backlogs = [];
var backlog_sprintpoints = [];
var backlog_info = [];
var body;
var totalpoints = 0;
var selected_date;
var ispageload = true;
var current_strdate;
var flagcheck = false;
var selectcheck = false;
var checkFirst = false;
var planday = "";
var dayArr = {Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6};

$(function () {


body = $('#wallmonitor_body');


getsprintdate = getstartsprintdate(new Date());
current_strdate = ("0" + (getsprintdate.getMonth() + 1)).slice(-2) + '/' + ("0" + getsprintdate.getDate()).slice(-2) + '/' + getsprintdate.getFullYear();


if (window.performance) {
  //console.info("window.performance work's fine on this browser");
   if (performance.navigation.type == 1) {
    getuserselecteddate($('#selected_user').val());
  } else {
    checkFirst = true;  
    getusercurrentdate($('#selected_user').val());
  }
}else{
    getuserselecteddate($('#selected_user').val());
}
 

});

function getstartsprintdate(d){
    var  d = new Date(d);
    planday = $("#planday").val();
    var day_dif = d.getDay() - planday;
    var date_dif = d.getDate() - day_dif;
    var date_val = d.setDate(date_dif);
    var date1 = d.toInputFormat();
    var date_val_new = new Date(date1);
    return date_val_new;
    //var day = d.getDay(),
    //diff = d.getDate() - day + (day == 0 ? -6:1); 
    //return new Date(d.setDate(diff));
}

function getuser_backlogs(userkey){
var database = firebase.database();
var teamref = database.ref('teams/');
var backlog_ref = database.ref('backlogs/');
var is_member = false;
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
        });

        var backlogs_info = [];
        console.log("Current user backlogs:" + currentuser_backlogs);
        backlog_ref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                currentuser_backlogs.forEach(function(currentuser_backlog){
                    if(currentuser_backlog == childSnapshot.val().key){
                        backlogs_info.push({key: currentuser_backlog, title: childSnapshot.val().title});
                    }
                    
                });

            });
            dropdown = "";
            var backlog_names = [];
            backlogs_info.forEach(function(child_data){
                    backlog_names.push(child_data.key);
                    dropdown += '<option selected="selected" value="'+ child_data.key+'" >'+child_data.title+'</option>';
                
            });
            get_backlog_info(backlog_names);
            
            

        });

    });

}



function get_backlog_info(backlog_names){
    var database = firebase.database();
    var ref = database.ref("backlogs");
            ref.once('value').then(function(snapshot) {
                snapshot.forEach(function(child_snapshot){
                    backlog_names.forEach(function(backlog){
                        if(backlog == child_snapshot.val().key && child_snapshot.val().status != "archive"){
                            user_backlogs.push(child_snapshot.val());
                        }
                    });

                });
                get_sprint_number(user_backlogs,0, selected_date)
                
            }); 
}
function display_last_backlogs(user_backlogs){
    var sprinttotal = 0;
    user_backlogs.forEach(function (user_backlog){
            backlog_info.forEach(function (backlog_points){
                if(backlog_points.title == user_backlog.title){
                    sprinttotal = sprinttotal + parseInt(backlog_points.sprint_total_points);
                }
            });
        })
    if(sprinttotal > 0){
        return true;
    }else{
        var check = false;
        if(selectcheck != true){
            getlastsprint($('#selected_user').val(), check);
        }
    }
}
function display_backlogs(user_backlogs){
    //$('#main-loading-container').css(" display","block");
    flagcheck = display_last_backlogs(user_backlogs);
    if(flagcheck == true){
        var output = "";
        totalpoints = 0;
        user_backlogs.forEach(function (user_backlog){
            output += "<div> <ul> <li class='section-2 wm_center'><span>" + user_backlog.title + "</span></li>";

            
            var planned = false
            backlog_info.forEach(function (backlog_points){
                if(backlog_points.key == user_backlog.key){
                    output += "<li class='wm_center'><span>"+ backlog_points.sprint_total_points+"</span></li>"
                    output += "<li class='wm_center'><span>"+ backlog_points.number+"</span></li>"
                    totalpoints = totalpoints + parseInt(backlog_points.sprint_total_points);
                    planned = true;
                }
            });
            if(!planned){
                output += "<li class='wm_center'><span>—</span></li>"
                output += "<li class='wm_center'><span>—</span></li>"
            }
            
            output += "<li class='wm_center'><span>MARIEL</span></li>"
            output += "<li class='wm_center'><span>MARIEL</li>"
            output += "</ul>"
            output += "</div>";
        })
    }else{
        var output = "";
        totalpoints = 0;
        user_backlogs.forEach(function (user_backlog){
            output += "<div> <ul> <li class='section-2 wm_center'><span>" + user_backlog.title + "</span></li>";

            
            var planned = false
            backlog_info.forEach(function (backlog_points){
                if(backlog_points.key == user_backlog.key){
                    output += "<li class='wm_center'><span>"+ backlog_points.sprint_total_points+"</span></li>"
                    output += "<li class='wm_center'><span>"+ backlog_points.number+"</span></li>"
                    totalpoints = totalpoints + parseInt(backlog_points.sprint_total_points);
                    planned = true;
                }
            });
            if(!planned){
                output += "<li class='wm_center'><span>—</span></li>"
                output += "<li class='wm_center'><span>—</span></li>"
            }
            
            output += "<li class='wm_center'><span>MARIEL</span></li>"
            output += "<li class='wm_center'><span>MARIEL</li>"
            output += "</ul>"
            output += "</div>";
        })
    }
        body.html(body.html() + output);
        $("#total_points").html(totalpoints);
        var d = new Date();
        var planning_day = planday;

        $("#current_date").val(d.toInputFormat());
        $('#sprint_start_date_wallmonitor').datepicker({
            beforeShowDay: function(date) {
                var day = date.getDay();
                if(day == planning_day){
                   return [true];
                 }
                  return [false];
                },
            maxDate:0
        });
        
        
         $('#sprint_start_date_wallmonitor').change(function(){
                var date = new Date(this.value)
                date.setDate(date.getDate() + 7);
                $('#sprint_end_date_wallmonitor').val(date.toInputFormat());
                setuserselecteddate($('#selected_user').val(), this.value);
                if(!ispageload){
                    setTimeout(function(){
                        location.reload();

                    },2000);
                

                }
                else{
                    ispageload = false;
                }
        });

        displayselecteddate();
        $('#main-loading-container_wall_monitor').css("display","none");   
        $('#wallmonitor_status').css("display","block");   
}

Date.prototype.toInputFormat = function() {
       var yyyy = this.getFullYear().toString();
       var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
       var dd  = this.getDate().toString();
       return   (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]) + "/" + yyyy; // padding
    };


var selected_date_holder1 = new Date();
function get_sprint_number(backlogs,index,date){
    var database = firebase.database();
    var selected_date_holder = new Date(date);
    if(backlogs[index] != undefined){
    var ref = database.ref(backlogs[index].key +"/sprints/");
            ref.once('value').then(function(snapshot) {
                var number = 0;
                snapshot.forEach(function (child_snapshot){
                    var temp_number = child_snapshot.key.split("sprint");
                    var startdate = new Date(date);
                    startdate.setDate(startdate.getDate());
                    var sprintdate = new Date(child_snapshot.val().sprint_start_date);
                    var enddate = new Date(date);
                    enddate.setDate(enddate.getDate() + 6);
                    //var startdate = new Date(selected_date);
                    //var enddate = new Date(selected_date);
                    //enddate.setDate(enddate.getDate() + 7);
                    //if((startdate.getTime() <= sprintdate.getTime()) && (enddate.getTime() >= sprintdate.getTime())){
                    if(sprintdate >= startdate && sprintdate <= enddate){
                        number = parseInt(temp_number[1]);
                        planday = ($("#planday1").val() == "") ? sprintdate.getDay() : $("#planday1").val();
                        selected_date = ($("#planday1").val() == "") ? sprintdate.toInputFormat() : selected_date;
                    }
                });
                if(number != 0){
                    backlog_sprintpoints.push({title:backlogs[index].title, number: number, key:backlogs[index].key})
                }
                get_sprint_number(backlogs,index + 1, selected_date);
            }); 
    }
    else{
        //display_backlogs(user_backlogs);
        var minDate = "02/20/2017";
        if(checkFirst){
            if(backlog_sprintpoints.length == 0 && date > minDate){
                selected_date_holder.setDate(selected_date_holder.getDate() - 7);
                selected_date_holder1 = new Date(selected_date_holder);
            	selected_date = selected_date_holder1.toInputFormat();
                get_sprint_number(backlogs,0, selected_date_holder);
                /*var minDate = new Date("May 20, 2017");
                if(backlog_sprintpoints.length > 0 || date < minDate){
                    if(selected_date_holder1 > selected_date_holder)
                        selected_date_holder1 = new Date(selected_date_holder);
                    selected_date_holder = selected_date;
                    get_sprint_number(backlogs,index + 1, selected_date_holder);
                }
                else{
                    selected_date_holder.setDate(selected_date_holder.getDate() - 7);
                    get_sprint_number(backlogs,index, selected_date_holder);
                }*/
            }
            else{
                if(backlog_sprintpoints.length == 0)
                    selected_date = getsprintdate.toInputFormat();
                get_current_sprint_total(backlog_sprintpoints, 0);
            }
        }/*
        else if(date < minDate){
        	console.log("walang backlog");
        }*/
        else
        	get_current_sprint_total(backlog_sprintpoints, 0);
    }
}

function get_current_sprint_total(backlogs,index){
    var database = firebase.database();
    if(backlogs[index] != undefined){
        var ref = database.ref(backlogs[index].key);
                ref.child('/user_stories/').orderByChild('sprint_number').equalTo(backlogs[index].number).on("value", function(snapshot) {
                    var total = 0;
                    snapshot.val();
                    snapshot.forEach(function (child_snapshot){
                        var data = child_snapshot.val();
                        if(data.status != "trashed" && data.status != "to do"){
                            if(isNaN(parseInt(data.story_points))){
                                total += 0;
                            }else{
                                total += parseInt(data.story_points);
                            }
                        }
                    });
                    backlog_info.push({title:backlogs[index].title, number: backlogs[index].number, key:backlogs[index].key, sprint_total_points:total});
                    get_current_sprint_total(backlogs,index + 1);
                }); 
    }
    else{
        display_backlogs(user_backlogs);
    }
}


function setuserselecteddate(userkey, date){
    var database = firebase.database();
    var user_data = database.ref( "/user/" + userkey + '/');
    user_data.once('value').then(function(snapshot) {
    user_data.update(
       {
          wallmonitor_date: date
       });
    });
}

function getuserselecteddate(userkey){
    var database = firebase.database();
    var user_data = database.ref( "/user/" + userkey + '/');
    
    user_data.once('value').then(function(snapshot) {
        selectcheck = true;
        selected_date = snapshot.val().wallmonitor_date;
        
        if(selected_date != ""){
            getuser_backlogs(userkey);
        }
        else{
            //var newdate = new Date()
            selected_date = getsprintdate.toInputFormat();
            getuser_backlogs(userkey);
        }
        
        
    });
}

function getusercurrentdate(userkey){
    var database = firebase.database();
    var user_data = database.ref( "/user/" + userkey + '/');
    
    user_data.once('value').then(function(snapshot) {
        
        
        selected_date = current_strdate;
        if(selected_date != ""){
            getuser_backlogs(userkey);
        }
        else{
            var newdate = new Date()
            selected_date = newdate.toInputFormat();
            getuser_backlogs(userkey);
        }
        
        
    });
}
function getlastsprint(userkey, check){
    var database = firebase.database();
    var user_data = database.ref( "/user/" + userkey + '/');
    
    user_data.once('value').then(function(snapshot) {
       
        var lastday_date = new Date(getsprintdate);
        var lastday = lastday_date.setDate(getsprintdate.getDate() - 7);

        selected_date = lastday_date.toInputFormat();
        //var lastday = getsprintdate.getDate() - 7
        //var last_sprintdate = ("0" + (getsprintdate.getMonth() + 1)).slice(-2) + '/' + ("0" + lastday).slice(-2) + '/' + getsprintdate.getFullYear();
        //selected_date = last_sprintdate;
        if(selected_date != ""){
            getuser_backlogs(userkey);
        }
        else{
            var newdate = new Date()
            selected_date = newdate.toInputFormat();
            getuser_backlogs(userkey);
        }
        
        
    });
}
function displayselecteddate(){
    $('#sprint_start_date_wallmonitor').css('border', '1px black solid');
    $('#sprint_start_date_wallmonitor').val(selected_date);
    $('#sprint_start_date_wallmonitor').change();
}
