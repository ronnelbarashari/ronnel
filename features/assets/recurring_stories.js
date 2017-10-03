
var onsched = false;
var week=false;
var monthdate=false;
var quarter=false;
var year=false;
var schedule_date;
var setrecurring;
var schedule_end_date;
var numberadded;

$( function() {

    //display Content of the body
    $.ajax({
        type: "POST",
        url: "features/recurring_stories/content.php",
        data: {search: 'all'},
        success: function(result){
            $("#tabs-recurring > h2").text("Recurring Stories");
            $("#recurring-body").html(result);
            $('#save-recurring').click(save_recurring);
            $('#recurring-close').click(close_recurring_modal);
            $('#onschedule').click(enable_schedule);
            $('#weekly-chkbox').click(weekly_schedule);
            $('#monthly-chkbox').click(monthly_schedule);
            $('#quarterly-chkbox').click(quarterly_schedule);
            $('#yearly-chkbox').click(yearly_schedule);
            recurring_copybacklogs();
            getrecurringselectedbacklog();
           
        }
    });
    
});

function enable_schedule(){
    if(this.checked==true){
      //console.log("On");
      $(".manageschedule").css("visibility","visible");
      onsched = true;
      
    }else{
     // console.log("Off");
      $(".manageschedule").css("visibility","hidden");
      onsched = false
    }
}

function weekly_schedule(){
    if(this.checked==true){
      console.log("On");
      $("#recurring-weekly").css("visibility","visible");
      $('#monthly-chkbox').attr("checked",false);
      $('#quarterly-chkbox').attr("checked",false);
      $('#yearly-chkbox').attr("checked",false);
      $("#recurring-monthly").css("visibility","hidden");
      $("#recurring-quarterly").css("visibility","hidden");
      $("#recurring-yearly").css("visibility","hidden");
      week = true;
      monthdate = false;
      quarter = false;
      year = false;
    }else{
      console.log("Off");
      $("#recurring-weekly").css("visibility","hidden");
      week = false;
    }
}

function monthly_schedule(){
    if(this.checked==true){
      console.log("On");
      $("#recurring-monthly").css("visibility","visible");
      $('#weekly-chkbox').attr("checked",false);
      $('#quarterly-chkbox').attr("checked",false);
      $('#yearly-chkbox').attr("checked",false);
      $("#recurring-weekly").css("visibility","hidden");
      $("#recurring-quarterly").css("visibility","hidden");
      $("#recurring-yearly").css("visibility","hidden");
      console.log("monthly true");
      monthdate = true;
      week = false;
      quarter = false;
      year = false;
    }else{
      console.log("Off");
      $("#recurring-monthly").css("visibility","hidden");
      monthdate = false;

    }
}

function quarterly_schedule(){
    if(this.checked==true){
      console.log("On");
      $("#recurring-quarterly").css("visibility","visible");
      $('#monthly-chkbox').attr("checked",false);
      $('#weekly-chkbox').attr("checked",false);
      $('#yearly-chkbox').attr("checked",false);
      $("#recurring-monthly").css("visibility","hidden");
      $("#recurring-weekly").css("visibility","hidden");
      $("#recurring-yearly").css("visibility","hidden");
      quarter = true;
      week = false;
      monthdate = false;
      year = false;
    }else{
      console.log("Off");
      $("#recurring-quarterly").css("visibility","hidden");
      quarter = false;
    }
}


function yearly_schedule(){
    if(this.checked==true){
      console.log("On");
      $("#recurring-yearly").css("visibility","visible");
      $('#monthly-chkbox').attr("checked",false);
      $('#quarterly-chkbox').attr("checked",false);
      $('#weekly-chkbox').attr("checked",false);
      $("#recurring-monthly").css("visibility","hidden");
      $("#recurring-quarterly").css("visibility","hidden");
      $("#recurring-weekly").css("visibility","hidden");
      year = true;
      week = false;
      monthdate = false;
      quarter = false;
    }else{
      console.log("Off");
      $("#recurring-yearly").css("visibility","hidden");
      year = false;
    }
}

