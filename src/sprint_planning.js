////////////////////////////////////////////////////////////////////////////////
// Functions
// show_story() -
// set_sprint() -
// set_user_story() -
// update_table() -
// start_sprint_planning() - show the modal dialog and setup first story.
// sprint_planning_next() - save the story to the sprint and move to next story.
// sprint_planning_previous() - save the story to the sprint and move to the previous story.
////////////////////////////////////////////////////////////////////////////////

// GLOBAL VARIABLES
var row_index = 0;
var last_row = 0;
var table;
var data;

var recurring_table;
var recurring_data;

var d1 = new Date();
var d2 = new Date();
var d1_date_obj;
var d2_date_obj;
var sprint_num;
var points_input;
var points;
var totalpoints;
var sprint_point_total = 0;
var prev_points = 0;
var recurring_stories = [];
var display_recurring = false;
var recurring_index;
var points;
var skip_stories =[];

var sprintnumarr = [];
var isprevious ;
var startingstorykey ="";
var ispreviouspoints = false;
var running_total_logs = [];
var number_of_stories_to_be_picked=0;
var numTodo=0;
var numRecur=0;
var skipped_row_index=[];
var numNext=0;

$(document).ready(function() {
   $("#selected_backlog").change(function(){
          load_data(); 
   });   
   $('#sprint_end_date').on('change', function()
      {
          if($('#sprint_start_date').val() != ""){
               recurring_index = 0
               row_index = 0;
               remove_data_recurring();
               show_story(row_index, data)
          }//console.log("this");
      });
   $('#sprint_start_date').on('change', function()
      {
          //console.log("this")
          if($('#sprint_end_date').val() != ""){
               recurring_index = 0;
               row_index = 0;
            show_story(row_index, data)
       }
   });

});


function get_sprint_points()
{
  // this function will get any existing points for the sprint from firebase.
  // It will then set this starting amount to 0 if none exist or to the actual
  // amount if some already exist.
}

function add_points_to_sprint()
{
  // This function adds points to the sprint total.
}

function get_last_row(story_data, number) {
   last_row = story_data.length - number;
   for(var i = 0;i < length;i--) {
      if(story_data[last_row].status == "in progress" || story_data[last_row].status == "done") {
         get_last_row(story_data, number + 1);
      } else {
         return story_data.length - number;
      }
   }
}

function show_story(which_row, story_data, isprevious = false)
{
   
      if(recurring_stories.length > 0 && recurring_index < recurring_stories.length){
         d2 = $('#sprint_end_date').datepicker().val();
         
         //if(checkSRecurringschedule(recurring_stories))
         if(checkSRecurringschedule(d2,recurring_stories[recurring_index])){
            $("#current_row_index").val(which_row);
            document.getElementById('as_a').innerHTML = "<b>As a</b> " + recurring_stories[recurring_index].as_a;
            document.getElementById('i_want').innerHTML = "<b>I want</b> " + recurring_stories[recurring_index].i_want;
            document.getElementById('so_that').innerHTML = "<b>So that</b> " + recurring_stories[recurring_index].so_that;
            document.getElementById('acceptance_test').innerHTML = "<b>Acceptance Test:</b> " + recurring_stories[recurring_index].acceptance_test;
            document.getElementById('comments').innerHTML = "<b>Comments:</b> " + recurring_stories[recurring_index].comments;
            display_recurring = true;
            document.getElementById('span_is_recurring').innerHTML = "<b>This is a Recurring Story</b>";
            $('#estimated_points').val(recurring_stories[recurring_index].story_points);
            update_running_total();
            if(story_data.length>0){
               if(parseInt(story_data[which_row].story_points)) {
                  $('#estimated_points').val(recurring_stories[recurring_index].story_points);
                   update_running_total();
               }
            }
            return true;
         }
         else{
          recurring_stories[recurring_index].skipped = true;
          recurring_index++;
          show_story(which_row, story_data);
         }
      }
      
    if (story_data.length >=1) {
      if((story_data[which_row].status == "in progress" || story_data[which_row].status == "done") && !isprevious ) {
         if(story_data.length >= which_row) {
            which_row += 1;
            show_story(which_row, story_data);
         } else {
            return true;
         }
      }
     else {
         if(startingstorykey == ""){
            startingstorykey = story_data[which_row].key;
         }
      }

      last_row = get_last_row(story_data, 1);

         if(story_data[which_row].status == "" || story_data[which_row].status == "to do" || isprevious) {
            if(story_data[0].status != "" && story_data[0].status != "to do") {
               if(which_row > 0) {
                  row_index = which_row;
               }
            }
            //console.log('Row Index: ' + which_row);
            $("#current_row_index").val(which_row);
            document.getElementById('as_a').innerHTML = "<b>As a</b> " + story_data[which_row].as_a;
            document.getElementById('i_want').innerHTML = "<b>I want</b> " + story_data[which_row].i_want;
            document.getElementById('so_that').innerHTML = "<b>So that</b> " + story_data[which_row].so_that;
            document.getElementById('acceptance_test').innerHTML = "<b>Acceptance Test:</b> " + story_data[which_row].acceptance_test;
            document.getElementById('comments').innerHTML = "<b>Comments:</b> " + story_data[which_row].comments;
            display_recurring = false;
            document.getElementById('span_is_recurring').innerHTML = "";
            if(parseInt(story_data[which_row].story_points)) {
               $('#estimated_points').val(story_data[which_row].story_points);
            }
         }
         update_running_total();
         isSprintStart = true;
      }
    else{
      
   }
}

