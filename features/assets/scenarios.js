
$( function() {


    //display Content of the body
    $.ajax({
        type: "POST",
        url: "features/scenarios/scenarios_content.php",
        data: {search: 'all'},
        success: function(result){
            $("#scenario-title").text("Reusable Epics");
            $("#scenarios-body").html(result);
            $('#create-scenarios-button').click(display_modal);
            $('#save-scenarios').click(save_scenarios);
            $('#scenarios-close').click(close_scenario_modal);
            $('#scenarios-ok').click(scenarios_ok);
            $('#succes-close').click(success_close);
            $('#scenarios-group').click(show_allgroup);

            load_scenario_data();
            getselectedbacklog();
            scenario_hide_errorfields();
            
        }
    });
    
});



function show_allgroup(){
    $('#scenarios-group').val("");
    console.log("is clicked again");
    var tablescenarios = $('#scenarios_stories_table').DataTable();
                    
    var database = firebase.database();
    var scenarioref = database.ref('scenarios/');

    scenarioref.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    var child_data = childSnapshot.val();
    console.log(child_data.group);
    if(!$('#scenarios-dropdown').find("option:contains('" + child_data.group  + "')").length && child_data.group != undefined){
        $("#scenarios-dropdown").append('<option>'+child_data.group+'</option>');
    }


        });
        
    });

}   


function save_scenarios() {



var group, as_a, i_want, so_that, acceptance_test, story_points, comments;
var database = firebase.database();
var scenariosref = database.ref('scenarios/');

group = $('#scenarios-group');
as_a = $('#scenarios-as-a');
i_want = $('#scenarios-i-want-to');
so_that = $('#scenarios-so-that');
acceptance_test = $('#scenarios-acceptance-test');
story_points = $('#scenarios-story-points');
comments = $('#scenarios-comments');


isedit = $('#scenarios_is_edit');
editkey = $('#scenarios_edit_key');

var hasblank = false;

if(group.val() == ""){
    $('.Scenario_DTE_Field_Error.scenario_group').css("display","block");
    hasblank = true;
}
else{
    $('.Scenario_DTE_Field_Error.scenario_group').css("display","none");
}

if(as_a.val() == ""){
    $('.Scenario_DTE_Field_Error.scenario_as_a').css("display","block");
    hasblank = true;

}else{
    $('.Scenario_DTE_Field_Error.scenario_as_a').css("display","none");
}

if(i_want.val() == ""){
    $('.Scenario_DTE_Field_Error.scenario_i_want').css("display","block");
    hasblank = true;

}else{
    $('.Scenario_DTE_Field_Error.scenario_i_want').css("display","none");

}

if(so_that.val() == ""){
    $('.Scenario_DTE_Field_Error.scenario_so_that').css("display","block");
    hasblank = true;

}else{
    $('.Scenario_DTE_Field_Error.scenario_so_that').css("display","none");

}

if(acceptance_test.val() == ""){
    $('.Scenario_DTE_Field_Error.scenario_acceptance_test').css("display","block");
    hasblank = true;

}else{
    $('.Scenario_DTE_Field_Error.scenario_acceptance_test').css("display","none");

}

if(story_points.val() == null){
    $('.Scenario_DTE_Field_Error.scenario_story_points').css("display","block");
    hasblank = true;

}else{
    $('.Scenario_DTE_Field_Error.scenario_story_points').css("display","none");
}




if(!hasblank){
    if(isedit.val() == ""){
    save_to_scenarios_firebase('SCENARIO','',group.val(), as_a.val(),i_want.val(), so_that.val(), acceptance_test.val(), story_points.val(),comments.val(),'');
    }else{
        
        update_scenarios_story(editkey.val(),'SCENARIO','',group.val(), as_a.val(),i_want.val(), so_that.val(), acceptance_test.val(), story_points.val(),comments.val(),'')
    }

    resetscenario_text();
    close_scenario_modal();
    load_scenario_data();
}


}

function edit_scenarios(key){
    isedit = $('#scenarios_is_edit');
    isedit.val("True");
    editkey = $('#scenarios_edit_key');
    editkey.val(key);
    
    load_single_scenarios_data(key);
    
}

