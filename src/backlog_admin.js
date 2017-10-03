var prod_owner_sel = "";

function load_single_backlog_data(key,userkey){
  $("#product-owner-select").prop("selectedIndex", -1);
  $(".product-owner").html("");
  var backlogs = [];
  var database = firebase.database();
  var ref = database.ref('backlogs/' + key);
  ref.once('value').then(function(snapshot) {
      var data = snapshot.val();
      data.title,
      data.descriptions,
      data.key,
      data.edit_link,
      data.status,
      data.productowner
      if(data.status != null && data.status != "inactive"){
          $('#in_active').prop("checked",true);
      }else{
          $('#in_active').prop("checked",false);
      }
      $('.status_link').empty();
      title = $('#backlogs-title');
      descriptions = $('#backlogs-description');
      title.val(data.title);
      descriptions.val(data.descriptions);
      $(".summary_link").append("<a class='status_link' href='" + encodeURI(window.location.origin + "/backlog_status.php?key=" + data.key) + "'>&lt;Show Link&gt;</a>")
      title = $('#backlogs-caption');
      title.html("Product Backlog Administration");
      var modal = $('.backlogs-modal');
      modal.attr("style","visibility: visible;");
       if(data.productowner != undefined)
        prod_owner_sel = data.productowner;
  });
  //var arrTeamKeys = teamkeys.split(",");
  //var arrUserKeys = [];
  var teamref = database.ref("teams/");
  teamref.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var child_data = childSnapshot.val(); 
      var key_team = childSnapshot.key;
      is_member = false;
      is_shmember = false;
      if(child_data.members.stakeholders !== undefined && child_data.members.stakeholders != ""){     
          var stakeholdersarray = child_data.members.stakeholders.split(',');     
          if(stakeholdersarray.indexOf(userkey) > -1){        
              is_shmember = true;     
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

      if(is_member||is_shmember) {
        if(child_data.backlogs.includes(key)){
          var htmlTeamBacklog = "<div class='backlogs-label'> " + child_data.title + " Organization Members: </div>";
          htmlTeamBacklog += "<ul id='"+key_team+"'>";
          htmlTeamBacklog += "</ul>";
          htmlTeamBacklog += "<div class='backlogs-label '> " + child_data.title + " External Members: <span class='dashboard-link'>&lt;Coming Soon&gt;</span> </div> <br>";
          $("div#team_access").append(htmlTeamBacklog);
          getUserDetails(child_data.members.product_owner, child_data.members.scrum_master, child_data.members.team_member1, child_data.members.team_member2, child_data.members.team_member3, child_data.members.team_member4, child_data.members.team_member5, child_data.members.team_member6, child_data.members.team_member7, child_data.members.team_member8, child_data.members.team_member9, key_team, child_data.title);
        }
      }
    });
  });
}


/*    for (var x = 0; x < arrTeamKeys.length; x++){
      var teamref = database.ref('teams/'+arrTeamKeys[x]);
      teamref.once('value').then(function(snapshot) {
        var data = snapshot.val();
        if(data.backlogs.includes(key)){
          if(data.members.product_owner!="" && data.members.product_owner != undefined)
            arrUserKeys.push(data.members.product_owner);
          if(data.members.scrum_master!="" && data.members.scrum_master != undefined)
            arrUserKeys.push(data.members.scrum_master);
          if(data.members.team_member1!="")
            arrUserKeys.push(data.members.team_member1);
          if(data.members.team_member2!="")
            arrUserKeys.push(data.members.team_member2);
          if(data.members.team_member3!="")
            arrUserKeys.push(data.members.team_member3);
          if(data.members.team_member4!="")
            arrUserKeys.push(data.members.team_member4);
          if(data.members.team_member5!="")
            arrUserKeys.push(data.members.team_member5);
          if(data.members.team_member6!="")
            arrUserKeys.push(data.members.team_member6);
          if(data.members.team_member7!="")
            arrUserKeys.push(data.members.team_member7);
          if(data.members.team_member8!="")
            arrUserKeys.push(data.members.team_member8);
          if(data.members.team_member9!="")
            arrUserKeys.push(data.members.team_member9);
          if(arrUserKeys.length != 0)
            getUserDetails(arrUserKeys , data.title, arrTeamKeys[x]);
          arrUserKeys = [];
          var htmlTeamBacklog = "<div class='backlogs-label'> " + data.title + " Organization Members: </div>";
            htmlTeamBacklog += "<ul id='"+arrTeamKeys[x]+"'>";
            htmlTeamBacklog += "</ul>";
            htmlTeamBacklog += "<div class='backlogs-label '> " + data.title + " External Members: <span class='dashboard-link'>&lt;Coming Soon&gt;</span> </div> <br>";
            $("#team_access").append(htmlTeamBacklog);
          getUserDetails(data.members.product_owner, data.members.scrum_master, data.members.team_member1, data.members.team_member2, data.members.team_member3, data.members.team_member4, data.members.team_member5, data.members.team_member6, data.members.team_member7, data.members.team_member8, data.members.team_member9, arrTeamKeys[x], data.title);
        }


      });
    }
}*/