function set_sprint(sprint_num, start_date, end_date)
{
   // Save sprint info before moving to next story.
   database.ref($('#selected_backlog').val() + '/sprints/sprint' + sprint_num).set(
   {
      sprint_start_date: start_date.toJSON(),
      sprint_end_date: end_date.toJSON(),

      // Need to have a sum of all points and then when close sprint planning save that sum here. This is a running total.
      // total_sprint_points: points_input.options[points_input.selectedIndex].text
   });
}

function set_user_story(sprint_number, which_row, points)
{
   database.ref($('#selected_backlog').val()+'/user_stories/' + data[which_row].key).update(
   {
      sprint_number: sprint_number,
      as_a: data[which_row].as_a,
      i_want: data[which_row].i_want,
      so_that: data[which_row].so_that,
      acceptance_test: data[which_row].acceptance_test,
      story_points: points,
      comments: data[which_row].comments
   });
}

function set_user_story_default(sprint_number, which_row, points)
{
   database.ref($('#selected_backlog').val()+'/user_stories/' + data[which_row].key).update(
   {
      sprint_number: sprint_number,
      as_a: data[which_row].as_a,
      i_want: data[which_row].i_want,
      so_that: data[which_row].so_that,
      acceptance_test: data[which_row].acceptance_test,
      story_points: points,
      comments: data[which_row].comments,
      status: ""
   });
}

function set_user_story_status( which_row)
{
   
   database.ref( $('#selected_backlog').val()+ '/user_stories/' + data[which_row].key).update(
   {
      status: "in progress"
   });

   var my_tmp_story_2;
   var row_key = which_row;
                my_tmp_story_2 = new user_story(data[row_key].order, row_key, data[row_key].storyid, data[row_key].sprint_number,
                    data[row_key].as_a, data[row_key].i_want, data[row_key].so_that, data[row_key].acceptance_test,
                    data[row_key].story_points, data[row_key].comments, data[row_key].status, "<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>");


   table = $('#stories_table').DataTable();
   //console.log(table);
   data[which_row].status = "in progress";

   $("#stories_table").find("tr[key]").each(function () {
      //console.log("which row: " + which_row + " order: " + $(this).attr('key'));
      if($(this).attr('key') == data[which_row].key) {
         $(this).closest('tr').css('background','#FFFF00');
         $(this).closest('tr').removeClass("reorderable");
         return false
      }
   });
   //output.data.push(my_tmp_story_2);
   //table.draw();
   //data.draw();

}

function update_table(row_index, sprint_column_index, points_column_index, sprint_number, points)
{
   data.cell(':eq(' + row_index + ')', sprint_column_index).data(sprint_num).draw();
   data.cell(':eq(' + row_index + ')', points_column_index).data(points).draw();
}
//comparing schedule
function checkSRecurringschedule(sprintenddate, recurringstory) {
  var isscheduled = false;
  var enddate = new Date(sprintenddate);
  var postdate = new Date(recurringstory.schedule_post);
  if( recurringstory.scheduled == "false" || recurringstory.scheduled == undefined){
   return true;
  }
  else{
      if(enddate >= postdate){
         return true;
      }
      else{
         return false;
      }
  }
   return isscheduled
}

