// GLOBAL VARIABLES

///////////////////////////////////////////////////////////////////////////////
// DATA REFERENCE
// User Stories
// - user story 1
//     - Sprint Number
//     - As a
//     - I want
//     - So that
// - user story 2
// - user story n
//
// Sprint Info
// - Sprint 1
//     - Sprint Start Date
//     - Sprint End Date
//     - Sprint Points
// - Sprint 2
///////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// A User Story object. A User Story contains the following elements:
// * Sprint Number -
// * As a... -
// * I want... -
// * So that... -
// * Acceptance Test -
// * Story Points -
// * Comments -
////////////////////////////////////////////////////////////////////////////////
function user_story(order_in, key_in, storyid_in, sprint_num_in, as_a_in, i_want_in, so_that_in,
   accept_in, story_points_in, comments_in, status_in, edit_del_in)
{
   this.order = order_in;
   this.key = key_in;
   this.storyid = storyid_in;
   this.sprint_number = sprint_num_in;
   this.as_a = as_a_in;
   this.i_want = i_want_in;
   this.so_that = so_that_in;
   this.acceptance_test = accept_in;
   this.story_points = story_points_in;
   this.comments = comments_in;
   this.status = status_in;
   this.edit_del= edit_del_in;
}

function recurring_story(order_in, key_in, storyid_in, sprint_num_in, as_a_in, i_want_in, so_that_in,
   accept_in, story_points_in, comments_in, status_in, edit_del_in, date_schedule_in, schedule_post_in, scheduled_in, set_recurring_in, number_added)
{
   this.order = order_in;
   this.key = key_in;
   this.storyid = storyid_in;
   this.sprint_number = sprint_num_in;
   this.as_a = as_a_in;
   this.i_want = i_want_in;
   this.so_that = so_that_in;
   this.acceptance_test = accept_in;
   this.story_points = story_points_in;
   this.comments = comments_in;
   this.status = status_in;
   this.edit_del= edit_del_in;
   this.date_schedule = date_schedule_in;
   this.schedule_post = schedule_post_in;
   this.scheduled = scheduled_in;
   this.set_recurring = set_recurring_in;
   this.number_added = number_added;
   this.skipped  = false;
}

function scenario_story(order_in, key_in, storyid_in, sprint_num_in, as_a_in, i_want_in, so_that_in,
   accept_in, story_points_in, comments_in, status_in, edit_del_in, group_in)
{
   this.order = order_in;
   this.key = key_in;
   this.storyid = storyid_in;
   this.sprint_number = sprint_num_in;
   this.as_a = as_a_in;
   this.i_want = i_want_in;
   this.so_that = so_that_in;
   this.acceptance_test = accept_in;
   this.story_points = story_points_in;
   this.comments = comments_in;
   this.status = status_in;
   this.edit_del= edit_del_in;
   this.group = group_in;
}

function bestpractice_story(order_in, key_in, storyid_in, sprint_num_in, as_a_in, i_want_in, so_that_in,
   accept_in, story_points_in, comments_in, status_in, group_in, edit_del_in)
{
   this.order = order_in;
   this.key = key_in;
   this.storyid = storyid_in;
   this.sprint_number = sprint_num_in;
   this.as_a = as_a_in;
   this.i_want = i_want_in;
   this.so_that = so_that_in;
   this.acceptance_test = accept_in;
   this.story_points = story_points_in;
   this.comments = comments_in;
   this.status = status_in;
   this.group= group_in;
   this.edit_del= edit_del_in;
}



function points_def(points, description, action)
{
   this.points = points;
   this.description = description;
   this.action = action;
}


function user_backlogs(title, descriptions,key,edit_link,status_link)
{
   this.title = title;
   this.descriptions = descriptions;
   this.key = key
   this.edit_link = edit_link;
   this.status_link = status_link;
}


function user_teams(title, descriptions,key,teams_edit)
{
   this.title = title;
   this.descriptions = descriptions;
   this.key = key
   this.teams_edit = teams_edit;
}


function googleSignin()
{
   firebase.auth()

   .signInWithPopup(provider).then(function(result)
   {
      var token = result.credential.accessToken;
      var user = result.user;

      console.log("token: " + token);
      console.log("user: " + user);
   }).catch(function(error)
   {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(error.code)
      console.log(error.message)
   });
}

function googleSignout()
{
   //check provider for correct sign out routine
   var user = firebase.auth().currentUser;
   if (user != null) {
      var provider = "";
      user.providerData.forEach(function (profile) {
         provider = profile.providerId;
      });
   }

   if(provider == "google.com") {
      firebase.auth().signOut()
      .then(function()
      {
         console.log('Signout Succesfull');
         window.location = "https://accounts.google.com/logout";
      }, function(error)
      {
         console.log('Signout Failed')
      });
   } else {
      //office 365
      firebase.auth().signOut()
      .then(function()
      {
         console.log('Signout Succesfull');
         o365signOut();
      }, function(error)
      {
         console.log('Signout Failed')
      });
   }

   /*firebase.auth().signOut()
   .then(function()
   {
      console.log('Signout Succesfull');
      window.location = "https://accounts.google.com/logout";
   }, function(error)
   {
      console.log('Signout Failed')
   });*/

}