function save_recurring_sched(){
    recurnumber = $('#recurring-number option:selected').val();
    recurday = $('#recurring-set').val();
    recurdate = $('#recurring-date').val();

    var database = firebase.database();
    var ref = database.ref('recurring_stories/');

    console.log("saving");
    var hasblank = false;
    if(recurnumber == undefined){
        $('.numberrequired').css("color","red");
        hasblank = true;
    }else{
        $('.numberrequired').css("color","black");
    }

    if(recurday == null){
        $('.dayrequired').css("color","red");
        hasblank = true;
    }else{
        $('.dayrequired').css("color","black");
    }

    if(recurdate == ""){
        $('.daterequired').css("color","red");
        hasblank = true;
    }else{
        $('.daterequired').css("color","black");
    }

    console.log("mynumber",recurnumber);
    console.log("recurdate",recurdate);
    console.log("recurday",recurday);


    if(!hasblank){
      if($('#recurring-set').val() == "weekly"){
        console.log("weekly");
        var number = $('#recurring-number').val();
        var addedday = number * 7;
        var date = new Date(Date.parse($('#recurring-date').val()));
        date.setDate(date.getDate()+addedday);

        var month = date.getMonth()+1;
        var day = date.getDate();
        var output = month + '/' + day + '/' + date.getFullYear(); 

        console.log("schedule date: "+$('#recurring-date').val());
        console.log("schedule post: "+output);
        schedule_end_date = output;
        setrecurring = "weekly";
        schedule_date = $('#recurring-date').val();
        numberadded = $('#recurring-number').val();

      }else if($('#recurring-set').val() == "monthly"){
        console.log("monthly");
        var number = $('#recurring-number').val();
        var addedday = number * 31;
        var date = new Date(Date.parse($('#recurring-date').val()));
        date.setDate(date.getDate()+addedday);

        var month = date.getMonth()+1;
        var day = date.getDate();
        var output = month + '/' + day + '/' + date.getFullYear(); 

        console.log("schedule date: "+$('#recurring-date').val());
        console.log("schedule post: "+output);
        schedule_end_date = output;
        setrecurring = "monthly";
        schedule_date = $('#recurring-date').val();
        numberadded = $('#recurring-number').val();

      }else{
        console.log("yearly");
        var number = $('#recurring-number').val();
        var addedday = number * 365;
        var date = new Date(Date.parse($('#recurring-date').val()));
        date.setDate(date.getDate()+addedday);

        var month = date.getMonth()+1;
        var day = date.getDate();
        var output = month + '/' + day + '/' + date.getFullYear(); 

        console.log("schedule date: "+$('#recurring-date').val());
        console.log("schedule post: "+output);
        schedule_end_date = output;
        setrecurring = "yearly";
        schedule_date = $('#recurring-date').val();
        numberadded = $('#recurring-number').val();

      }
      console.log("sched date: ",schedule_date);
      console.log("set recccc: ",setrecurring);
      console.log("sched end date: ",schedule_end_date);
      console.log("sched number addeddd: ",numberadded);

      close_sched_recurring_modal();
    }
}