function start_sprint_planning()
{
   running_total_logs = [];
   startingstorykey = "";
   var database = firebase.database();
   var ref = database.ref($('#selected_backlog').val()+'/recurring_stories/');

   document.getElementById('end_sprint_planning_button').disabled = true;
   $("#end_sprint_planning_button").css("opacity","0.5");
   document.getElementById('next_button').disabled = true;
   $("#next_button").css("opacity","0.5");
   document.getElementById('skip_button').disabled = true;
   $("#skip_button").css("opacity","0.5");

    $('#sprint_start_date, #sprint_end_date, #sprint_number_input').on('change', function() {
      if($("#sprint_start_date").val() == '' || $("#sprint_end_date").val() == '' || $("#sprint_number_input").val() == '') {
         //console.log('still disable');
         document.getElementById('end_sprint_planning_button').disabled = true;
         $("#end_sprint_planning_button").css("opacity","0.5");
         document.getElementById('next_button').disabled = true;
         $("#next_button").css("opacity","0.5");
         document.getElementById('skip_button').disabled = true;
         $("#skip_button").css("opacity","0.5");
      } else {
         //console.log('enable activated');
         document.getElementById('end_sprint_planning_button').disabled = false;
         $("#end_sprint_planning_button").css("opacity","1");
         document.getElementById('next_button').disabled = false;
         $("#next_button").css("opacity","1");
         document.getElementById('skip_button').disabled = false;
         $("#skip_button").css("opacity","1");
          numTodo=forNumTodo()[0];
         numRecur=forNumTodo()[1];
         number_of_stories_to_be_picked=1;
         check_to_do_story(number_of_stories_to_be_picked,numTodo,numRecur);
      }
    });

   recurring_index = 0;
   // Set up and open Sprint Planning modal.
   var modal = document.getElementById('myModal');

   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];

   // alert('Sprint Planning Foo');
   modal.style.display = "block";

   // When the user clicks on <span> (x), close the modal
   span.onclick = function()
   {
      modal.style.display = "none";
       //location.reload();
       window.location.href = "https://rocketscrum.com/scrumnow.php";
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function(event)
   {
      if (event.target == modal)
      {
         modal.style.display = "none";
          table = $('#stories_table').DataTable();
       data = table.rows().data();
        
      }
     
   }


   $('#estimated_points').on('change', function()
   {
       //console.log("this");
   });

   // Disable previous button since we are at the first story.
   document.getElementById('prev_button').disabled = true;
   $("#prev_button").css("opacity","0.5");

   // Set the selector for estimated points to none.
   document.getElementById('estimated_points').selectedIndex = 0;   

   table = $('#stories_table').DataTable();
   data = table.rows().data();

   //table = $('#recurring_stories_table').DataTable();
   //data = table.rows().data();

   row_index = 0;
   last_row = data.length - 1;

   var sprintnum = document.getElementById('sprint_number_input');
   sprintnum.value = getnextsprintnumber(data);
   // Load and show the first story.
   
   //console.log('start_sprint_planning show_story');
   //show_story(row_index, data);

   //added for checking of points
   document.getElementById('next_button').onclick = function(event)
   {
      //  // Setup vars.
      d1 = $('#sprint_start_date').datepicker().val();
      d2 = $('#sprint_end_date').datepicker().val();
      sprint_num = document.getElementById('sprint_number_input').value;
      points_estimate = document.getElementById('estimated_points').value;
      var error = "";

      if (sprint_num == "")
      {
         error = "Enter the sprint number.<br>";
      }
      else if (d1 == "")
      {
         error = "Please select a start date.<br>";
      }
      else if (d2 == "")
      {
         error = "Please select an end date.<br>";
      }
      else if (!$.isNumeric(points_estimate) || points_estimate <= 0)
      {
         error = "Please select a point estimate for this story.<br>";
      }

      if (error != ""){
         document.getElementById("error_message").innerHTML = error;
         event.preventDefault();
      }
      else
      {
         document.getElementById('error_message').innerHTML = "";
         sprint_planning_next();

          number_of_stories_to_be_picked++;
         check_to_do_story(number_of_stories_to_be_picked,numTodo,numRecur);
      }

   }

   //skip story
   document.getElementById('skip_button').onclick = function(event)
   {
      running_total_logs.push(false);
      document.getElementById('error_message').innerHTML = "";
       var holderIndex=[recurring_index,"recur"];
      if(!display_recurring){
        skip_stories.push(data[row_index]);
        holderIndex=[row_index,"story"];  
      }
      skipped_row_index.push(holderIndex);

      show_next_story();
      update_running_total();
      
      
      number_of_stories_to_be_picked++;
      check_to_do_story(number_of_stories_to_be_picked,numTodo,numRecur);
   }


   //for first story, running total text should change when the dropdown selection is changed
   if (row_index == 0 || row_index == $("#current_row_index").val()) 
   {  
      document.getElementById('estimated_points').onchange=function(event)
      {
         update_running_total();
      }
   }
   update_running_total();
}
//Japs/Johann auto sprint number increment
function getnextsprintnumber(data){
   var currentDate = new Date();
   var day = ("0" + (currentDate.getDate() - 1)).slice(-2);
   var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
   var year = currentDate.getFullYear();
   //var today = month+"/"+day+"/"+year;
   var today = year+"-"+month+"-"+day;
//var last_sprintdate = ("0" + (getsprintdate.getMonth() + 1)).slice(-2) + '/' + ("0" + lastday).slice(-2) + '/' + getsprintdate.getFullYear();
   var last_sprint_date = $('#sprint_date').val();
   console.log(today);
   var highest = 0;
   var highestinprogress = 0;
   for(var index = 0; index < data.length; index++){
      if(highest < parseInt(data[index].sprint_number)){
         highest = parseInt(data[index].sprint_number);
      }
      
   }

   if(highest != 0){
      if(today < last_sprint_date){
         return (parseInt(highest) );
      }else{
          return (parseInt(highest)+ 1);
      }
   }else{
      return (parseInt(highest)+ 1);
   }
}
//end added japs/johann