function getUserDetails(product_owner, scrum_master, team_member1, team_member2, team_member3, team_member4, team_member5, team_member6, team_member7, team_member8, team_member9, teamkey, teamname) {
    var teamhtml = pohtml = smhtml = tmshtml = shhtml = prod_select = "";
    var user = database.ref('user/');
    user.once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var data = snapshot.val();
        var child_data = childSnapshot.val();
        var key = childSnapshot.key;
          if(key == product_owner) {
               pohtml = key;
              if(!prod_select.includes(key))
                prod_select += "<option value='"+key+"'> " + child_data.displayname + " </option>";
          } 
          if(key == scrum_master) {
              smhtml = "<li>" + child_data.displayname + "</li>";
               if(!prod_select.includes(key))
                prod_select += "<option value='"+key+"'> " + child_data.displayname + " </option>";
          }
          if(key == team_member1 || key == team_member2 || key == team_member3 || key == team_member4 || key == team_member5 || key == team_member6 || key == team_member7 || key == team_member8 || key == team_member9) {
              tmshtml += "<li>" + child_data.displayname + "</li>";
              if(!prod_select.includes(key))
                prod_select += "<option value='"+key+"'> " + child_data.displayname + " </option>";
          }
      });
      teamhtml = smhtml + tmshtml;

      $("#product-owner-select").html(prod_select);

      if($(".product-owner").html()!=""){
        if(!$(".product-owner").html().includes(pohtml)){
          $(".product-owner").append("<br>"+pohtml);
          if(prod_owner_sel == "")
            $("#product-owner-select").prop("selectedIndex", -1);
        }
      }
       else{
          if(prod_owner_sel != "")
            $("#product-owner-select").val(prod_owner_sel);
          else{
            $("#product-owner-select").val(pohtml);
            $(".product-owner").append(pohtml);
          }
      }
      $("#"+teamkey).append(teamhtml);
    });
}

function displayName(userName,teamname){
    var nameLi = "<li> "+ userName + "</li>";
  $("#"+teamname).append(nameLi);
}

function update_backlogs1(title,descriptions,key,in_active, prod_owner_key)
{
  var database = firebase.database();
  
    if(in_active == true){
       database.ref('/backlogs/' + key).update(
       {
          title: title,
          productowner: prod_owner_key,
          descriptions: descriptions,
          status: "active"
       });
    }else{
        database.ref('/backlogs/' + key).update(
       {
          title: title,
          productowner: prod_owner_key,
          descriptions: descriptions,
          status: "inactive"
       });
    }
    close_backlog_modal();
}
function close_backlog_modal(){
  var modal = $('.backlogs-modal');
  modal.attr("style","visibility: hidden;");
  $("#team_access").html("");
}

function close_delete_modal(){
    var modal = $('.delete-backlogs-modal');
    modal.attr("style","visibility: hidden;");
}
function delete_backlogs(key)
{
  var database = firebase.database();
  var tmp_key = database.ref('backlogs/').push().key;
   database.ref('/backlogs/' + key).update(
   {
      status: "archive",
      edit_link: "<a class='restore_link'  onclick='restore_backlogs(\""+ key +"\");' href='#'>Restore</a>"
   });
   location.replace("https://rocketscrum.com/user_dashboard.php");
}

