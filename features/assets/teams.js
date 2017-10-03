var i = 0;
var checkkey = $('#teams_edit_key').val();
var storekey=[];
var k=0,l=0;
var database = firebase.database();
var users = database.ref('user');
var saved_users=[];
var current_user;
var allbacklogs="";

$( function() {

    
    //display Content of the body
    $.ajax({
        type: "POST",
        url: "features/teams/teams_content.php",
        data: {search: 'all'},
        success: function(result){
            $("#tabs-teams > h2").text("Manage Teams / Permissions");
            $("#teams-body").html(result);
            $('#create-teams-button').click(create_team);
            $('#deleted-teams-button').click(display_teams);
            $('#save-teams').click(save_teams);
            $('#teams-close').click(close_teams_modal);
           // $('#PO-select').click(remove_temp_options);


            //melvin for selecting members

            load_product_owner();

            $(document).ready(function(){
                var j=0;
                $(".members_checkbox").each (function () {
                     key = $(this).val();

                    console.log("value is: "+key);
                });



                console.log("this is test");
                
            });

            //for changing the option values
            $('#PO-select').on('change', function() {
               update_teamdisplay();
            
                
            });
            //end change

             $('#SM-select').on('change', function() {
               update_teamselectdisplay();
            
                
            });


            //end added melvin
        var ref = database.ref('user');
        ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val(); 


            database.ref('teams').once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                    var key = $('#teams_edit_key').val();
                    var teamskey = $('#teams_edit_key').val();
                    var fbkey = childSnapshot.key;
                    var child_data = childSnapshot.val();
                    var teammembers = ""; 

                    if(fbkey == teamskey){
                        $("#team_list").append('<li>' + child_data.displayname + '</li><li>'+child_data.userrole+'</li>');
                    }
                    
                });
            });


            });

        });

            load_teams_data();
        }
    });
    
});


function load_product_owner(){
    var database = firebase.database();
    var users = database.ref('user');

    users.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
                var key = childSnapshot.key;
            
                $('#PO-select').append('<option value="'+ key+'">'+child_data.displayname+'</option>');
        });
    });
}


function get_team_details(){
    var teamkey = $('#teams_edit_key').val();
    var database = firebase.database();
    var ref = database.ref('teams/' + teamkey +'/members');
    var backlogs = database.ref('teams/' + teamkey);
    ref.once('value').then(function(snapshot) {
       
            var child = snapshot.val();
            if(child != null){
                var members = [child.team_member1,child.team_member2,child.team_member3,child.team_member4,child.team_member5,child.team_member6,child.team_member7,child.team_member8,child.team_member9];
                get_current_team_member(child.product_owner,child.scrum_master,members);
            }
            else{
                get_current_team_member();
            }
            
           //get_backlogs();

  
    });
    backlogs.once('value').then(function(snapshot) {
       
            var child = snapshot.val();
            get_backlogs(child.backlogs);

  
    });
}

function get_current_team_member(currentpo = "",currentsm="",currentmemebers=[""]){
    var database = firebase.database();
    var users = database.ref('user');
    var teams = database.ref('teams');


    var thiskey = $('#teams_edit_key').val();


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
                }else{
                    $('#members-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="members_checkbox" name="members_checkbox" value="'+key+'"><span class="und_text">'+display_member_name+'</span></tr></table>');
                }

            }

        });

        update_teamdisplay();

        
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

function get_backlogs(currentbacklogs){
    var database = firebase.database();
    var backlogs = database.ref('backlogs');
    

    $('#backlogs-select').html('');
    var thiskey = $('#teams_edit_key').val();
    var i = 0;
    backlogs.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child = childSnapshot.val();
            if(child.status != "archive"){
                if(isselectedbacklog(child.key,currentbacklogs)){
                    $('#backlogs-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="backlog_checkbox" name="backlog_checkbox" value="'+child.key+'" checked><span >'+child.title+'</span></tr></table>');
                }
                else{
                    $('#backlogs-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="backlog_checkbox" name="backlog_checkbox" value="'+child.key+'"><span >'+child.title+'</span></tr></table>');
                }
                


                
             

             i++;
            }
             
        });
    });
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