//Show Next story after clicking Skip button
function show_next_story() {
   //// LOADING THE NEXT STORY BELOW
   if(!display_recurring){
      if(row_index!=last_row)
         row_index += 1;

      if (row_index <= last_row)
      {
         show_story(row_index, data);
         // If we are at the end of the stories don't allow another pull.
         if (row_index == last_row)
         {
            document.getElementById('next_button').disabled = true;
            document.getElementById('skip_button').disabled = true;
            $("#next_button").css("opacity","0.5");
            $("#skip_button").css("opacity","0.5");
         }
         else
         {
            document.getElementById('prev_button').disabled = false;
            document.getElementById('next_button').disabled = false;
            document.getElementById('skip_button').disabled = false;
            $("#next_button").css("opacity","1");
            $("#skip_button").css("opacity","1");
            $("#prev_button").css("opacity","1");
         }
      }
   }else{
      recurring_index += 1;
      show_story(row_index, data);
   }
}

// The next button is clicked on the sprint planning modal dialog.
function sprint_planning_next()
{
   rowindex = $("#current_row_index").val()
   $('#sprint_start_date').datepicker('disable');
   $('#sprint_end_date').datepicker('disable');

   //move_stories(data[row_index]);
    if (document.getElementById('running_total').innerHTML != ""){
      prev_points = parseInt(document.getElementById('running_total').innerHTML);
    } else {
         prev_points = 0;
    }
   //  // Setup vars.
   d1 = $('#sprint_start_date').datepicker().val();
   d2 = $('#sprint_end_date').datepicker().val();
   d1_date_obj = new Date(d1.toString());
   d2_date_obj = new Date(d2.toString());
   sprint_num = parseInt(document.getElementById('sprint_number_input').value);
   points_input = document.getElementById('estimated_points');
   if(data.length>0){
      if(data[row_index].story_points != ""){
         $('#estimated_points option').prop('selected', function() {
            return data[row_index].story_points;
         });
      } else {
         $('#estimated_points option').prop('selected', function() {
            return this.defaultSelected;
         });
      }
   }
   if($("#current_sprint").val() != "" && parseInt($("#current_sprint").val()) > 0 ) {   
    logScrumViolation(data[row_index].key, sprint_num, data[row_index].status, data[row_index].as_a, data[row_index].storyid, data[row_index].i_want, data[row_index].so_that, data[row_index].acceptance_test, data[row_index].story_points, data[row_index].comments);    
  }
   document.getElementById('estimated_points').onchange=function(event)
   {
      update_running_total();
   }
   set_sprint(sprint_num, d1_date_obj, d2_date_obj);
   if(!display_recurring){
      numNext++;
      var min = $('#min_order');
      set_order(min.val(), data[row_index], numNext);
      update_table(row_index, 3, 8, sprint_num, points);
      set_user_story(sprint_num, row_index, points);
      set_user_story_status(row_index);
      data.splice(row_index,1);
      //row_index += 1;
      $("#current_row_index").val(row_index);
   }
   else{
      var min = $('#min_order');
      if(min == ''){
         min.val(0);
      }
      var num = parseInt($('#max_story_id').val()) + 1;
      adjust_order(min.val());
      
      if(recurring_stories[recurring_index].scheduled != "false" && recurring_stories[recurring_index].scheduled != undefined){
         movepostdate(recurring_stories[recurring_index]);  
      }
      save_recurring_to_firebase(parseInt(min.val()),(recurring_stories[recurring_index].storyid + "-" + num),sprint_num,recurring_stories[recurring_index].as_a,recurring_stories[recurring_index].i_want,recurring_stories[recurring_index].so_that,recurring_stories[recurring_index].acceptance_test,points,recurring_stories[recurring_index].comments)
      recurring_stories.splice(recurring_index,1);
      //recurring_index += 1;
      min.val(parseInt(min.val()) + 1);
   }
   //// SETTING THE STORY ON THE SCREEN ABOVE.
   //// LOADING THE NEXT STORY BELOW
   last_row = (last_row < 0) ? 0 : last_row;
   if (row_index <= last_row || recurring_index<=last_row)
   {
      running_total_logs.push(true);
      show_story(row_index, data);
      update_running_total();
      // If we are at the end of the stories don't allow another pull.
      if (row_index == last_row)
      {
         document.getElementById('next_button').disabled = true;
         document.getElementById('skip_button').disabled = true;
         $("#next_button").css("opacity","0.5");
         $("#skip_button").css("opacity","0.5");
      }
      else
      {
         document.getElementById('prev_button').disabled = false;
         document.getElementById('next_button').disabled = false;
         document.getElementById('skip_button').disabled = false;
         $("#next_button").css("opacity","1");
         $("#skip_button").css("opacity","1");
         $("#prev_button").css("opacity","1");
      }
   }

}