function remove_from_firebase(key, status, order, storyid)
{
   //03312017 - update status and edit link instead of deleting
   var removeRef = database.ref($('#selected_backlog').val() +'/user_stories/' + key);
   var ref = database.ref($('#selected_backlog').val() +'user_stories/');


   /*removeRef.remove()
      .then(function()
      {
         console.log("Remove succeeded.")
      })
      .catch(function(error)
      {
         console.log("Remove failed: " + error.message)
      });*/
   
   var newstatus = "";
   var neweditlink = "";
   var neworder = "";
   var max = 0;
   var state="deleted";

   if(status != "trashed") {
      newstatus = "trashed";
      neweditlink = "<a class='restore_link' href='#'>Restore</a>";
      removeRef.update({
         status: newstatus,
         edit_del:neweditlink
      });   
   } else {
      state="restored";
      //reset status
      newstatus = "";
      neweditlink = "<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>";
      /*ref.once('value').then(function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
            if(child_data.order > max) {
               max = child_data.order;
            }
         });
         if(max > 0) {
            snapshot.forEach(function(childSnapshot) {
               var key = childSnapshot.key;
               var child_data = childSnapshot.val();
               console.log("child_data.order: " + child_data.order);
               if(child_data.order == "" ) {
                  console.log("inside if");
                  neworder = parseInt(max) + 1;
                  return true;
               } else if (child_data.order == order){
                  console.log("else");
                  neworder = parseInt(child_data.order); 
                  return true;
               }
            });
         }
         console.log("reset max: " + max);
         console.log("new order: " + neworder);
         if(neworder != ""){
            removeRef.update({
               status: newstatus,
               edit_del:neweditlink,
               order: neworder
            }); 
         }
      });*/
      
      neworder = parseInt($("#max_story_id").val()) + 1;
      if(neworder != ""){
         removeRef.update({
            status: newstatus,
            edit_del:neweditlink,
            order: neworder
         }); 
         save_max_count(neworder);
         $("#max_story_id").val(neworder);
      }
      /*ref.once('value').then(function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
            console.log("foreach2");
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
            if(child_data.order == order || child_data.order == "") {
               neworder = parseInt(max) + 1;
            } else {
               neworder = parseInt(child_data.order); 
            }
         });
      });*/
   }
   //scrumviolation     
   var createdSh="Member with Scrum Role Stakeholder " + state + " the story " + storyid + ".";      
   createdSh=($("#user_role").val()=="Stakeholder") ? createdSh : "";     
   save_scrum_violation(createdSh, '','', storyid, "");
   return 1;
}