function show_all_members(){
    var product_owner="", scrum_master="",members="";
    var assignedteam="";
    var display_member_name="";
    var database = firebase.database();
    var users = database.ref('user');
    // for getting list of all members

    // for getting list of all members
$('#team_list').html('');
    database.ref('teams').once('value').then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {
            var team_child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var thiskey = $('#teams_edit_key').val();
            if(key == thiskey){
                    assignedteam=team_child_data.title;
                users.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var child_data = childSnapshot.val();
                        var key = childSnapshot.key;

                        if(child_data.email != null){
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

                            display_member_name = child_data.displayname + ' - '+provider;
                        }


                        console.log("key: "+key);
                        
                        if(team_child_data.members.product_owner == key){   
                                product_owner = '<tr><td>' + display_member_name + '</td><td>Product Owner</td></tr>';
                        }

                        if(team_child_data.members.scrum_master == key){
                               scrum_master = '<tr><td>' + display_member_name + '</td><td>Scrum Master</td></tr>';
                        }
                        if(team_child_data.members.team_member1 == key){
                                members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                        if(team_child_data.members.team_member2 == key){
                                members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                        if(team_child_data.members.team_member3 == key){
                               members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                        if(team_child_data.members.team_member4 == key){
                               members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                        if(team_child_data.members.team_member5 == key){
                                members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                        if(team_child_data.members.team_member6 == key){
                                members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                        if(team_child_data.members.team_member7 == key){
                                members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                        if(team_child_data.members.team_member8 == key){
                                members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                        if(team_child_data.members.team_member9 == key){
                                members +='<tr><td>' + display_member_name + '</td><td>Team Member</td></tr>';
                        }
                    });
                $("#team_list").append(product_owner + scrum_master + members);
                });
            }
        });
        

    });

    //end of members list


    
//end of members list

    $('.teams-list').css('display','block');
    $('.teams-modal').css('visibility','hidden');
    $('.manage-set').css('visibility','hidden');

}

function close_team_list() {
   // $("#team_list").empty();
    $('.teams-list').css('display','none');

}


function update_members(){
            
            
    var po_key=$('#PO-select').val();
    var sm_key=$('#SM-select').val();
    var teamkey = $('#teams_edit_key').val();
    var members = ["","","","","","","","",""];
    var backlogs ="";;



    var ctr =0;
    $('.members_checkbox:checked').each(function(){
                    
                key = $(this).val();
                members[ctr] = key;
                ctr++;
               
            });


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
        backlogs: backlogs

        
    });  

    close_manage_members();        
}

function display_teams(){
    var $el = $(this);
    $el.val($el.val() == "Active teams" ? "Deleted teams": "Active teams");
    
    if($('#deleted-teams-button').val()=="Active teams"){  
        load_deleted_teams();
    }else{
        load_teams_data();
        
    }
}

function show_members_modal(){

    var assignedteam="";
    var database = firebase.database();

    database.ref('teams').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var thiskey = $('#teams_edit_key').val();
            
            $("#PO-select option").each(function(){
               
                if(key == $(this).val()){
                    console.log($(this).val());
                }

            });

        });
    });
    get_team_details();
    //get_current_product_owner();
    $('.add-users-teams-modal').css('visibility','visible');
    close_teams_modal();

}


function close_manage_members(){
    $('.add-users-teams-modal').css('visibility','hidden');

}

function save_teams() {
            
    var title, descriptions;
    var database = firebase.database();
    var teamsref = database.ref('teams/');

    title = $('#teams-title');
    descriptions = $('#teams-description');
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
        is_edit = $('#teams_is_edit');
        edit_key = $('#teams_edit_key');
        if(is_edit.val() == ''){
            save_teams_to_firebase(title.val(),descriptions.val());
        }
        else{
            update_teams(title.val(),descriptions.val(),edit_key.val());
        }

        close_teams_modal();
        load_teams_data();
    }

}

function display_teams_modal(){
    hide_error();
    var modal = $('.teams-modal');
    modal.attr("style","visibility: visible;");
}

function edit_teams(key){

    isedit = $('#teams_is_edit');
    isedit.val("True");
    editkey = $('#teams_edit_key');
    editkey.val(key);
    current_user = $('#user_key').val();

    database.ref('teams').once('value').then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {
            var team_child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var thiskey = $('#teams_edit_key').val();
            if(key == thiskey){
                    assignedteam=team_child_data.title;
                users.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var child_data = childSnapshot.val();
                        var key = childSnapshot.key;

                        
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

    load_single_teams_data(key);
    
}

function close_teams_modal(){
    hide_error();
    var modal = $('.teams-modal');
    modal.attr("style","visibility: hidden;");
    $('.manage-set').css('visibility','hidden');
    
    title = $('#teams-title');
    title.val('');
    descriptions = $('#teams-description');
 
    caption = $('#teams-caption');
    caption.html("Create New teams");
    
    isedit = $('#teams_is_edit');
    descriptions.val('');
    isedit.val('');
    $('#teams-title').removeAttr('disabled', '');
    $('#teams-description').removeAttr('disabled', '');

}



function close_delete_teams_modal(){
    var modal = $('.delete-teams-modal');
    modal.attr("style","visibility: hidden;");

    load_teams_data();
    
}


function display_delete_teams_modal(key){

    var deletebutton = $('#delete-teams');
    deletebutton.attr("onclick","delete_teams(\""+ key +"\");");

    var modal = $('.delete-teams-modal');
    modal.attr("style","visibility: visible;");
    
}



function loadteamsDataTable(teams) {
        if(table !== undefined) {
            table.clear();
        }

        table = $('#teams_table').DataTable(
            {
                "dom": '<"top"i>rt<"bottom"flp><"clear">',
                destroy: true,
                responsive: true,
                rowReorder: false,
                sortable: false,
               
                paging: false,
                dom: '.rs-navigation',
                select: false,
                //buttons: [
                //{
                //    text: 'Active Stories',
                //    className: 'active_stories',
                //    action: function() {
                       // show_active_stories();
                //]
                columnDefs: [
                    {
                        targets: '_all',
                        orderable: false
                    },
                    {
                        targets: [0],
                        visible: true
                    },
                    {
                        targets: [1],
                        visible: true
                    }
                    

                   
                ],
                scrollX:true,
               
                scrollXInner:"100%",
                scrollCollapse:true,
                data: teams,
                columns: [
                    
                    {
                        data: "title",
                        className: 'dt-head-left teams-title'
                    },
                    {
                        data: "descriptions",
                        className: 'dt-head-left teams-descriptions'
                    },
                    {
                        data: "teams_edit",
                        className: 'dt-head-left teams-teams_edit'
                    }
                   
                    
                ]
            });
      
}

function load_deleted_teams(){
    var teams = [];
    var database = firebase.database();
    var ref = database.ref('teams/');
    ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
           
                //0331207 - get only active stories
                var tmp_user_teams = new user_teams(
                    child_data.title,
                    child_data.descriptions, 
                    child_data.key,
                    child_data.teams_edit
                    );
                    
                teams.push(tmp_user_teams);

                
        });
        
        loadteamsDataTable(teams);
       
    });

}