function sprint_planning_previous()
{  var rowindex = $("#current_row_index").val();
   if(points != "-- estimated points --" && sprint_num != ""){
         //update_table(row_index, 3, 8, sprint_num, points);
          rowindex = $("#current_row_index").val();
         //update_table(rowindex, 3, 8, sprint_num, points);
      }
 //  if(startingstorykey != data[rowindex].key){
      //console.log("move in previous planning");
      d1 = $('#sprint_start_date').datepicker().val();
      d2 = $('#sprint_end_date').datepicker().val();
      d1_date_obj = new Date(d1.toString());
      d2_date_obj = new Date(d2.toString());
      //sprint_num = document.getElementById('sprint_number_input').value;
      points_input = document.getElementById('estimated_points');
      points = points_input.options[points_input.selectedIndex].text;

      //set_sprint(sprint_num, d1_date_obj, d2_date_obj);
      //set running points when click the previous button
      var runningtotal = document.getElementById('running_total').innerHTML;
      if(parseInt(runningtotal)) {
         if(parseInt(prev_points)) {
            document.getElementById('running_total').innerHTML = prev_points;
         } 
      }
      //document.getElementById('running_total').innerHTML = prev_points
      if(skipped_row_index[skipped_row_index.length-1][1] == "recur")
         display_recurring=true;
      var sprin_num_previous = "";
      //// SETTING THE STORY ON THE SCREEN ABOVE.
      //// LOADING THE NEXT STORY BELOW
      //if(data[row_index -1].status != "in progress" || isSprintStart != false){
          if(!display_recurring){

          //row_index -= 1;
            row_index=skipped_row_index[skipped_row_index.length-1][0];
          //set_user_story_default(sprin_num_previous, row_index, points);
          //data[row_index].status="";
          $("#current_row_index").val(row_index);
            if (row_index >= 0)  
            {
               //console.log("sprint_planning_previous show_story");
               console.log(data[row_index].status);
               if(ispreviouspoints != false){
                  prev_points -= parseInt(data[row_index].story_points);
               } 

                     ispreviouspoints = true;
                  show_story(row_index, data, true);
               skipped_row_index.splice(skipped_row_index.length-1,1);
               //update running points when clicked previous button

               // If we are at the end of the stories don't allow another pull.
               /*if (row_index == 0)
               {
                  document.getElementById('prev_button').disabled = true;
                  $("#prev_button").css("opacity","0.5");
               }
               else
               {
                  document.getElementById('prev_button').disabled = false;
                  document.getElementById('next_button').disabled = false;
                  document.getElementById('skip_button').disabled = false;
                  $("#next_button").css("opacity","1");    
                  $("#skip_button").css("opacity","1");     
                  $("#prev_button").css("opacity","1");
               }*/
            }
         }
         else{
            //recurring_index -= 1;
            recurring_index=skipped_row_index[skipped_row_index.length-1][0];
               show_story(row_index, data);
               skipped_row_index.splice(skipped_row_index.length-1,1);
              /*if (recurring_index == 0)
               {
                  document.getElementById('prev_button').disabled = true;
                  $("#prev_button").css("opacity","0.5");
               }
               else
               {
                  document.getElementById('prev_button').disabled = false;
                  document.getElementById('next_button').disabled = false;
                  document.getElementById('skip_button').disabled = false;
                   $("#next_button").css("opacity","1");    
                  $("#skip_button").css("opacity","1");     
                  $("#prev_button").css("opacity","1");
               }*/
         }

   //}
    number_of_stories_to_be_picked--;
   check_to_do_story(number_of_stories_to_be_picked,numTodo,numRecur);
   //}
}