function save_recurring() {
            
var recurring_id, as_a, i_want, so_that, acceptance_test, story_points, comments;
var database = firebase.database();
var recurringref = database.ref('recurring_stories/');

recurring_id = $('#recurring-story-id');
as_a = $('#recurring-as-a');
i_want = $('#recurring-i-want-to');
so_that = $('#recurring-so-that');
acceptance_test = $('#recurring-acceptance-test');
story_points = $('#recurring-story-points');
comments = $('#recurring-comments');
var hasempty = false;

if(recurring_id.val() == null){
    $('div.Recurring_DTE_Field_Error.recurring_id').css("display","block");
    hasempty = true;
}
else{
    $('div.Recurring_DTE_Field_Error.recurring_id').css("display","none");
}

if(as_a.val() == ""){
    $('div.Recurring_DTE_Field_Error.recurring_as_a').css("display","block");
    hasempty = true;
}
else{
    $('div.Recurring_DTE_Field_Error.recurring_as_a').css("display","none");
}

if(i_want.val() == ""){
    $('div.Recurring_DTE_Field_Error.recurring_i_want').css("display","block");
    hasempty = true;
}
else{
    $('div.Recurring_DTE_Field_Error.recurring_i_want').css("display","none");
}

if(so_that.val() == ""){
    $('div.Recurring_DTE_Field_Error.recurring_so_that').css("display","block");
    hasempty = true;
}
else{
    $('div.Recurring_DTE_Field_Error.recurring_so_that').css("display","none");
}

if(acceptance_test.val() == ""){
    $('div.Recurring_DTE_Field_Error.recurring_acceptance_test').css("display","block");
    hasempty = true;
}
else{
    $('div.Recurring_DTE_Field_Error.recurring_acceptance_test').css("display","none");
}

if(story_points.val() == null){
    $('div.Recurring_DTE_Field_Error.recurring_story_points').css("display","block");
    hasempty = true;
}
else{
    $('div.Recurring_DTE_Field_Error.recurring_story_points').css("display","none");
}

if(!hasempty)
{
    isedit = $('#recurring_is_edit');
    editkey = $('#recurring_edit_key');

    if(isedit.val() == ""){
        save_recurring_to_firebase(recurring_id.val(),'',as_a.val(),i_want.val(), so_that.val(), acceptance_test.val(), story_points.val(),comments.val(),'');
    }
    else if($('#chkbox_makecopybacklog').prop('checked')){
            
            //will update the data
            update_story(editkey.val(),recurring_id.val(),'',as_a.val(),i_want.val(), so_that.val(), acceptance_test.val(), story_points.val(),comments.val(),'');
            copy_recurring_to_firebase(recurring_id.val(),'',as_a.val(),i_want.val(), so_that.val(), acceptance_test.val(), story_points.val(),comments.val(),'');
    }
    else{
        location.reload();
        update_story(editkey.val(),recurring_id.val(),'',as_a.val(),i_want.val(), so_that.val(), acceptance_test.val(), story_points.val(),comments.val(),'')
    }

    close_recurring_modal();
    load_recurring_data();
    
}

}


function display_recurring_schedule(key) {

    console.log("display modal");
    var modal = $('.recurring-modal-sched');
    modal.attr("style","visibility: visible;");
    $('#recurring-date').datepicker();
    $('#recurring-weekly').datepicker();
    $('#recurring-monthly').datepicker();
    $('#recurring-quarterly').datepicker();
    $('#recurring-yearly').datepicker();
    $('.recurring-modal').attr("style","visibility: hidden;");
    $('.manageschedule').css('visibility','hidden');
    $('#onschedule').css('visibility','hidden');
    $('.enable-set').css('visibility','hidden');

}

function display_recurring_modal(){
    
    $('#onschedule').prop("checked",false);
    isedit = $('#recurring_is_edit');
    isedit.val("");


    title = $('#Recurring-title');
    title.html("Create New Recurring Story");


    recurring_id = $('#recurring-story-id');
    as_a = $('#recurring-as-a');
    i_want = $('#recurring-i-want-to');
    so_that = $('#recurring-so-that');
    acceptance_test = $('#recurring-acceptance-test');
    story_points = $('#recurring-story-points');
    comments = $('#recurring-comments');

    recurring_id.val("");
    as_a.val("");
    i_want.val("");
    so_that.val("");
    acceptance_test.val("");
    story_points.val("");
    comments.val("");
    
    var modal = $('.recurring-modal');
    modal.attr("style","visibility: visible;");

    var drp_modal = $('#drpCopy');
    drp_modal.attr("style","display: none;");
    $('div.Recurring_DTE_Field_Error.recurring_id').css("display","none");
    $('div.Recurring_DTE_Field_Error.recurring_as_a').css("display","none");
    $('div.Recurring_DTE_Field_Error.recurring_i_want').css("display","none");
    $('div.Recurring_DTE_Field_Error.recurring_so_that').css("display","none");
    $('div.Recurring_DTE_Field_Error.recurring_acceptance_test').css("display","none");
    $('div.Recurring_DTE_Field_Error.recurring_story_points').css("display","none");
}

function edit_recurring(key){
    isedit = $('#recurring_is_edit');
    isedit.val("True");
    editkey = $('#recurring_edit_key');

    editkey.val(key);
    
    load_single_data(key);
    console.log(key);

    $('#chkbox_makecopybacklog').prop('checked', false);

    var drp_modal = $('#drpCopy');
    drp_modal.attr("style","display:block;");
} 

function close_recurring_modal(){
    var modal = $('.recurring-modal');
    modal.attr("style","visibility: hidden;");

    var recurring_copy = $('#recurring_copy');
    recurring_copy.attr("style","visibility: hidden;");
    $('.manageschedule').css('visibility','hidden');
    $('#onschedule').css('display','none !important');
    $('.enable-set').css('visibility','hidden');
    
}

