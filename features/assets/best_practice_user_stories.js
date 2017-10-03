$( function() {
    $.ajax({
        type: "POST",
        url: "features/best_practice_users_stories/content.php",
        data: {search: 'all', permission: $("#user_permission").val() },
        success: function(result){
            $("#tabs-bestpractice > h2").text("Best Practice User Stories");
            $("#bestpractice-body").html(result);
            $('#save-bestpractice').click(save_bestpractice);
            $('#bestpractice-close').click(close_bestpractice_modal);
            $('#best-practice-add-backlog-close').click(close_bestpractice_backlog);
            $('#bestpractice-group').click(show_allgroup);
            load_bestpractice_data();
        }
    });
    console.log("Best Practice Stories");
});

$(document).ready(function() {

    var tablescenarios = $('#bestpractice_stories_table').DataTable();
    var database = firebase.database();
    var scenarioref = database.ref('bestpractice/');
    scenarioref.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    var child_data = childSnapshot.val();
    var isExist = !!$('#bestpractice-dropdown option').filter(function() {
        return $('#filtergroup').attr('value');
    }).length;
     
        if(!$('#filtergroup').find("option:contains('" + child_data.group  + "')").length && child_data.group != undefined){
          //   setTimeout(function(){
        
            $("#filtergroup").append('<option>'+child_data.group+'</option>');
          // }, 3000);
        }
        if(!$('#bestpractice-dropdown').find("option:contains('" + child_data.group  + "')").length && child_data.group != undefined){
            $("#bestpractice-dropdown").append('<option>'+child_data.group+'</option>');
        }
        });
    });
        $("#bestpractice-dropdown").change(function () {
          var selectedText =  $("#bestpractice-dropdown option:selected").text();
               $('#bestpractice-group').val(selectedText);
        });
    /*$("#filtergroup").change(function (row, data, dataIndex) {
        var database = firebase.database();
        var scenarioref = database.ref('bestpractice/');
        var selectedText = $("#filtergroup option:selected").text();
        $('#bestpractice_stories_table > tbody > tr').each(function(data) {
            var $this = $(this);
            var row_group = $this.attr('group');
           
            if(selectedText == row_group) {
                $this.addClass("selected");
            }else {
                $this.removeClass("selected");
            }
        });
    });*/
    $(document.body).on('change', '#filtergroup', function() {
        var table = $('#bestpractice_stories_table').DataTable();
        table
            .columns( 11 )
            .search( $(this).val() )
            .draw();
    });
     get_currentuser_backlogs($("#user_key").val(), "#backlog-select");
});

function show_allgroup(){
    $('#bestpractice-group').val("");
    console.log("is clicked again");
    var tablescenarios = $('#bestpractice_stories_table').DataTable();
    var database = firebase.database();
    var bestpracticeref = database.ref('bestpractice/');
    bestpracticeref.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    var child_data = childSnapshot.val();
    console.log(child_data.group);
    if(!$('#bestpractice-dropdown').find("option:contains('" + child_data.group  + "')").length && child_data.group != undefined){
        $("#bestpractice-dropdown").append('<option>'+child_data.group+'</option>');
    }
        });   
    });


}
function load_bestpractice_data(){
    var bestpractice = [];
    var database = firebase.database();
    var ref = database.ref('bestpractice/');
    ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
           
                //0331207 - get only active stories
                var tmp_bestpractice_story = new bestpractice_story(
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
                    child_data.group,
                    child_data.edit_del);
                bestpractice.push(tmp_bestpractice_story);
            
        });            
        loadbestpracticeDataTable(bestpractice);
    });
}

function edit_bestpractices(key){
    $("#bestpractice_edit").val(key);
    load_single_scenarios_data(key);
    var edit_modal = $('.best_practice_modal');
    edit_modal.attr("style","display:block;");
} 

function load_single_scenarios_data(key){
    var scenarios = [];
    var database = firebase.database();
    var ref = database.ref('bestpractice/' + key);
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
        group = $('#bestpractice-group');
        as_a = $('#bestpractice-as-a');
        i_want = $('#bestpractice-i-want-to');
        so_that = $('#bestpractice-so-that');
        acceptance_test = $('#bestpractice-acceptance-test');
        story_points = $('#bestpractice-story-points');
        comments = $('#bestpractice-comments');

        group.val(data.group);
        as_a.val(data.as_a);
        i_want.val(data.i_want);
        so_that.val(data.so_that);
        acceptance_test.val(data.acceptance_test);
        story_points.val(data.story_points);
        comments.val(data.comments);

        title = $('#bestpractice-title');
        title.html("Edit Best Practice Story");
        var modal = $('.best_practice_modal');
        modal.attr("style","display: block;");
    });
}