function end_sprint_planning()
{
   d1 = $('#sprint_start_date').datepicker().val();
   d2 = $('#sprint_end_date').datepicker().val();
   d1_date_obj = new Date(d1.toString());
   d2_date_obj = new Date(d2.toString());
   sprint_num = parseInt(document.getElementById('sprint_number_input').value);
   points_input = document.getElementById('estimated_points');

   if(points_input.selectedIndex >= 0) {
      points = points_input.options[points_input.selectedIndex].text;
   }
   set_sprint(sprint_num, d1_date_obj, d2_date_obj);
   if(!display_recurring){
      var min = $('#min_order');
      numNext++;
      set_order(min.val(), data[row_index], numNext);
      if(parseInt(points)) {
         update_table(row_index, 3, 8, sprint_num, points);
         set_user_story(sprint_num, row_index, points);
         set_user_story_status(row_index);
         if($("#current_sprint").val() != "" && parseInt($("#current_sprint").val()) > 0 ) {
            logScrumViolation(data[row_index].key, sprint_num, data[row_index].status, data[row_index].as_a, data[row_index].storyid, data[row_index].i_want, data[row_index].so_that, data[row_index].acceptance_test, data[row_index].story_points, data[row_index].comments);
         }
       }
   }
   else{
      var min = $('#min_order');
      if(min == ''){
         min.val(0);
      }
      var num = parseInt($('#max_story_id').val()) + 1;
      adjust_order(min.val());
      if(recurring_stories[recurring_index].scheduled != "false" && recurring_stories[recurring_index].scheduled != undefined){
         movepostdate(recurring_stories[recurring_index]);  
      }
      save_recurring_to_firebase(parseInt(min.val()),(recurring_stories[recurring_index].storyid + "-" + num),sprint_num,recurring_stories[recurring_index].as_a,recurring_stories[recurring_index].i_want,recurring_stories[recurring_index].so_that,recurring_stories[recurring_index].acceptance_test,points,recurring_stories[recurring_index].comments)
      recurring_index += 1;
      min.val(parseInt(min.val()) + 1);
   }

   // Close the Sprint Planning modal window.
   var modal2 = document.getElementById('myModal');
   isSprintStart = false;
   modal2.style.display = "none";
   //move_stories(data[row_index],true);
   //location.reload();
   window.location.href = "https://rocketscrum.com/scrumnow.php";
   
}

function logScrumViolation(key, sprint_number, status, as_a, storyid, i_want, so_that, acceptance_test, story_points, comments) {
   // Update firebase with the edited info.
   var new_cnt = 0;
   var new_arr = [];
                
   database.ref($('#selected_backlog').val()+ '/user_stories/' + key).once('value').then(function(snapshot) {
      var remarks = "";
      var delimiter  = "";
      var member = "";

      if($("#user_role").val().indexOf("Product Owner") < 0) {
         if($("#user_role").val() == "") {
            member = "Team Member";
         } else {
            member = $("#user_role").val();
         }
         remarks = "Member with Scrum Role " + member + " made the changes.";
      }

      if(parseInt(sprint_number) && (status == "in progress" || status == "to do" || status == "")) {
         if(remarks != "") {
            delimiter = " ; ";
         }
         remarks += delimiter + "This story has been added and sprint has already started. ";
      }

      new_arr.push({
         story: storyid,
         sprint_number: sprint_number,
         added_by: firebase.auth().currentUser.email,
         remarks: remarks
      });
      if(new_arr.length > 0) {
         $.ajax({
             type: "POST",
             url: "src/log.php",
             data: {data : new_arr, backlog_path: $("#selected_backlog").val()},
             success: function(result){
                 //console.log("logged: " + result);
             }
         });
      }
   });
}


function load_data(){
      var recurring = [];
      var database = firebase.database();
      var ref = database.ref($('#selected_backlog').val()+'/recurring_stories/');
      ref.once('value').then(function(snapshot) {
           snapshot.forEach(function(childSnapshot) {
               var key = childSnapshot.key;
               var child_data = childSnapshot.val();
                   //0331207 - get only active stories
                   var tmp_user_story = new recurring_story(
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
                       child_data.date_schedule,
                       child_data.schedule_post,
                       child_data.scheduled,
                       child_data.set_recurring, 
                       child_data.number_added);
                    recurring.push(tmp_user_story);
           });
          recurring_stories = recurring;
      });

    }