function display_delete_scenarios_modal(key){
    var deletebutton = $('#delete-scenarios');
    deletebutton.attr("onclick","delete_scenarios(\""+ key +"\");");

    var modal = $('.delete-scenarios-modal');
    modal.attr("style","visibility: visible;");  
}

function close_delete_scenarios_modal(){
    var modal = $('.delete-scenarios-modal');
    modal.attr("style","visibility: hidden;");
    
}

function display_modal(){
    resetscenario_text();
    
    isedit = $('#scenarios_is_edit');
    isedit.val("");
    $("#scenarios-dropdown").val("");
    var modal = $('.scenarios-modal');
    modal.attr("style","visibility: visible;");
    scenario_hide_errorfields();
}

function close_scenario_modal(){
    var modal = $('.scenarios-modal');
    modal.attr("style","visibility: hidden;");

    resetscenario_text();

}

function resetscenario_text(){
    $('#scenarios-group').val("");
    $('#scenarios-as-a').val("");
    $('#scenarios-i-want-to').val("");
    $('#scenarios-so-that').val("");
    $('#scenarios-acceptance-test').val("");
    $('#scenarios-story-points').val("");
    $('#scenarios-comments').val("");
}

function success_close(){
    var modal = $('.success-modal');
    modal.attr("style","visibility: hidden;");
    scenario_hide_errorfields();
}


function scenarios_ok(){
    var modal = $('.success-modal');
    modal.attr("style","visibility: hidden;");
}