function loadbestpracticeDataTable(bestpractice) {
    if(table !== undefined) {
        table.clear();
    }
    var showaction = true;
    if($("#user_permission").val()  != "admin") {
        showaction = false;
    }
    tablescenarios = $('#bestpractice_stories_table').DataTable({
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
                targets: [12],
                visible: showaction
            },
            {
                searchable: false, targets: [10]
            }                  
        ],
        scrollX:true,
        scrollXInner:"100%",
        scrollCollapse:true,
        /*
        scrollY:function(){
            var browserht = $(window).height();
            tableht = browserht - 240;
            return tableht;
        },*/
        data: bestpractice,
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
                className: 'dt-head-left bestpractice-story-i-want'
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
                className: 'dt-head-left bestpractice-story-story-points'
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
                data: "group",
                className: 'dt-head-left scenarios_group'
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
}

function display_best_practice_modal(){
    //$("#bestpractice-dropdown").empty();
    $("#bestpractice_edit").val("");
    $('.best_practice_modal').css("visibility","visible");
    $('.best_practice_modal').css("display","block");
    $('#best-practice-add-backlog').css("visibility", "hidden");
}

function close_bestpractice_modal(){
    var modal = $('.best_practice_modal');
    modal.attr("style","visibility: hidden;");

    resetscenario_text();
}

function save_bestpractice(){
    var group, as_a, i_want, so_that, acceptance_test, story_points, comments;
    var database = firebase.database();
    var scenariosref = database.ref('bestpractice/');

    group = $('#bestpractice-group');
    as_a = $('#bestpractice-as-a');
    i_want = $('#bestpractice-i-want-to');
    so_that = $('#bestpractice-so-that');
    acceptance_test = $('#bestpractice-acceptance-test');
    story_points = $('#bestpractice-story-points');
    comments = $('#bestpractice-comments');

    isedit = "";
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

    if(!hasblank) {
        if($("#bestpractice_edit").val() == "") {
            save_to_bestpractice_firebase('BESTPRACTICE','', as_a.val(),i_want.val(), so_that.val(), acceptance_test.val(), story_points.val(),comments.val(), group.val(),'');
        } else {
            update_bestpractice_firebase($("#bestpractice_edit").val(),'BESTPRACTICE', '', as_a.val(),i_want.val(), so_that.val(), acceptance_test.val(), story_points.val(),comments.val(), group.val(),'');
        }
        //$("#filtergroup").empty();
        loadfilter();
        resetscenario_text();
        close_bestpractice_modal();
        load_bestpractice_data();
    }
}

function delete_bestpractices(key){
        $('#bestpractice-dropdown').empty();
        $('#bestpractice-group').empty();
        $('#filtergroup').empty();
        loadfilter();
        delete_bestpractices_story(key);
        load_bestpractice_data();
        close_delete_bestpractices_modal();
}

function close_delete_bestpractices_modal(){
    var modal = $('.delete-bestpractices-modal');
    modal.attr("style","visibility: hidden;");
}

function delete_bestpractices_story(key)
{
    var database = firebase.database();
    database.ref('/bestpractice/' + key).remove();
    return key;
}

function display_delete_bestpractices_modal(key){
    var modal = $('.delete-bestpractices-modal');
    modal.css('visibility','visible');
    modal.css('display','block');

    var deletebutton = $('#delete-recurring');
    deletebutton.attr("onclick","delete_bestpractices(\""+ key +"\");");
    
}

function resetscenario_text(){
    $('#bestpractice-group').val("");
    $('#bestpractice-as-a').val("");
    $('#bestpractice-i-want-to').val("");
    $('#bestpractice-so-that').val("");
    $('#bestpractice-acceptance-test').val("");
    $('#bestpractice-story-points').val("");
    $('#bestpractice-comments').val("");
}