function remove_data_recurring(){
 d2 = $('#sprint_end_date').datepicker().val();
 for(var xRecur=0;xRecur<recurring_stories.length; xRecur++){
    if(!checkSRecurringschedule(d2, recurring_stories[xRecur])){
       recurring_stories.splice(xRecur,1);
       xRecur--;
    }
 }
}
function save_recurring_to_firebase(order,storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
{
  var database = firebase.database();
  var tmp_key = database.ref($('#selected_backlog').val()+ '/user_stories/').push().key;

   database.ref($('#selected_backlog').val()+ '/user_stories/' + tmp_key).set(
   {
      order:order,
      key: tmp_key,
      storyid: storyid_var,
      sprint_number: sprint_number_var,
      as_a: as_a_var,
      i_want: i_want_var,
      so_that: so_that_var,
      acceptance_test: acceptance_test_var,
      story_points: story_points_var,
      comments: comments_var,
      status: "in progress",
      edit_del:" ",
      is_recurring: "true"
   });

   return tmp_key;
}

function adjust_order(order){
var recurring = [];
      var database = firebase.database();
      var ref = database.ref($('#selected_backlog').val()+ '/user_stories/');
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
                     if(order < parseInt(child_data.order) && child_data.is_recurring != "true"){
                        update_order(key,child_data.order);
                     }
           });

          
      });
      var max_id = $('#max_story_id');
      update_max_order(max_id.val());

}

function update_order(key, order)
{
   
   database.ref($('#selected_backlog').val()+ '/user_stories/' + key).update(
   {
      order: (parseInt(order) + 1)
   });
   adjust_data_order(key,order + 1);
}

function update_max_order(max)
{
   $('#max_story_id').val(parseInt(max) + 1);
   database.ref($('#selected_backlog').val() + '/max').update(
   {
      storyid: (parseInt(max) + 1)
   });
}

function update_running_total(){
   var points_input = document.getElementById('estimated_points');
      if(points_input.options[points_input.selectedIndex] != undefined){
         points = parseInt(points_input.options[points_input.selectedIndex].value);
      }
      else{
      points = 0;
      }
      if(isNaN(points)){
         points = 0;
      }
       if(ispreviouspoints != false && running_total_logs[running_total_logs.length - 1] == false){
         running_total_logs.pop();
         sprint_point_total = prev_points + points;

      }
      else if(ispreviouspoints != false ){
         running_total_logs.pop();
         sprint_point_total = prev_points;
          prev_points = prev_points - points;
         
      }
      else{
         sprint_point_total = prev_points + points;
      }
      ispreviouspoints = false;
      
      document.getElementById('running_total').innerHTML = sprint_point_total;

      
      var pointsdefinition;
      var database = firebase.database();
      var pointsdef = database.ref('points_desc');

      pointsdef.once('value').then(function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                  var key = childSnapshot.key;
                  var child_data = childSnapshot.val();
                      if(child_data.points == points) {
                          pointsdefinition = child_data.description;
                      }  
              });

               document.getElementById('points_definition').innerHTML = pointsdefinition;
      });
}

function move_stories(current_story, isendsprint = false){
   for (var index = 0; index < skip_stories.length; index++){
      if(index == 0){
         skipped_update_order(skip_stories[index].order,current_story.key);
      }
      if(index != (skip_stories.length - 1)){
         skipped_update_order(skip_stories[index + 1].order,skip_stories[index].key);
         skip_stories[index].order = skip_stories[index + 1].order;
      }
      if(index == (skip_stories.length - 1)){
         skipped_update_order(current_story.order,skip_stories[index].key, true, isendsprint);
         skip_stories[index].order = current_story.order;
      }
   }

   if(skip_stories.length == 0 && isendsprint){
      location.reload();
   }
}

function skipped_update_order(neworder,story_key,islast = false, isendsprint = false){
   var order_update = database.ref( $('#selected_backlog').val()+ '/user_stories/' + story_key);
   order_update.on('value', function(snap) {
      if(islast && isendsprint){
         location.reload();
      }
   });
   order_update.update(
   {
      order: neworder
   });
}

function adjust_data_order(key,neworder){
   for (index = 0;index < data.length;index++){
      if(key == data[index].key){
            data[index].order = neworder;
            return
      }
   }
}