function save_to_scenarios_firebase(storyid_var ,sprint_number_var, group_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
{
  var database = firebase.database();
  var scenarios_tmp_key = database.ref('scenarios/').push().key;

   database.ref('/scenarios/' + scenarios_tmp_key).set(
   {
      order: order_var,
      key: scenarios_tmp_key,
      storyid: storyid_var,
      sprint_number: sprint_number_var,
      group: group_var,
      as_a: as_a_var,
      i_want: i_want_var,
      so_that: so_that_var,
      acceptance_test: acceptance_test_var,
      story_points: story_points_var,
      comments: comments_var,
      status: "",
      edit_del: "<a class='edit_link'  onclick='edit_scenarios(\""+ scenarios_tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_scenarios_modal(\""+ scenarios_tmp_key +"\");' href='#'>Delete</a>" 
   });

   return scenarios_tmp_key;

}

$("#add-to-backlog").click(function(){
   
});

function loadscenariosDataTable(scenarios) {
   
        if(table !== undefined) {
            table.clear();
        }

        tablescenarios = $('#scenarios_stories_table').DataTable(
            {
                "dom": '<"top"i>rt<"bottom"flp><"clear">',
                destroy: true,
                responsive: true,
                rowReorder: false,
                sortable: false,
                order: [
                    [0, 'asc']
                ],
                paging: false,
                dom: '.rs-navigation',
                select: {
                    style: 'multi'
                },
                //buttons: [
                //{
                //    text: 'Active Stories',
                //    className: 'active_stories',
                //    action: function() {
                       // show_active_stories();
                //    }
                //}
                //]
                columnDefs: [
                    {
                        targets: '_all',
                        orderable: false
                    },
                    {
                        targets: [0],
                        visible: false
                    },
                    {
                        targets: [1],
                        visible: true
                    },
                    {
                        targets: [9],
                        visible: false
                    },
                    {
                        searchable: false, targets: [10]
                    }                  
                ],
                 scrollX:true,
                //Adjusted to 100% from 130% -> Johann/Japs 3/23/17
                scrollXInner:"100%",
                scrollCollapse:true,
                /*
                scrollY:function(){
                    var browserht = $(window).height();
                    tableht = browserht - 240;
                    return tableht;
                },*/
                data: scenarios,
                columns: [
                    {
                        data: "order"
                    },
                    {
                        data: "key",
                        className: 'dt-key'
                    },
                    {
                        data: "storyid",
                        className: 'dt-head-left scenarios-story-id'
                    },
                    {
                        data: "sprint_number",
                        className: 'dt-head-left scenarios-story-sprint_number'
                    },
                    {
                        data: "as_a",
                        className: 'dt-head-left scenarios-story-as-a'
                    },
                    {
                        data: "i_want",
                        className: 'dt-head-left scenarios-story-i-want'
                    },
                    {
                        data: "so_that",
                        className: 'dt-head-left scenarios-story-so-that'
                    },
                    {
                        data: "acceptance_test",
                        className: 'dt-head-left scenarios-story-acceptance-test'
                    },
                    {
                        data: "story_points",
                        className: 'dt-head-left scenarios-story-story-points'
                    },
                    {
                        data: "comments",
                        className: 'dt-head-left scenarios-story-comments'
                    },
                    {
                        data: "status",
                        className: 'dt-head-left scenarios-story-status'
                    },
                    {
                        data: "edit_del",
                        className: 'dt-head-left scenarios_edit_del'
                    },
                    
                     
                ],


                createdRow: function( row, data, dataIndex ) {

                    $(row).attr('group', data.group);

                    

                }



            });

                $(document).ready(function() {
                    var tablescenarios = $('#scenarios_stories_table').DataTable();
                    
                    var database = firebase.database();
                    var scenarioref = database.ref('scenarios/');

                    scenarioref.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                    var child_data = childSnapshot.val();
                    

                     /* $('#scenarios_stories_table').on( 'click', 'tr', function () {
                            $(this).toggleClass('selected');
                        } );*/

                    var isExist = !!$('#scenarios-dropdown option').filter(function() {
                        return $('#filtergroup').attr('value');
                    }).length;

                        if(!$('#filtergroup').find("option:contains('" + child_data.group  + "')").length && child_data.group != undefined){
                            $("#filtergroup").append('<option>'+child_data.group+'</option>');
                        }

                        if(!$('#scenarios-dropdown').find("option:contains('" + child_data.group  + "')").length && child_data.group != undefined){
                            $("#scenarios-dropdown").append('<option>'+child_data.group+'</option>');
                        }


                        

                        });
                        
                    });


                        $("#scenarios-dropdown").change(function () {
                          var selectedText =  $("#scenarios-dropdown option:selected").text();
                               $('#scenarios-group').val(selectedText);
                        });
                 


                    $("#filtergroup").change(function (row, data, dataIndex) {

                        var database = firebase.database();
                        var scenarioref = database.ref('scenarios/');
                        var selectedText = $("#filtergroup option:selected").text();

                        $('#scenarios_stories_table > tbody > tr').each(function(data) {
                            var $this = $(this);
                            var row_group = $this.attr('group');
                           
                            if(selectedText == row_group) {
                                $this.addClass("selected");
                            }else {
                                $this.removeClass("selected");
                            }
                        });

                            
                    });
                 

                    var database = firebase.database();
                    var maxref = database.ref($('#selected_backlog').val() + '/max');

                    maxref.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                    var child_data = childSnapshot.val();
                    storyid = parseInt(child_data); 
                    $("#max_story_id").val(storyid);
                    });
                           

                    },
                    function(error) {
                    console.log("Error: " + error.code);
                    });

                    
                    $('.addtobacklog').click( function () {
                        var scenariosData = tablescenarios.rows('.selected').data();
                        
                       

                    for (var i=0; i < scenariosData.length ;i++){
                        

                        var as_a, i_want, so_that, acceptance_test, story_points, comments;
                        var database = firebase.database();
                        var scenariosref = database.ref($('#selected_backlog').val() + '/user_stories/');


                        
                        var storyidcount = i + 1;
                        
                        
                        var order_id = parseInt($("#max_story_id").val()) + parseInt(storyidcount);

                        
                        as_a = scenariosData[i]["as_a"];
                        i_want = scenariosData[i]["i_want"];
                        so_that = scenariosData[i]["so_that"];
                        acceptance_test = scenariosData[i]["acceptance_test"];
                        story_points = scenariosData[i]["story_points"];
                        comments = scenariosData[i]["comments"];

                        save_to_scenarios_stories_firebase(order_id,'',scenariosData[i]["as_a"],scenariosData[i]["i_want"], scenariosData[i]["so_that"], scenariosData[i]["acceptance_test"], scenariosData[i]["story_points"],scenariosData[i]["comments"],order_id);
                        
                        
                        function save_to_scenarios_stories_firebase(storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
                            {
                              var database = firebase.database();
                              var scenarios_tmp_key = database.ref($('#selected_backlog').val() + '/user_stories/').push().key;
                        
                               database.ref($('#selected_backlog').val() +'/user_stories/' + scenarios_tmp_key).set(
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
                        
                               return scenarios_tmp_key;
                            }

                        //$('#max_story_id').val(parseInt(maxstory) + 1);
                        database.ref($('#selected_backlog').val() + '/max').update(
                        {
                              storyid: (parseInt(order_id))
                        });


                        $('h4').text("Successfully Added!");

                        window.location.href = 'scrumnow.php';

                    }
                    } );
                } );
                
}

    function load_scenario_data(){
        var scenarios = [];
        var database = firebase.database();
        //var table = $('#scenarios_stories_table').DataTable(); 
        var ref = database.ref('scenarios/');
        ref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var child_data = childSnapshot.val();
               
                    //0331207 - get only active stories
                    var tmp_scenarios_story = new scenario_story(
                        child_data.order,
                        key,
                        child_data.storyid,
                        child_data.sprint_number,
                        child_data.as_a,
                        child_data.i_want,
                        child_data.so_that,
                        child_data.acceptance_test,
                        child_data.story_points,
                        child_data.comments,
                        child_data.status,
                        child_data.edit_del,
                        child_data.group);
                    scenarios.push(tmp_scenarios_story);
                
            });
            
            loadscenariosDataTable(scenarios);
        });

    }

    function load_single_scenarios_data(key){
        var scenarios = [];
        var database = firebase.database();
        var ref = database.ref('scenarios/' + key);
        ref.once('value').then(function(snapshot) {
                        var data = snapshot.val();
                        data.order,
                        key,
                        data.storyid,
                        data.sprint_number,
                        data.group,
                        data.as_a,
                        data.i_want,
                        data.so_that,
                        data.acceptance_test,
                        data.story_points,
                        data.comments,
                        data.status,
                        data.edit_del;
               

                group = $('#scenarios-group');
                as_a = $('#scenarios-as-a');
                i_want = $('#scenarios-i-want-to');
                so_that = $('#scenarios-so-that');
                acceptance_test = $('#scenarios-acceptance-test');
                story_points = $('#scenarios-story-points');
                comments = $('#scenarios-comments');

                group.val(data.group);
                as_a.val(data.as_a);
                i_want.val(data.i_want);
                so_that.val(data.so_that);
                acceptance_test.val(data.acceptance_test);
                story_points.val(data.story_points);
                comments.val(data.comments);

                title = $('#Scenarios-title');
                title.html("Edit Scenario Story");
                var modal = $('.scenarios-modal');
                modal.attr("style","visibility: visible;");


        });

    }
    /*
    function getselectedbacklog(){
        var database = firebase.database();
        var ref = database.ref('selected_backlogs/');
          ref.once('value').then(function(snapshot) {
                   //var key = childSnapshot.key;
                   var child_data = snapshot.val();
                       //0331207 - get only active stories
                        ref = database.ref(child_data.key + '/user_stories/');
                        maxref = database.ref(child_data.key+ '/max');
                      backlog_title = child_data.title;
                      backlog_key =  child_data.key;
                      $('#selected_backlog').val(child_data.key)
               showbacklogs();
               getmax();
          });
    }*/
    function getselectedbacklog(){

    var database = firebase.database();
    var teamref = database.ref('teams/');
    var backlog_ref = database.ref('backlogs/');
    var is_member = false;
    var dropdown="";
        teamref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var child_data = childSnapshot.val(); 
                is_member = false;
                switch($('#user_key').val()){
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
                if(is_member){
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
                backlogs_info.forEach(function(child_data){
                   
                        dropdown += '<option value="'+ child_data.key+'">'+child_data.title+'</option>';
                    
                });

                var database = firebase.database();
                var ref = database.ref('user/' + $('#user_key').val() +'/selected_backlogs');
                    ref.once('value').then(function(snapshot) {
                           //var key = childSnapshot.key;
                        var child_data = snapshot.val();
                               //0331207 - get only active stories
                        ref = database.ref(child_data.key + '/user_stories/');
                        maxref = database.ref(child_data.key+ '/max');
                        backlog_title = child_data.title;
                        backlog_key =  child_data.key;
                        var isavailable = false;
                        backlogs_info.forEach(function(user_backlog){
                            if(child_data.key == user_backlog.key){
                                $('#selected_backlog').val(child_data.key)
                                isavailable = true;
                            }
                        });

                        if(!isavailable){
                             $('#selected_backlog').val(backlogs_info[0].key)
                        }
                       
                   showbacklogs();
                   getmax();
                });
                
                

            });

        });





        
    }

   
    function showbacklogs(){
      var database = firebase.database();
      var userref = database.ref('user');
      var dropdown = '<span> Selected Backlog:<select id=\"scenario_select_backlog\" >';
      var ref = database.ref('backlogs/');


                        dropdown    += '</select></span>';
                        $(dropdown).insertAfter('#scenario-title');
              
                get_currentuser_backlogs($("#user_key").val(),"#scenario_select_backlog");
                
            setscenariolistener();
        }


        
      
    