function load_teams_data(){
	var current_user = $('#user_key').val();
    var teams = [];
    var database = firebase.database();
        var ref = database.ref('teams/');
    ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();

                //0331207 - get only active stories
            if(current_user	== child_data.members.product_owner || current_user	== child_data.members.scrum_master || current_user	== child_data.members.team_member1 || current_user	== child_data.members.team_member2 || current_user	== child_data.members.team_member3 || current_user	== child_data.members.team_member4 || current_user	== child_data.members.team_member5 || current_user	== child_data.members.team_member6 || current_user	== child_data.members.team_member7 || current_user	== child_data.members.team_member8 || current_user	== child_data.members.team_member9){
            	//console.log("current user "+current_user);
            	//console.log("recorded "+child_data.members.product_owner);
                var tmp_user_teams = new user_teams(
                    child_data.title,
                    child_data.descriptions, 
                    child_data.key,
                    child_data.teams_edit
                    );
                    
               // teams.push(tmp_user_teams);
            }else{
                var tmp_user_teams = new user_teams(
                    child_data.title,
                    child_data.descriptions, 
                    child_data.key,
                    "<a class='edit_link'  onclick='edit_teams(\""+ key +"\");' href='#'>View</a>"
                    );
                    
                
            }
                teams.push(tmp_user_teams); 
        });
        console.log("for teams: "+teams);
        loadteamsDataTable(teams);
       
    });

}

function load_single_teams_data(key){
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
            title = $('#teams-caption');
            title.html("Edit Teams");
            var modal = $('.teams-modal');
            modal.attr("style","visibility: visible;");
            $('.manage-set').css('visibility','visible');


    });

}


function save_teams_to_firebase(title ,descriptions)
{
  var database = firebase.database();
  var tmp_key = database.ref('teams/').push().key;
  var current_user = $('#user_key').val();

   database.ref('/teams/' + tmp_key).set(
   {

      //"members/product_owner": current_user,
      backlogs: "-KjvDkhgixNr8Wg6gZqF",
      title: title,
      descriptions: descriptions,
      key:tmp_key, 
      teams_edit: "<a class='edit_link'  onclick='edit_teams(\""+ tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_teams_modal(\""+ tmp_key +"\");' href='#'>Delete</a>"
      
    });
   
   //added for saving the current product owner
    database.ref('/teams/' + tmp_key + '/members').set(
    {
     product_owner: current_user,
    });
    //end added

   return tmp_key;

   $('.manage-set').css('display','block');
}

function update_teams(title ,descriptions,key)
{
  var database = firebase.database();
  

   database.ref('/teams/' + key).update(
   {
      title: title,
      descriptions: descriptions
      
   });
   return key;
}

function delete_teams(key){
      
        delete_teams_group(key);
        load_teams_data();
        close_delete_teams_modal();
}



function delete_teams_group(key)
{
  var database = firebase.database();
 

   database.ref('/teams/' + key).remove();
   return key;


}



function update_teamdisplay(){
    //$('#SM-select').empty();
    //$('#members-select').empty();
   var j=0;
        users.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
        
            var child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var thiskey = $('#teams_edit_key').val();
                

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
   
        users.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
            var key = childSnapshot.key;
            var thiskey = $('#teams_edit_key').val();
                /*if(child_data.displayname != undefined && child_data.displayname != "" && $('#PO-select').val() != key ){
                    
                    $('#SM-select').append('<option value="'+ key+'">'+child_data.displayname+'</option>');

                    if(child_data.displayname != undefined && child_data.displayname != "" && $('#SM-select').val() != key ){
                    $('#members-select').append( '<table><tr><input type="checkbox" id="number'+i+'" class="members_checkbox" name="members_checkbox" value="'+key+'">'+child_data.displayname+' </tr></table>');
                    
                    }
                }*/


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



function hide_error(){
    $('.Teams_DTE_Field_Error.error-teams-title').css("display","none");
    $('.Teams_DTE_Field_Error.error-teams-description').css("display","none");

}


function create_team(){
    close_teams_modal();
    display_teams_modal();
}