function close_delete_recurring_modal(){
    var modal = $('.delete-recurring-modal');
    modal.attr("style","visibility: hidden;");
    
}


function close_sched_recurring_modal(){

    var modal = $('.recurring-modal-sched');
    modal.attr("style","visibility: hidden;");
    $('.recurring-modal').attr("style","visibility: visible;");
    $('.manageschedule').css('visibility','visible');
    $('.onschedule').css('visibility','visible');

    $("#recurring-weekly").css("visibility","hidden");
    $("#recurring-monthly").css("visibility","hidden");
    $("#recurring-quarterly").css("visibility","hidden");
    $("#recurring-yearly").css("visibility","hidden");
    $('.enable-set').css('visibility','visible');

}

function display_delete_modal(key){
    console.log("deleted");
    var deletebutton = $('#delete-recurring');
    deletebutton.attr("onclick","delete_recurring(\""+ key +"\");");

    var modal = $('.delete-recurring-modal');
    modal.attr("style","visibility: visible;");
    
    
}


function save_recurring_to_firebase(storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
{
  var database = firebase.database();
  



  if(story_points_var == null){
    story_points_var = ' ';
  }

  var tmp_key = database.ref($('#selected_backlog').val()+ '/recurring_stories/').push().key;

   if(onsched == true){
    database.ref($('#selected_backlog').val()+ '/recurring_stories/' +tmp_key).update(
    {
        scheduled: "true"
    });

    return tmp_key;
  }


   database.ref($('#selected_backlog').val()+ '/recurring_stories/' + tmp_key).set(
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
      status: "",
      edit_del: "<a class='edit_link'  onclick='edit_recurring(\""+ tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_modal(\""+ tmp_key +"\");' href='#'>Delete</a>"
   });
   return tmp_key;
}

function loadrecurringDataTable(recurring) {
        if(table !== undefined) {
            table.clear();
        }

        table = $('#recurring_stories_table').DataTable(
            {
                "dom": '<"top"i>rt<"bottom"flp><"clear">',
                destroy: true,
                responsive: true,
                rowReorder: false,
                sortable: true,
                order: [
                    [0, 'asc']
                ],
                paging: false,
                dom: '.rs-navigation',
                select: true,
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
                        visible: true
                    },
                    {
                        searchable: false, targets: [10]
                    }
                   
                ],
                scrollX:true,
                //Adjusted to 100% from 130% -> Johann/Japs 3/23/17
                scrollXInner:"100%",
                scrollCollapse:true,
                data: recurring,
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
                        className: 'dt-head-left recurring-story-id'
                    },
                    {
                        data: "sprint_number",
                        className: 'dt-head-left recurring-story-sprint_number'
                    },
                    {
                        data: "as_a",
                        className: 'dt-head-left recurring-story-as-a'
                    },
                    {
                        data: "i_want",
                        className: 'dt-head-left recurring-story-i-want'
                    },
                    {
                        data: "so_that",
                        className: 'dt-head-left recurring-story-so-that'
                    },
                    {
                        data: "acceptance_test",
                        className: 'dt-head-left recurring-story-acceptance-test'
                    },
                    {
                        data: "story_points",
                        className: 'dt-head-left recurring-story-story-points'
                    },
                    {
                        data: "comments",
                        className: 'dt-head-left recurring-story-comments'
                    },
                    {
                        data: "status",
                        className: 'dt-head-left recurring-story-status'
                    },
                    {
                        data: "edit_del",
                        className: 'dt-head-left recurring-action'
                    }
                    
                ]
            });
            table.buttons().containers().appendTo( '.rs-navigation' ); //button reposition

            // Restore record
            table.on('click', 'a.restore_link',function(e)
            {

                e.preventDefault();

                editor.title('Restore')
                    .message('Are you sure you want to restore this story?')
                    .buttons({
                        label:'Restore',
                        fn: function(){this.submit();}
                    })
                    .remove($(this).closest('tr'));
               
            });

            //03312017 - show active stories
           

    }

    function load_recurring_data(){
      
        var recurring = [];
        var database = firebase.database();
        var ref = database.ref($('#selected_backlog').val()+'/recurring_stories/');
        ref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var child_data = childSnapshot.val();
               
                    //0331207 - get only active stories
                    var tmp_user_story = new user_story(
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
                        child_data.edit_del);
                    recurring.push(tmp_user_story);
                
            });
            loadrecurringDataTable(recurring);
        });

    }

    function load_single_data(key){

        var recurring = [];
        var database = firebase.database();
        var ref = database.ref($('#selected_backlog').val()+ '/recurring_stories/' + key);
        $('#onschedule').prop("checked",false);
        ref.once('value').then(function(snapshot) {
                        var data = snapshot.val();
                        data.order,
                        key,
                        data.storyid,
                        data.sprint_number,
                        data.as_a,
                        data.i_want,
                        data.so_that,
                        data.acceptance_test,
                        data.story_points,
                        data.comments,
                        data.status,
                        data.edit_del,
                        data.number_added,
                        data.set_recurring,
                        data.date_schedule;

              var child_data = snapshot.val();

              if(child_data.scheduled == "true"){
                  $('.manageschedule').css('visibility','visible');
                  $('#onschedule').prop("checked",true);
              }else if(child_data.scheduled == "false"){
                  $('.manageschedule').css('visibility','hidden');
                  $('#onschedule').prop("checked",false);
              } 

                recurring_id = $('#recurring-story-id');
                as_a = $('#recurring-as-a');
                i_want = $('#recurring-i-want-to');
                so_that = $('#recurring-so-that');
                acceptance_test = $('#recurring-acceptance-test');
                story_points = $('#recurring-story-points');
                comments = $('#recurring-comments');
                number_added = $('#recurring-number');
                set_recurring = $('#recurring-set');
                date_schedule = $('#recurring-date');

                recurring_id.val(data.storyid);
                as_a.val(data.as_a);
                i_want.val(data.i_want);
                so_that.val(data.so_that);
                acceptance_test.val(data.acceptance_test);
                story_points.val(data.story_points);
                comments.val(data.comments);
                number_added.val(data.number_added);
                set_recurring.val(data.set_recurring);
                date_schedule.val(data.date_schedule)


                title = $('#Recurring-title');
                title.html("Edit Recurring Story");
                var modal = $('.recurring-modal');
                modal.attr("style","visibility: visible;");
                $('.enable-set').css('visibility','visible');

        });

    }

    function delete_recurring(key){
        
        delete_story(key);
        load_recurring_data();
        close_delete_recurring_modal();
    }