function update_bestpractice_firebase(key, storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, group_var, order_var) {
    var database = firebase.database();
    database.ref('/bestpractice/' + key).update(
    {
        order: order_var,
        key: key,
        group: group_var,
        storyid: storyid_var,
        sprint_number: sprint_number_var,
        as_a: as_a_var,
        i_want: i_want_var,
        so_that: so_that_var,
        acceptance_test: acceptance_test_var,
        story_points: story_points_var,
        comments: comments_var,
        status: "",
        edit_del: "<a class='edit_link'  onclick='edit_bestpractices(\""+ key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_bestpractices_modal(\""+ key +"\");' href='#'>Delete</a>"
    });
    load_bestpractice_data();
    close_bestpractice_modal()
    return key;
}

function save_to_bestpractice_firebase(storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, group_var, order_var)
{

    var database = firebase.database();
    var bestpractices_tmp_key = database.ref('bestpractice/').push().key;
    database.ref('/bestpractice/' + bestpractices_tmp_key).set(
    {
      order: order_var,
      key: bestpractices_tmp_key,
      group: group_var,
      storyid: storyid_var,
      sprint_number: sprint_number_var,
      as_a: as_a_var,
      i_want: i_want_var,
      so_that: so_that_var,
      acceptance_test: acceptance_test_var,
      story_points: story_points_var,
      comments: comments_var,
      status: "",
      edit_del: "<a class='edit_link'  onclick='edit_bestpractices(\""+ bestpractices_tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_bestpractices_modal(\""+ bestpractices_tmp_key +"\");' href='#'>Delete</a>" 
   });

   load_bestpractice_data();
   return bestpractices_tmp_key;

}

//messages
    function blankMessages(){
        $('.notif-submit').css('display', 'none');
    }
    function sendEmail()
    {
      $('#send-button').addClass('disabled');
      event.preventDefault();
      /*var email = "pauljames.superable@portalintegrators";
      var subject = "TEST";
      var message = "this is a test";*/
      $('.notif-subject').css('display', 'none');
      $('.notif-message').css('display', 'none');
      var from_name = $('#user_name').html();
      var from_email = $('#user_email').val();
      var message = $('#message-content').val();
      var subject = $('#subject').val();

      
      if((message != null && message != "") && (subject != null && subject != ""))
      {
            $('.notif-subject').css('display', 'none');
            $('.notif-message').css('display', 'none');
            from_name = from_name.substring(0, from_name.length-2);
          console.log(from_name);
          console.log(from_email);
          console.log(message);
          console.log(subject);

        $.ajax({
                type: "POST",
                url: "/rocketscrum/templates/rocket-email.php",
                data: ('frname='+ from_name + '&fremail='+ from_email +'&subject='+ subject + '&message='+ message) ,
                success: function (result) {
                        console.log("result:" + result);
                        $('.notif-submit').css('display', 'block');
                        $('#message-content').val("");
                        $('#subject').val("");
                  }
              });
      }else{
        event.preventDefault();
        console.log("LOL");
        if(message == null || message == ""){
            $('.notif-message').css('display', 'block');
        }
        if(subject == null || subject == ""){
            $('.notif-subject').css('display', 'block');
        }
      }

      //return false;
    }
    function sendMessage(headers_obj, message, callback)
    {
      var email = '';

      for(var header in headers_obj)
        email += header += ": "+headers_obj[header]+"\r\n";

      email += "\r\n" + message;

      var sendRequest = gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
          'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
        }
      });

      return sendRequest.execute(callback);
    }


//best practice backlogs
function display_best_practice_add_backlog(){
    $("#backlog-select").prop("selectedIndex", -1);
    $("#recurring-bestpractice").prop("checked", true);
    $('#best-practice-add-backlog').css("visibility","visible");
    $('#best-practice-add-backlog').css("display","block");
    $('.best_practice_modal').css("visibility","hidden");
}

function close_bestpractice_backlog(){
    var modalclose = $('#best-practice-add-backlog');
    modalclose.attr("style","visibility: hidden;");

    resetscenario_text();
}

function bestpractice_save_backlog(){
    var database = firebase.database();
    var tblbestpractice = $('#bestpractice_stories_table').DataTable();
    var bestpracticeData = tblbestpractice.rows('.selected').data();
    var selected_backlog = $('#backlog-select').val();
    var recur = $('#recurring-bestpractice').prop("checked");
    if(recur){
        for (var x = 0; x<bestpracticeData.length; x++){
            var bestpractice_tmp_key = database.ref(selected_backlog + '/recurring_stories/').push().key;
            var backlogref = database.ref(selected_backlog+"/recurring_stories");
            database.ref(selected_backlog+ '/recurring_stories/' + bestpractice_tmp_key).set(
           {
              order: bestpracticeData[x].order,
              key: bestpractice_tmp_key,
              storyid:bestpracticeData[x].storyid,
              sprint_number: '',
              as_a: bestpracticeData[x].as_a,
              i_want: bestpracticeData[x].i_want,
              so_that: bestpracticeData[x].so_that,
              acceptance_test: bestpracticeData[x].acceptance_test,
              story_points: bestpracticeData[x].story_points,
              comments: bestpracticeData[x].comments,
              status: "",
              edit_del: "<a class='edit_link'  onclick='edit_recurring(\""+ bestpractice_tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_modal(\""+ bestpractice_tmp_key +"\");' href='#'>Delete</a>"
           });
        }
     $('h4').text("Successfully Added!");
        window.location.href = 'admin_settings.php';
    }

    else{
        console.log("For add to backlog.");
    }
}

function loadfilter(){
    var tablescenarios = $('#bestpractice_stories_table').DataTable();  
    var database = firebase.database();
    var ref = database.ref('bestpractice/');
    ref.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    var child_data = childSnapshot.val();
    var isExist = !!$('#bestpractice-dropdown option').filter(function() {
        return $('#filtergroup').attr('value');
    }).length;
       // setTimeout(function() { 
      //  }, 1000);
        console.log("filtergroup");
        if(!$('#filtergroup').find("option:contains('" + child_data.group  + "')").length && child_data.group != undefined){
            var datagroup = child_data.group;
           // setTimeout(function() { 
            $("#filtergroup").append('<option>'+datagroup+'</option>');
       // }, 1000);
            console.log("Datagroup: " + datagroup);
    
        }
        if(!$('#bestpractice-dropdown').find("option:contains('" + child_data.group  + "')").length && child_data.group != undefined){
            console.log($('#bestpractice-dropdown').html());
            $("#bestpractice-dropdown").append('<option>'+child_data.group+'</option>');
        }
        });
        
    });
}