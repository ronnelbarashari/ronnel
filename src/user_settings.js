////////////////////////////////////////////////////////////////////////////////
// Functions
// show_user_settings_modal() -
// save_user_settings() -
////////////////////////////////////////////////////////////////////////////////
function save_user_to_firebase(user, email, uid)
{
  var database = firebase.database();
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

// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i]);
     }
  }
  // Return the array if it is non-empty, or null
  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

function save_user_settings() {
  var database = firebase.database();
  var checkedBoxes = getCheckedBoxes("user_role");
  var roles = "";
  var key = $("#user_key").val();

  if (checkedBoxes != null && key != "") {
    for(i=0;i<checkedBoxes.length;i++){
      console.log(checkedBoxes[i].value);
      roles += checkedBoxes[i].value + ";";
    }
    database.ref('/user/' + key).update(
    {
        userrole: roles
    });
  }

  //$("#userSettings").css("display", "none");
  $("#user_role").val(roles);
  $(".settings_button").after("<div><h3>Saved!</h3></div>");

}

$( document ).ready(function() {
  var database = firebase.database();
  database.ref('user').once('value').then(function(snapshot) {
    var cnt = 0;
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var child_data = childSnapshot.val();
          
      //added check if user is logged in
      if(firebase.auth().currentUser != null) {
        if(child_data.email == firebase.auth().currentUser.email) {
          cnt += 1;
          $("#user_key").val(key).trigger('change');
          $("#user_role").val(child_data.userrole);

          var userpermission = child_data.userpermission;
          console.log("User Permission: " + child_data.userpermission);
          if($("#user_permission").val() == "" || $("#user_permission").val() === undefined) {
            if(userpermission !== undefined) {
              $("#user_permission").val(userpermission);
              if(userpermission == "admin") {
                $("#admin_settings").css("display", "block !important;");
                $("#user_features").css("display", "none !important;");
              }
            } 
            else {
              $("#user_permission").val("user");
            }
          }
        } 
      }
    });

    if(cnt == 0) {
      //added check if user is logged in
      if(firebase.auth().currentUser != null) {
        //save_user_to_firebase(user_name,firebase.auth().currentUser.email,firebase.auth().currentUser.uid);
        save_user_to_firebase(firebase.auth().currentUser.displayName,firebase.auth().currentUser.email,firebase.auth().currentUser.uid);
      } else {
        //hide menu for non-logged in users
        $(".rs-welcome-logout").css("display", "none");
      }
    }
  });

  var checkboxes = document.getElementsByName("user_role");

  var database = firebase.database();

  var subinputs = $("input[class='sm'],input[class='tm']");
  var poinputs = $("input[class='po']");

  if(subinputs.prop("checked", true)) {
      $("#po_box").css("opacity","0.5");
  }
  
  $("input[name='user_role']").change(function() {
    if(this.value == "Product Owner" && this.checked){
      subinputs.prop("disabled",true);
      subinputs.prop("checked", false)
    }
    else if(this.value == "Product Owner" && !this.checked){
      subinputs.prop("disabled",false);
    } 
    else if (this.checked) {
      $("input[class='po']").prop("disabled",true);
      $("input[class='po']").prop("checked", false);
    } else if (!this.checked){
      $("input[class='po']").prop("disabled",false);
    }

    //end function disable other checkboxes
    database.ref('user').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var child_data = childSnapshot.val();
        var roles = ""; 
        //console.log(key);

        //added check if user is logged in
        if(firebase.auth().currentUser != null) {
          if(child_data.email == firebase.auth().currentUser.email) {
            if(child_data.userrole != ""){
              roles = child_data.userrole.split(";");
            }
            for(var i=0; i<roles.length; i++){ 
              //console.log('roles: '+roles[i]);
              $(":checkbox[name='user_role']").each(function(){
                //console.log('checkbox value: '+this.value);
                if(roles[i] == this.value && !this.checked){
                  this.checked = "checked";
               
                  if(this.value == "Product Owner" && this.checked){
                    subinputs.prop("checked", false)
                  }

                  if (this.value == "Scrum Master" && this.checked || this.value == "Team Member" && this.checked) {
                    poinputs.prop("checked",false);
                  }

                  else if(this.value == "Product Owner" && !this.checked){
                    subinputs.prop("disabled",false);
                    $("#sm_box").css("opacity","1.0");
                    $("#tm_box").css("opacity","1.0");
                  } else if (this.value != "Product Owner" && this.checked) {
                    poinputs.prop("disabled",true);
                    $("#po_box").css("opacity","0.5");
                  }
                }
              });
            }
          } 
        }
      });
    });

    if(poinputs.prop("checked", true)) {
        $("#sm_box").css("opacity","0.5");
        $("#tm_box").css("opacity","0.5");
    }

    $("input[name='user_role']").change(function() {
      if(this.value == "Product Owner" && this.checked){
        $("input[class='po']").prop("checked", true);
        subinputs.prop("checked", false);
        console.log("checked product owner! disbale team member and scrum master!;")
      }

      if (this.value == "Scrum Master" && this.checked) {
        $("input[class='sm']").prop("checked", true);
        poinputs.prop("checked",false);
        console.log("checked scrum master! disbale product owner!;")
      }

      if (this.value == "Team Member" && this.checked) {
        $("input[class='tm']").prop("checked", true);
        poinputs.prop("checked",false);
        console.log("checked team member! disbale product owner!;")
      }
    });

    //modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function()
    {
      modal.style.display = "none";

      database.ref('user').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var child_data = childSnapshot.val();
          var roles = child_data.userrole.split(";");

          if(child_data.email == firebase.auth().currentUser.email) {
            for(var i=0; i<roles.length; i++){ 
              $(":checkbox[name='user_role']").each(function(){
                console.log(this.value);
                if(roles[i] == this.value && !this.checked){
                  this.checked = "checked";
                  this.disabled = false;
                  var subinputs = $("input[class='sm'],input[class='tm']");
             
                  if(this.value == "Product Owner" && this.checked){
                      subinputs.prop("disabled",true);
                      subinputs.prop("checked", false)
                  }
                  else if(this.value == "Product Owner" && !this.checked){
                      subinputs.prop("disabled",false);
                  } 
                  else if (this.checked) {
                      $("input[class='po']").prop("disabled",true);
                      $("input[class='po']").prop("checked", false);
                  } else if (!this.checked){
                      $("input[class='po']").prop("disabled",false);
                  }
                }
              });
            }
          } 
        });
      });
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event)
    {
      if (event.target == modal)
      {
        modal.style.display = "none";
        table = $('#stories_table').DataTable();
        data = table.rows().data();

       database.ref('user').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var child_data = childSnapshot.val();
          var roles = child_data.userrole.split(";");

          if(child_data.email == firebase.auth().currentUser.email) {
            for(var i=0; i<roles.length; i++){ 
              $(":checkbox[name='user_role']").each(function(){
                console.log(this.value);
                if(roles[i] == this.value && !this.checked){
                  this.checked = "checked";
                  this.disabled = false;
                  var subinputs = $("input[class='sm'],input[class='tm']");
             
                  if(this.value == "Product Owner" && this.checked){
                      subinputs.prop("disabled",true);
                      subinputs.prop("checked", false)
                  }
                  else if(this.value == "Product Owner" && !this.checked){
                      subinputs.prop("disabled",false);
                  } 
                  else if (this.checked) {
                      $("input[class='po']").prop("disabled",true);
                      $("input[class='po']").prop("checked", false);
                  } else if (!this.checked){
                      $("input[class='po']").prop("disabled",false);
                  }
                }
              });
            }
          } 
        });
      });
    }
  }
});
});