function movepostdate(recurringstory){
   if(recurringstory.number_added == undefined){
      recurringstory.number_added = 1;
   }
   if(recurringstory.set_recurring == "weekly"){
        var olddate = new Date(recurringstory.schedule_post);
        var newdate = olddate.getDate() + 7
        var multi = parseInt(recurringstory.number_added);
        var olddate = new Date(recurringstory.schedule_post);
       var enddate = new Date(olddate);
       enddate.setDate(olddate.getDate() + (multi * 7) );
       console.log(enddate);
       var str = enddate.toInputFormat();
       database.ref($('#selected_backlog').val() + '/recurring_stories/' + recurringstory.key).update(
         {
            schedule_post: str
         });
    }
    else if(recurringstory.set_recurring == "monthly"){
      var olddate = new Date(recurringstory.schedule_post);
        var newdate = olddate.getDate() + 7
        var multi = parseInt(recurringstory.number_added);
        var olddate = new Date(recurringstory.schedule_post);
       var enddate = new Date(olddate);
       enddate.setDate(olddate.getDate() + (multi * 30) );
       console.log(enddate);
       var str = enddate.toInputFormat();
       database.ref($('#selected_backlog').val() + '/recurring_stories/' + recurringstory.key).update(
         {
            schedule_post: str
         });
            
    }
    else if(recurringstory.set_recurring == "yearly"){
      
        var multi = parseInt(recurringstory.number_added);
        var olddate = new Date(recurringstory.schedule_post);
       var enddate = new Date(olddate);
       enddate.setDate(olddate.getDate() + (multi * 365) );
       
       var str = enddate.toInputFormat();
       database.ref($('#selected_backlog').val() + '/recurring_stories/' + recurringstory.key).update(
         {
            schedule_post: str
         });
        
    }
}
   Date.prototype.toInputFormat = function() {
       var yyyy = this.getFullYear().toString();
       var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
       var dd  = this.getDate().toString();
       return   (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]) + "/" + yyyy; // padding
    };

function check_to_do_story(row_index1,num_to_do, num_recur){
   if(skipped_row_index.length==0){
      document.getElementById('prev_button').disabled = true;
      $("#prev_button").css("opacity","0.5");
   }
   else{
      document.getElementById('prev_button').disabled = false;
      $("#prev_button").css("opacity","1");
   }
   if(num_to_do==row_index1){
      document.getElementById('next_button').disabled = true;
      $("#next_button").css("opacity","0.5");
      document.getElementById('skip_button').disabled = true;
      $("#skip_button").css("opacity","0.5");
   }
   else{
      document.getElementById('next_button').disabled = false;
      $("#next_button").css("opacity","1");
      document.getElementById('skip_button').disabled = false;
      $("#skip_button").css("opacity","1");
   }
}
function forNumTodo(){
   var numTodo1=0;
   var numRecur1=0;
   var arrTodoRecur=[];
    var database = firebase.database();
    database.ref($('#selected_backlog').val()+ '/user_stories/').once("value", function(snapshot){
      snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
               if(child_data.status=="to do" || child_data.status=="")
                  numTodo1++;
        });
   });
   var enddate_planning= $('#sprint_end_date').datepicker().val();
   var enddate = new Date(enddate_planning);
   for (var x=0; x<recurring_stories.length; x++){
      var postdate = new Date(recurring_stories[x].schedule_post);
      if( recurring_stories[x].scheduled == "false" || recurring_stories[x].scheduled == undefined){
         numRecur1++;
      }
      else{
         if(enddate >= postdate){
            numRecur1++;
         }
      }
   }
   numTodo1+=numRecur1;
   arrTodoRecur.push(numTodo1);
   arrTodoRecur.push(numRecur1);

   return arrTodoRecur;
}
function set_order(min_ordernum, data_row_index, numNextToAdd){
  var old_order_holder=data_row_index.order;
  var new_order=null;
  min_ordernum=parseInt(min_ordernum)+numNextToAdd;
  var ref = database.ref($('#selected_backlog').val()+ '/user_stories/');
  ref.once('value').then(function(snapshot) {
       snapshot.forEach(function(childSnapshot) {
           var key = childSnapshot.key;
           var child_data = childSnapshot.val();
           new_order=parseInt(child_data.order);
           if(new_order>=min_ordernum && old_order_holder > new_order){
            set_update_order(key, parseInt(child_data.order) + 1);
            for(var x=0; x<data.length; x++){
              if(key==data[x].key){
                data[x].order=parseInt(child_data.order) + 1;
              }
            }
           }
      });
  });
  set_update_order(data_row_index.key,min_ordernum);
}
function set_update_order(key, ordernum){
  var database = firebase.database();
  database.ref($('#selected_backlog').val()+ '/user_stories/' + key).update(
   {
      order: (parseInt(ordernum))
   });
}