function setscenariolistener(){
    
        //DataTable functions removed 
         $(document).on('change', '#scenario_select_backlog',function () {
        // $('#scenario_show_backlog').on('change', function () {
        var database = firebase.database();
         database.ref('user/' + $('#user_key').val() +'/selected_backlogs').set(
        {
          title: this.options[this.selectedIndex].text,
          key: this.options[this.selectedIndex].value
          });           
    
        $('#selected_backlog').val(this.options[this.selectedIndex].value);
            getmax();
        });

}

function getmax(){

var database = firebase.database();
    var maxref = database.ref($('#selected_backlog').val()+ '/max');
                      
    maxref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var child_data = childSnapshot.val();
                storyid = parseInt(child_data); 
                $("#max_story_id").val(storyid);//
            
            });
        },
        function(error) {
            console.log("Error: " + error.code);
        });
}

function delete_scenarios(key){
        $('#scenarios-dropdown').empty();
        $('#scenarios-group').empty();
        $('#filtergroup').empty();
        delete_scenarios_story(key);
        load_scenario_data();
        close_delete_scenarios_modal();
}

function update_scenarios_story(key,storyid_var ,sprint_number_var, group_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
{
  var database = firebase.database();
  

   database.ref('/scenarios/' + key).set(
   {
      order: order_var,
      key: key,
      storyid: storyid_var,
      sprint_number: sprint_number_var,
      group: group_var,
      as_a: as_a_var,
      i_want: i_want_var,
      so_that: so_that_var,
      acceptance_test: acceptance_test_var,
      story_points: story_points_var,
      comments: comments_var,
      status: "",
      edit_del: "<a class='edit_scenarios_link'  onclick='edit_scenarios(\""+ key +"\");' href='#'>Edit</a>/<a class='remove_scenarios_link' onclick='display_delete_scenarios_modal(\""+ key +"\");' href='#'>Delete</a>"
   });
   return key;
}

function delete_scenarios_story(key)
{
  var database = firebase.database();
  

   database.ref('/scenarios/' + key).remove();
   return key;
}


function scenario_hide_errorfields(){
    
    
    $('.Scenario_DTE_Field_Error.scenario_group').css("display","none");
    $('.Scenario_DTE_Field_Error.scenario_as_a').css("display","none");
    $('.Scenario_DTE_Field_Error.scenario_i_want').css("display","none");
    $('.Scenario_DTE_Field_Error.scenario_so_that').css("display","none");
    $('.Scenario_DTE_Field_Error.scenario_acceptance_test').css("display","none");
    $('.Scenario_DTE_Field_Error.scenario_story_points').css("display","none");
}