function update_story(key,storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
{
  var database = firebase.database();
  

    if(onsched == true){
    database.ref($('#selected_backlog').val()+ '/recurring_stories/' +key).update(
    {
        scheduled: "true",
        set_recurring: setrecurring,
        date_schedule: schedule_date,
        schedule_post: schedule_end_date,
        number_added: numberadded,
        order: order_var,
          key: key,
          storyid: storyid_var,
          sprint_number: sprint_number_var,
          as_a: as_a_var,
          i_want: i_want_var,
          so_that: so_that_var,
          acceptance_test: acceptance_test_var,
          story_points: story_points_var,
          comments: comments_var,
          status: "",
          edit_del: "<a class='edit_link'  onclick='edit_recurring(\""+ key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_modal(\""+ key +"\");' href='#'>Delete</a>"
    });

    return key;

    }else{
    database.ref($('#selected_backlog').val()+ '/recurring_stories/' +key).update(
    {
        scheduled: "false",
         key: key,
          storyid: storyid_var,
          sprint_number: sprint_number_var,
          as_a: as_a_var,
          i_want: i_want_var,
          so_that: so_that_var,
          acceptance_test: acceptance_test_var,
          story_points: story_points_var,
          comments: comments_var,
          status: "",
          edit_del: "<a class='edit_link'  onclick='edit_recurring(\""+ key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_modal(\""+ key +"\");' href='#'>Delete</a>"

    });
    return key;
    }

   database.ref($('#selected_backlog').val() + '/recurring_stories/' + key).set(
   {
      order: order_var,
      key: key,
      storyid: storyid_var,
      sprint_number: sprint_number_var,
      as_a: as_a_var,
      i_want: i_want_var,
      so_that: so_that_var,
      acceptance_test: acceptance_test_var,
      story_points: story_points_var,
      comments: comments_var,
      status: "",
      edit_del: "<a class='edit_link'  onclick='edit_recurring(\""+ key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_modal(\""+ key +"\");' href='#'>Delete</a>"
   });
   return key;
}

function delete_story(key)
{
  var database = firebase.database();
  

   database.ref($('#selected_backlog').val()+ '/recurring_stories/' + key).remove();
   return key;
}

 function recurring_showbacklogs(){
      var database = firebase.database();
      var userref = database.ref('user');
      var dropdown = '<div id="div-recurring-select-backlog"><span> Selected Backlog:<select id=\"recurring_select_backlog\" >';
      var ref = database.ref('backlogs/');
        dropdown    += '</select></span></div>';
        $(dropdown).insertAfter('#tabs-recurring > h2');
        get_currentuser_backlogs($("#user_key").val(),"#recurring_select_backlog");
        setrecurringeventlistener();
}

function setrecurringeventlistener(){
    
        //DataTable functions removed 
         $(document).on('change', '#recurring_select_backlog',function () {
        // $('#scenario_show_backlog').on('change', function () {
        var database = firebase.database();
        database.ref('user/' + $('#user_key').val() +'/selected_backlogs').set(
        {
          title: this.options[this.selectedIndex].text,
          key: this.options[this.selectedIndex].value
          });           
    
        $('#selected_backlog').val(this.options[this.selectedIndex].value);
            getmax();
            load_recurring_data();
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

    load_recurring_data();

}

function getrecurringselectedbacklog(){
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
                      $('#selected_backlog').val(child_data.key)
                      
               recurring_showbacklogs();
               getmax();
               load_recurring_data();
          });
    }

function copy_recurring_to_firebase(storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
{
  var database = firebase.database();
  
  if(story_points_var == null){
    story_points_var = ' ';
  }

  var tmp_key = database.ref($('#recurring_copy').val()+ '/recurring_stories/').push().key;

   database.ref($('#recurring_copy').val()+ '/recurring_stories/' + tmp_key).set(
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
      status: "",
      edit_del: "<a class='edit_link'  onclick='edit_recurring(\""+ tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_modal(\""+ tmp_key +"\");' href='#'>Delete</a>"
   });
   return tmp_key;
}

function display_dropdown_copybacklogs(){
        if( $('#chkbox_makecopybacklog').prop('checked')){
            $('#recurring_copy').css('visibility','visible');

        }
        else{
            $('#recurring_copy').css('visibility','hidden');
        }
}

function recurring_copybacklogs(){
      var database = firebase.database();
      var userref = database.ref('user');
      var copydropdown = '<div id="div-recurring-select-backlog"><input type="checkbox" id="chkbox_makecopybacklog" onclick="display_dropdown_copybacklogs()" value="True"></input> <select id=\"recurring_copy\" style="visibility:hidden">';

      var ref = database.ref('backlogs/');


    userref.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var child_data = childSnapshot.val();
                        

                    if(child_data.email == firebase.auth().currentUser.email) {
                        user_permission = child_data.permittedbacklog;
                    } 
                });
                
                if(user_permission != ""){
                    user_permissions = user_permission.split(";");

                }
                
                if(user_permissions.length > 0) {

                        ref.once('value').then(function(snapshot) {
                            snapshot.forEach(function(childSnapshot) {
                               var key = childSnapshot.key;
                               var child_data = childSnapshot.val();

                                   var tmp_backlogs = new user_backlogs(
                                       child_data.title,
                                       key,
                                       child_data.descriptions
                                      );
                                
                              for(i=0;i<user_permissions.length;i++){
                                   

                                    if(child_data.title == user_permissions[i] && child_data.status != "archive"){
                                        
                                        if($('#selected_backlog').val() == key){
                                            //$('#recurring_copy').html('<option selected="selected" value="'+ key+'" >'+child_data.title+'</option>');
                                            copydropdown += '<option selected="selected" value="'+ key+'" >'+child_data.title+'</option>';
                                        }
                                        else{
                                            //$('#recurring_copy').html('<option selected="selected" value="'+ key+'" >'+child_data.title+'</option>');
                                            copydropdown += '<option value="'+ key+'">'+child_data.title+'</option>';
                                        }
                                    }
                                }   
                                                                 
                            });

                            //$('#recurring_copy').html('<option selected="selected" value="'+ key+'" >'+child_data.title+'</option>')
                            copydropdown    += '</select></div>';
                            $(copydropdown).insertBefore('#markings');
                        });
                }
        seteventlistener();
      });
    
}