function save_to_firebase(storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
{

   var tmp_key = database.ref($('#selected_backlog').val() +  '/user_stories/').push().key;
   var rowCount = $('#stories_table tr').length;
   //var rowCount = $('#stories_table tbody tr').length;
   console.log(rowCount);

   database.ref($('#selected_backlog').val() + '/user_stories/' + tmp_key).set(
   {
      order: order_var,
      key: tmp_key,
      storyid: storyid_var,
      sprint_number: sprint_number_var,
      as_a: as_a_var,
      i_want: i_want_var,
      so_that: so_that_var,
      acceptance_test: acceptance_test_var,
      story_points: story_points_var,
      comments: comments_var,
      status: "to do",
      edit_del:"<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>",
      backlog_name: ""
   });

   return tmp_key;
};

function save_max_count(maxidcount_var)
{
  // var tmp_key = database.ref('/max/').push().key;

   database.ref($('#selected_backlog').val() +'/max').update(
   {
      storyid: maxidcount_var
   });
};

function save_user_to_firebase(user, email, uid)
{
   var tmp_key = database.ref('/user/').push().key;

   database.ref('/user/' + tmp_key).set(
   {
      displayname: user,
      email: email,
      uid: uid,
      userrole: "",
      userpermission: ""
   });

   $("#user_key").val(tmp_key);
}

//added for new dashboard
$(document).ready(function() {
    var backlog = getUrlParameter('backlog');
    console.log("backlog: " + backlog);
    setTimeout(function() {
        if(backlog != "" && backlog !== undefined) {
            display_definitionofdone();
        }
    }, 3000);
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
function save_scrum_violation(remarks,row_data,row_key,storyid,mode){      
 //04182017 - log changes      
 var changed_cnt = 0;      
 var changed_arr = [];     
 if(mode=="Edit"){      
   database.ref(backlog_key + '/user_stories/' + row_key).once('value').then(function(snapshot) {     
       var delimiter  = "";      
       var member = "";    
       /*if($("#user_role").val().indexOf("Product Owner") < 0) {    
           if($("#user_role").val() == "") {    
               member = "Team Member";    
           } else {     
               member = $("#user_role").val();     
           }      
           remarks = "Member with Scrum Role " + member + " made the changes.";     
       }*/     
       if(parseInt(row_data.sprint_number) && row_data.status == "in progress") {      
           if(remarks != "") {      
               delimiter = " ; ";      
           }      
           remarks += delimiter + "Edit to a committed User Story for Sprint " + row_data.sprint_number;    
       }    
       if(remarks!=""){    
           //store changed values in an array      
           //As a    
           if(snapshot.val().as_a != row_data.as_a) {    
               changed_arr.push({      
                   changed_column: "as_a",      
                   old_value: snapshot.val().as_a,    
                   new_value: row_data.as_a,    
                   modified_by: firebase.auth().currentUser.email,      
                   story: row_data.storyid,     
                   remarks: remarks    
               })    
           }      
           //I Want     
           if(snapshot.val().i_want != row_data.i_want) {      
               changed_arr.push({      
                   changed_column: "i_want",    
                   old_value: snapshot.val().i_want,     
                   new_value: row_data.i_want,     
                   modified_by: firebase.auth().currentUser.email,      
                   story: row_data.storyid,     
                   remarks: remarks    
               })    
           }      
           //So that    
           if(snapshot.val().so_that != row_data.so_that) {    
               changed_arr.push({      
                   changed_column: "so_that",      
                   old_value: snapshot.val().so_that,    
                   new_value: row_data.so_that,    
                   modified_by: firebase.auth().currentUser.email,      
                   story: row_data.storyid,     
                   remarks: remarks    
               })    
           }      
           //Acceptance Test     
           if(snapshot.val().acceptance_test != row_data.acceptance_test) {      
               changed_arr.push({      
                   changed_column: "acceptance_test",    
                   old_value: snapshot.val().acceptance_test,     
                   new_value: row_data.acceptance_test,     
                   modified_by: firebase.auth().currentUser.email,      
                   story: row_data.storyid,     
                   remarks: remarks    
               })    
           }      
           //Story Points     
           if(snapshot.val().story_points != row_data.story_points) {      
               changed_arr.push({      
                   changed_column: "story_points",    
                   old_value: snapshot.val().story_points,     
                   new_value: row_data.story_points,     
                   modified_by: firebase.auth().currentUser.email,      
                   story: row_data.storyid,     
                   remarks: remarks    
               })    
           }      
           //Comments      
           if(snapshot.val().comments != row_data.comments) {     
               changed_arr.push({      
                   changed_column: "comments",     
                   old_value: snapshot.val().comments,      
                   new_value: row_data.comments,      
                   modified_by: firebase.auth().currentUser.email,      
                   story: row_data.storyid,     
                   remarks: remarks    
               })    
           }      
           //Status     
           if(snapshot.val().status != row_data.status) {      
               changed_arr.push({      
                   changed_column: "status",    
                   old_value: snapshot.val().status,     
                   new_value: row_data.status,     
                   modified_by: firebase.auth().currentUser.email,      
                   story: row_data.storyid,     
                   remarks: remarks    
               })    
           }      
           if(changed_arr.length > 0) {      
               for (var i = 0; i < changed_arr.length; i++) {     
                   logActivity(row_data.storyid, row_data.sprint_number, "scrum_violation", changed_arr[i]["changed_column"], changed_arr[i]["old_value"], changed_arr[i]["new_value"], firebase.auth().currentUser.email, remarks);      
               }     
               $.ajax({    
                   type: "POST",    
                   url: "log.php",     
                   data: {data : changed_arr, backlog_path: $("#selected_backlog").val()},      
                   success: function(result){      
                       //console.log("logged: " + result);     
                   }    
               });      
           }      
       }    
   });      
  }      
  else if(mode=="Order"){     
    if (remarks != '') {      
      changed_arr.push({      
          changed_column: "Order",     
          old_value: row_data,      
          new_value: row_key,    
          modified_by: firebase.auth().currentUser.email,      
          story: storyid,     
          remarks: remarks    
      });      
      $.ajax({    
          type: "POST",    
          url: "log.php",     
          data: {data : changed_arr, backlog_path: $("#selected_backlog").val()},      
          success: function(result){      
                  
          }    
      });      
    }    
  }      
  else{     
    if (remarks != '') {      
      changed_arr.push({      
          changed_column: "Story ID",     
          old_value: 0,    
          new_value: storyid,    
          modified_by: firebase.auth().currentUser.email,      
          story: storyid,     
          remarks: remarks    
      });      
      $.ajax({    
          type: "POST",    
          url: "log.php",     
          data: {data : changed_arr, backlog_path: $("#selected_backlog").val() },     
          success: function(result){      
                  
          }    
      });      
    }    
  }      
}     
//04182017 log changes     
function logActivity(story_id, sprint_number, log_type, changed_column, old_value, new_value, modified_by, remarks) {      
    var tmp_key = database.ref('/scrum_log/').push().key;      
    database.ref(backlog_key + '/scrum_log/' + tmp_key).set(      
   {     
        key: tmp_key,      
        storyid: story_id,    
        sprint_number: sprint_number,     
        log_type: log_type,      
        changed_column: changed_column,      
        old_value: old_value,    
        new_value: new_value,    
        modified_by: modified_by,      
        modified_date: Date.now(),     
        remarks: remarks      
   });      
}