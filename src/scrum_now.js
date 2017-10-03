// Firebase variables to point to the database, a reference, and provider for auth.
var database = firebase.database();
var ref = database.ref('user_stories/');
var maxref = database.ref('max');
var userref = database.ref('user');
var backlog_title ;
var backlog_key;
//PJ/Benjoe 04102017 - Retrieving version of css
var v_controller = database.ref('controller');
var provider = new firebase.auth.GoogleAuthProvider();
var results = [];
var table;
var editor;
var user_name;
var permitted;
var drag;
var backlog_dropdown;
var copy_backlog;
var show_active_stories; 
var scrollposition=0;
var donehide = false;
var issprintplanning = false;
var dragging = false;
var isinprogress = "";
var allselected;
var preventdrag = false;
var missingpoints = false;
var stopload = false;
var i=0;
var storedkey=[];
var storedacceptance=[];
var story_done=[];


//03312017 - array variable for trashed stories
var resultstrashed = [];

// Since we are using Firebase as a backend we need to initialize the
// datatable using the localStore option and use Ajax option and build our
// output as a JSON. This is used for the 'create' button. So when we
// create using the datatables create form we save to firebase, get the
// key firebase gives us and then save to then create a new user story_points
// object and push that onto the output object array and then return that
// to the datatables calling so it displays correctly in the table.
var localStore = function(method, url, d, successCallback, errorCallback)
{

    var output = {
        data: []
    };

    var new_key;
    var new_order = d.data.length + 1;
    var new_story;
    var row_data = d.data;
    var row_key = Object.keys(row_data);

    var max = 0;
    var version = 0;
    $("#stories_table").find("tr[data-order]").each(function () {
        if($(this).data('order') > max) {
            max = $(this).data('order');
        }
    });

    $("#stories_table").find("tr[data-order]").each(function () {
        if($(this).data('order') > max) {
            max = $(this).data('order');
        }
    });

    var storyidmax = 0;
    $("#stories_table").find("tr[storyid]").each(function () {
        if($(this).attr('storyid') > storyidmax) {
            storyidmax = $(this).attr('storyid');
        }
    });

    if (d.action === 'create')
    {
        var maxref = database.ref($('#selected_backlog').val()+ '/max');
        maxref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var child_data = childSnapshot.val();
                storyid = parseInt(child_data); 
                $("#max_story_id").val(storyid);

        var a = d;
        var order = parseInt(max) + 1;
        storyid = parseInt($('#max_story_id').val()) + 1;
        
        new_key = save_to_firebase(storyid, row_data[0].sprint_number, row_data[0].as_a, row_data[0].i_want,
            row_data[0].so_that, row_data[0].acceptance_test, row_data[0].story_points, row_data[0].comments, storyid);

        new_story = new user_story(storyid, new_key, storyid, row_data[0].sprint_number, row_data[0].as_a, row_data[0].i_want,
            row_data[0].so_that, row_data[0].acceptance_test, row_data[0].story_points, row_data[0].comments, row_data[0].status, "<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>");

        total_story_count = save_max_count(storyid);
        output.data.push(new_story);
        $('#max_story_id').val(storyid);

        var member = "";
        var remarks = "";
        var changed_arr = [];
        
        var createdSh="Member with Scrum Role Stakeholder created the story " + storyid + ".";      
        createdSh=($("#user_role").val()=="Stakeholder") ? createdSh : "";      
        save_scrum_violation(createdSh, '','', storyid, "Create");

        setTimeout(function() {
            $('#stories_table tbody tr:first-child').click();
        }, 1000);

        preventdrag = true;
        checkpoints(table);
                });
            });
    }
    else if (d.action === 'edit')
    {
        var newbacklogkey = $("#edit_select_backlog").val();
        var newbacklogkey_copy = $("#makeCopy").val();
        //Move todo to bottom Benjoe
        var maxref = database.ref($('#selected_backlog').val()+ '/max');
        var maxx = parseInt($("#max_story_id").val()) + 1;
        var editor_status = $('#DTE_Field_status').val();

        //scrumviolation        
        var createdSh="Member with Scrum Role Stakeholder made the changes.";       
        createdSh=($("#user_role").val()=="Stakeholder") ? createdSh : "";      
        save_scrum_violation(createdSh, row_data[row_key], row_key, '', 'Edit');

        maxref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var child_data = childSnapshot.val();
                storyid = parseInt(child_data); 
                $("#max_story_id").val(storyid);
            });
        });

        if(editor_status == "to do" && isinprogress) {
            
            
            database.ref( backlog_key + '/user_stories/' + row_key).update(
            {
                status: 'to do',
                sprint_number: '',
                order: maxx
            });

            database.ref( backlog_key + '/max/').update(
            {

                storyid: maxx
            });

            location.reload();
        }

        var my_tmp_story_2;

        my_tmp_story_2 = new user_story(row_data[row_key].order, row_key, row_data[row_key].storyid, row_data[row_key].sprint_number,
            row_data[row_key].as_a, row_data[row_key].i_want, row_data[row_key].so_that, row_data[row_key].acceptance_test,
            row_data[row_key].story_points, row_data[row_key].comments, row_data[row_key].status, "<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>");

        output.data.push(my_tmp_story_2);

        // Unselect row.
        table.row('.selected').remove().draw(false);

        // Update firebase with the edited info.  
        
        // Update firebase with the edited info.

        if((backlog_key == newbacklogkey && backlog_key == newbacklogkey_copy)  || ((!$('#chkbox_changebacklog').prop('checked')) && (!$('#chkbox_copyBox').prop('checked')) ) || ($('#chkbox_changebacklog') == undefined) || ($('#chkbox_copyBox') == undefined)) {
            database.ref( backlog_key + '/user_stories/' + row_key).update(
            {
                storyid: row_data[row_key].storyid,
                //sprint_number: row_data[row_key].sprint_number,
                as_a: row_data[row_key].as_a,
                i_want: row_data[row_key].i_want,
                so_that: row_data[row_key].so_that,
                acceptance_test: row_data[row_key].acceptance_test,
                story_points: row_data[row_key].story_points,
                comments: row_data[row_key].comments,
                status: row_data[row_key].status,
                edit_del: "<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>"
            });
        }
        else if(($('#chkbox_copyBox').prop('checked')) || ($('#chkbox_copyBox') == undefined)){
            var maxref = database.ref(newbacklogkey_copy+ '/max');
           var newstoryid;                   
            maxref.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var child_data = childSnapshot.val();
                        storyid = parseInt(child_data);
                        if(storyid != ""){
                            newstoryid =  parseInt(storyid);
                        }else{
                            newstoryid = 0;
                        }
                        newstoryid ++;
                        
                        var tmp_key = database.ref(newbacklogkey_copy +  '/user_stories/').push().key;
                        var rowCount = $('#stories_table tr').length;
                        //var rowCount = $('#stories_table tbody tr').length;
                        

                        database.ref(newbacklogkey_copy + '/user_stories/' + tmp_key).set(
                        {
                           order: newstoryid,//need to get from the other backlog
                           key: tmp_key,
                           storyid: newstoryid,
                           sprint_number: "",
                           as_a: row_data[row_key].as_a,
                           i_want: row_data[row_key].i_want,
                           so_that: row_data[row_key].so_that,
                           acceptance_test: row_data[row_key].acceptance_test,
                           story_points: row_data[row_key].story_points,
                           comments: row_data[row_key].comments,
                           status: "",
                           edit_del:"<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>",
                          
                        });
                        database.ref( newbacklogkey_copy + '/max/').update(
                        {
                            storyid: newstoryid
                        });
                       
                        show_active_stories(true);

                    });
                },
                function(error) {
                    console.log("Error: " + error.code);
                });
                   
        }
        else{
         var maxref = database.ref(newbacklogkey+ '/max');
           var newstoryid;                   
            maxref.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var child_data = childSnapshot.val();
                        storyid = parseInt(child_data);
                        if(storyid != ""){
                            newstoryid =  parseInt(storyid);
                        }else{
                            newstoryid = 0;
                        }
                        newstoryid ++;
                        
                        var tmp_key = database.ref(newbacklogkey +  '/user_stories/').push().key;
                        var rowCount = $('#stories_table tr').length;
                        //var rowCount = $('#stories_table tbody tr').length;
                        

                        database.ref(newbacklogkey + '/user_stories/' + tmp_key).set(
                        {
                           order: newstoryid,//need to get from the other backlog
                           key: tmp_key,
                           storyid: newstoryid,
                           sprint_number: "",
                           as_a: row_data[row_key].as_a,
                           i_want: row_data[row_key].i_want,
                           so_that: row_data[row_key].so_that,
                           acceptance_test: row_data[row_key].acceptance_test,
                           story_points: row_data[row_key].story_points,
                           comments: row_data[row_key].comments,
                           status: "",
                           edit_del:"<a class='edit_link' href='#'>Edit</a>/<a class='remove_link' href='#'>Delete</a>",
                          
                        });
                        database.ref( newbacklogkey + '/max/').update(
                        {
                            storyid: newstoryid
                        });
                        database.ref( backlog_key + '/user_stories/' + row_key).remove();
                        show_active_stories(true);

                    });
                },
                function(error) {
                    console.log("Error: " + error.code);
                });

                if($(".selectstatus") == undefined){
               
                var selectedstatus = $(".selectstatus").options[$(".selectstatus").selectedIndex].text;

        if ($(".selectstatus").options[$(".selectstatus").selectedIndex].value == "in progress")
        {
            $($(".selectstatus")).closest('tr').css('background','#FFFF00');
        }
        else if ($(".selectstatus").options[$(".selectstatus").selectedIndex].value == "done")
        {
            $($(".selectstatus")).closest('tr').css('background','#90EE90');
        }
        else if ($(".selectstatus").options[$(".selectstatus").selectedIndex].value == "to do")
        {
            $($(".selectstatus")).closest('tr').css('background','#FFFFFF');
        } 

            //closest
            var closesttd = $($(".selectstatus")).closest('td');
            var closesttr = closesttd.closest('tr');
            var nexttd = closesttr.children('td').first();
            var key = nexttd.html();

            if(key != "" && key !== undefined) {
                // Update firebase with the edited info.
                database.ref(backlog_key + '/user_stories/' + key).update(
                {
                    status: selectedstatus

                });
            }
            }          
        }
        

         var walkthrough_link = $('#DTE_Field_walkthrough').val();
        if (walkthrough_link == ""){
            var sprintsnum = "sprint" + row_data[row_key].sprint_number;
            database.ref(backlog_key + '/sprints/' + sprintsnum).update({
                walkthrough: ""
            });
        }else if(( row_data[row_key].status == "done" && walkthrough_link != "") || (row_data[row_key].status == "in progress" && walkthrough_link != "") ) {
            var sprintsnum = "sprint" + row_data[row_key].sprint_number;
            database.ref(backlog_key + '/sprints/' + sprintsnum).update({
                walkthrough: walkthrough_link
            });
        }
            setTimeout(function() {
                $('#stories_table tbody tr:first-child').click();
            }, 1000);

            preventdrag = true;
            if((row_data[row_key].story_points)!=""){
                missingpoints = false;
            }else{
                missingpoints = true;
            }
            
    }
    
    else if (d.action === 'remove')
    {
        remove_from_firebase(row_key, row_data[row_key].status, row_data[row_key].order, row_data[row_key].storyid);
        load_data();        
        location.reload();
    }

    // Show Editor what has changed
    successCallback(output);

    checkpoints(table);
};


$('td').tooltip( {
    "delay": 0,
    "track": true,
    "fade": 250
    } );

// Once the document has loaded to 'ready' state, then perform all the work.
$(document).ready(function() {


           
    //versioning
    
   /* v_controller.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var child_data = childSnapshot.val();
                version = parseInt(child_data); 
                var restyled = "css/my_styles.css?v="+version;
                var recurringcss = "css/recurring_stories.css?v="+version;
                var scenarioscss = "css/scenarios.css?v="+version;
                var backlogcss = "css/backlog_status.css?v="+version;
                var misc = "src/misc.js?v="+version;
                var global_vars = "src/global_vars.js?v="+version;
                var sprint_plannings = "src/sprint_planning.js?v="+version;
                var sprint_info = "src/sprint_info.js?v="+version;
                var datatables = "js/dataTables.editor.js?v="+version;
                var editor = "css/editor.dataTables.css?v="+version;
                var scrum_now = "js/scrum_now.js?v="+version;

                freshStyle(restyled, recurringcss, scenarioscss, backlogcss, misc, global_vars, sprint_plannings, sprint_info, datatables, editor, scrum_now);
                $("#current_version").val(version);
            });
        },
        function(error) {
            console.log("Error: " + error.code);
        });*/
    
    
    //$("#loading-container").css("display", "block").css("margin-top", "100px");
    firebase.auth().onAuthStateChanged(function(user)
    {
        if (user)
        {
          user_name = user.displayName;
            //document.getElementById('rs-top-header').innerHTML = "<span style='padding-right:5px' class='rs-welcome-logout'>Welcome, <b>" + user_name + '!</b> ' + '<div class="dropdown" style="display:inline;"><a href="#"><img class="showDropdown" src="images/gear_icon.png" height="13px"><div id="myDropdown" class="dropdown-content" style="display:none; background-color:#ccc; text-align:right; padding-top: 1px; padding-bottom: 1px; padding-right: 11px;"><ul style="list-style-type:none;"><li><a href="/rocketscrum/settings.php">Settings</a></li><li><a href="#" onclick=\"googleSignout()\">Google Signout</a></li></ul></div></div></span>';


            userref.once('value').then(function(snapshot) {
               
                var cnt = 0;
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var child_data = childSnapshot.val();
                    
                    if(firebase.auth().currentUser != null) {
                        if(child_data.email == firebase.auth().currentUser.email) {
                            cnt++;
                            $("#user_key").val(key);
                            $("#user_role").val(child_data.userrole);

                            //added 05022017 - check hide done settings
                            if(child_data.hide_done == 1) {
                                
                                 donehide = true;
                                setTimeout(function()
                                {
                                    
                                    $(document).ready(function(){
                                       

                                        // 
                                    });
                                   
                                    //DataTable functions removed            
                                }, 1000);
                            }
                        } 
                    }
                });

                if(cnt == 0) {
                    //save_user_to_firebase(user_name,firebase.auth().currentUser.email,firebase.auth().currentUser.uid);
                }
            });


        }
        else
        {
            //Test Firebase
            //window.location.href = "https://foo74-68342.firebaseapp.com";
            //Portal Firebase
            //window.location.href = "https://rocketscrum.firebaseapp.com";
            //window.location.href = "/rocketscrum/";
        }

    });

    //04192017 user info on load
    userref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
            
            if(firebase.auth().currentUser != null) {
                if(child_data.email == firebase.auth().currentUser.email) {
                    $("#user_key").val(key);
                    $("#user_role").val(child_data.userrole);
                    getselectedbacklog();
                }
            } else {
                $('#circularG').css('display','none');
                $('.remove_access').css('display','block');
                $('.remove_access').css('transform', 'translateY(165px)');
                return true;
            }
        });
    });

    /*on load checkbox checked*/
    $('#stories_table').on( 'change', 'input.editor-active', function () {
        editor
            .set( '#checkboxId', $(this).prop( 'checked' ) ? 1 : 0 )
            .submit();
    } );
    
    editor = new $.fn.dataTable.Editor(
    {
        table: '#stories_table',
        idSrc: 'key',
        // Set the form options, focus on field 1. The first field is
        // Order and is at index 0 but it is hidden.
        formOptions:
        {
            main:
            {
                focus: 2,
            }
        },
        fields: [
        {
            name: "order",
            type: "hidden"
        },
        {
            label: "Sprint #:",
            name: "sprint_number",
            type: "hidden"
        },
        {
            label: "As a...:",
            name: "as_a"
        },
        {
            label: "I want...:",
            name: "i_want",
            type: "textarea",
            attr: { placeholder: "Test"}
        },
        {
            label: "So that...:",
            name: "so_that"
        },
        {
            label: "Acceptance Test:",
            name: "acceptance_test",
            type: "textarea"
        },
        {
            label: "Story Points:",
            name: "story_points",
            type: "select",
            options:[
            { label: "-- Estimate Points --", value: "", disabled:true},
            { label: "1", value: "1"},
            { label: "2", value: "2"},
            { label: "3", value: "3"},
            { label: "5", value: "5"},
            { label: "8", value: "8"},
            { label: "13", value: "13"},
            { label: "21", value: "21"},
            { label: "34", value: "34"},
            { label: "55", value: "55"},
            { label: "89", value: "89"},
            { label: "144", value: "144"},
            ]
        },
        {
            label: "Comments:",
            name: "comments",
            type: "textarea"
        },
        {
            label: "Status:",
            name: "status",
            type: "select",
            options: [ 
            { label: "to do", value: "to do"},
            { label: "in progress", value: "in progress" },
            { label: "done", value: "done" }

            ]
        },
        {
            label: "Story ID:",
            name: "storyid",
            type: "hidden"
        },
        {
            label: "Walkthrough Link:",
            name: "walkthrough"
        }
       
        ],
        ajax: localStore

    });

    

    // Added for client-side validation
    editor.on( 'preSubmit', function ( e, o, action ) {
        if ( action !== 'remove' ) {
            var asA = editor.field( 'as_a' );
            var iWant = editor.field( 'i_want' );
            var soThat = editor.field( 'so_that' );
            var acceptanceTest = editor.field( 'acceptance_test' );
            var storyPoints = editor.field( 'story_points' );
            
            // Only validate user input values - different values indicate that
            // the end user has not entered a value
            if ( ! asA.isMultiValue() ) {
                if ( ! asA.val() ) {
                    asA.error( 'As a... field is required' );
                }
            }
            if ( ! iWant.isMultiValue() ) {
                if ( ! iWant.val() ) {
                    iWant.error( 'I want... field is required' );
                }
            }
            if ( ! soThat.isMultiValue() ) {
                if ( ! soThat.val() ) {
                    soThat.error( 'So that... field is required' );
                }
            }
            if ( ! acceptanceTest.isMultiValue() ) {
                if ( ! acceptanceTest.val() ) {
                    acceptanceTest.error( 'Acceptance Test... field is required' );
                }
            }
            if(action != 'create') {
                if(!parseInt(storyPoints.val())&&storyPoints.val()!="") {
                    storyPoints.error( 'Story Points should be a number' );
                }
            }
           
            // ... additional validation rules
 
            // If any error was reported, cancel the submission so it can be corrected
            if ( this.inError() ) {
                return false;
            }
        }
    } );

    // Hide the 'order' field from the create and edit forms
    // since the order is set by a time stamp with entropy
    // then dragged and dropped to re-order.
    // editor.field('order').hide();

    



    

        function freshStyle(restyled,recurringcss,scenarioscss, backlogcss, misc, global_vars, sprint_plannings, sprint_info, datatables, editor, scrum_now){
       $('#mystyle').attr('href',restyled);
       $('#recurringstyle').attr('href',recurringcss);
       $('#scenariostyle').attr('href',scenarioscss);
       $('#backlogstatusstyle').attr('href',backlogcss);
       $('#misc').attr('src',misc);
       $('#global_vars').attr('src',global_vars);
       $('#sprint_plannings').attr('src',sprint_plannings);
       $('#sprint_info').attr('src',sprint_info);
       $('#datatables').attr('src',datatables);
       $('#editor').attr('href',editor);
       $('#datatables').attr('src',datatables);
       $('#scrum_now').attr('src',scrum_now);
    }


    
    
    //load_data();
function getselectedbacklog(){
   
        var ref = database.ref( 'user/' + $('#user_key').val() + '/selected_backlogs/');
        var user_permission = "";
        var user_permissions;

        userref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var child_data = childSnapshot.val();
                    
                if(firebase.auth().currentUser != null) {
                    if(child_data.email == firebase.auth().currentUser.email) {
                        user_permission = child_data.permittedbacklog;
                        if(user_permission == "" || user_permission === undefined) {

                            //get team
                            var isteammember = false;
                            var permittedbacklogs = "";

                            var teamsref = database.ref('teams');
                            teamsref.once('value').then(function(snapshot1) {
                                snapshot1.forEach(function(childSnapshot1) {
                                    var teamkey = childSnapshot1.key;
                                    var child_data1 = childSnapshot1.val();

                                    var backlogkey = child_data1.backlogs;

                                    var membersref = database.ref('teams/' + teamkey + "/members");
                                    membersref.once('value').then(function(snapshot2) {
                                        snapshot2.forEach(function(childSnapshot2) {
                                            var key2 = childSnapshot2.key;
                                            var val2 = childSnapshot2.val();
                                            if(val2 == key) {
                                                isteammember = true;
                                                if(permittedbacklogs == "") {
                                                    permittedbacklogs = backlogkey;
                                                } else {
                                                    permittedbacklogs += "," + backlogkey;  
                                                }

                                                access = permittedbacklogs;

                                                if(access != "") {
                                                    $('#main-loading-container').css('display','none');
                                                    $('#main_screen').css('display','block');
                                                    $('#no_backlog').css('display','none');
                                                    $('.dashboard_can_access').css('display','block');
                                                    $('.dashboard_no_access').css('display','none');
                                                    //$('#settingsli #role_settings').remove();
                                                    $('#settingsli #admin_settings').remove();

                                                    $("#permitted_backlog").val(access);
                                                }

                                                user_permission = $("#permitted_backlog").val();
                                                return true;
                                            }
                                        });
                                    });
                                });
                            });
                        }
                    } 
                }else{
                    $('#permission').css('display','block');
                }
            });
            
            if(firebase.auth().currentUser != null) {
                    if(firebase.auth().currentUser.email != "") {
                        $("#current_sprint").val(1);
                        if(user_permission == "" || user_permission === undefined) {

                            //get team
                            var isteammember = false;
                            var permittedbacklogs = "";

                            var teamsref = database.ref('teams');
                            teamsref.once('value').then(function(snapshot1) {
                                snapshot1.forEach(function(childSnapshot1) {
                                    var teamkey = childSnapshot1.key;
                                    var child_data1 = childSnapshot1.val();

                                    var backlogkey = child_data1.backlogs;

                                    var membersref = database.ref('teams/' + teamkey + "/members");
                                    membersref.once('value').then(function(snapshot2) {
                                        snapshot2.forEach(function(childSnapshot2) {
                                            var key2 = childSnapshot2.key;
                                            var val2 = childSnapshot2.val();
                                            if(val2 == $("#user_key").val()) {
                                                isteammember = true;
                                                if(permittedbacklogs == "") {
                                                    permittedbacklogs = backlogkey;
                                                } else {
                                                    permittedbacklogs += "," + backlogkey;  
                                                }

                                                access = permittedbacklogs;

                                                if(access != "") {
                                                    $('#main-loading-container').css('display','none');
                                                    $('#main_screen').css('display','block');
                                                    $('#no_backlog').css('display','none');
                                                    $('.dashboard_can_access').css('display','block');
                                                    $('.dashboard_no_access').css('display','none');
                                                    //$('#settingsli #role_settings').remove();
                                                    $('#settingsli #admin_settings').remove();

                                                    $("#permitted_backlog").val(access);
                                                }

                                                user_permission = $("#permitted_backlog").val();

                                                if(user_permission != "" && user_permission != undefined){
                                                    user_permissions = user_permission.split(";");

                                                    if(user_permissions.length > 0 ) {
                                                        ref.once('value').then(function(snapshot) {
                                                           
                                                            //var key = childSnapshot.key;
                                                            var child_data = snapshot.val();
                                                           //0331207 - get only active stories
                                                            if(child_data == null){
                                                                //window.location.href = "/rocketscrum/dashboard.php"
                                                                return
                                                            }
                                                            ref = database.ref(child_data.key + '/user_stories/');
                                                            maxref = database.ref(child_data.key+ '/max');
                                                            backlog_title = child_data.title;
                                                            backlog_key =  child_data.key;
                                                            $('#selected_backlog').val(child_data.key).trigger('change');
                                                            load_data();

                                                            getmax();
                                                            get_sprint_date();
                                                            

                                                            //04202017 get current sprint
                                                            var sprint_arr = [];
                                                            var sprintref = firebase.database().ref($('#selected_backlog').val() + '/sprints');
                                                            sprintref.once('value').then(function(snapshot){
                                                                snapshot.forEach(function(childSnapshot) {
                                                                    var sprintkey = childSnapshot.key;
                                                                    var child_data = childSnapshot.val();

                                                                    sprint_arr.push({
                                                                        sprint: parseInt(sprintkey.replace("sprint", "")),
                                                                        start_date: child_data.sprint_start_date,
                                                                        end_date: child_data.sprint_end_date
                                                                    })
                                                                });

                                                                var maxsprint = 0;
                                                                var maxstart_date = 0;
                                                                var maxend_date = 0;
                                                                if(sprint_arr.length > 0) {
                                                                    for (var i = 0; i < sprint_arr.length; i++) {
                                                                        if(sprint_arr[i]["sprint"] > maxsprint) {
                                                                            maxsprint = sprint_arr[i]["sprint"];
                                                                            maxstart_date = sprint_arr[i]["start_date"];
                                                                            maxend_date = sprint_arr[i]["end_date"];
                                                                        }
                                                                    }
                                                                }
                                                                if(maxsprint > 0) {
                                                                    var now = new Date();
                                                                    var sprintstartdate = new Date(maxstart_date.substring(0,10));
                                                                    var sprintenddate = new Date(maxend_date.substring(0,10));

                                                                    if(now >= sprintstartdate && now <= sprintenddate) {
                                                                        //current sprint 
                                                                        $("#current_sprint").val(maxsprint);
                                                                    }
                                                                }
                                                            });
                                                        });
                                                    }

                                                    permitted = true;

                                                }else{
                                                    $('#circularG').css('display','none');
                                                    $('.remove_access').css('display','block');
                                                    $('.remove_access').css('transform', 'translateY(165px)');
                                                    permitted = false;
                                                }

                                                return true;
                                            }
                                        });
                                    });
                                });
                            });
                        }
                    } 


                    if(user_permission != "" && user_permission != undefined){
                        user_permissions = user_permission.split(";");

                        if(user_permissions.length > 0 ) {
                            ref.once('value').then(function(snapshot) {
                               
                                //var key = childSnapshot.key;
                                var child_data = snapshot.val();
                                //0331207 - get only active stories
                                if(child_data == null){
                                    //window.location.href = "/rocketscrum/dashboard.php"
                                    return
                                }
                                ref = database.ref(child_data.key + '/user_stories/');
                                maxref = database.ref(child_data.key+ '/max');
                                backlog_title = child_data.title;
                                backlog_key =  child_data.key;
                                $('#selected_backlog').val(child_data.key).trigger('change');
                                load_data();

                                getmax();
                                get_sprint_date();
                                

                                //04202017 get current sprint
                                var sprint_arr = [];
                                var sprintref = firebase.database().ref($('#selected_backlog').val() + '/sprints');
                                sprintref.once('value').then(function(snapshot){
                                    snapshot.forEach(function(childSnapshot) {
                                        var sprintkey = childSnapshot.key;
                                        var child_data = childSnapshot.val();

                                        sprint_arr.push({
                                            sprint: parseInt(sprintkey.replace("sprint", "")),
                                            start_date: child_data.sprint_start_date,
                                            end_date: child_data.sprint_end_date
                                        })
                                    });

                                    var maxsprint = 0;
                                    var maxstart_date = 0;
                                    var maxend_date = 0;
                                    if(sprint_arr.length > 0) {
                                        for (var i = 0; i < sprint_arr.length; i++) {
                                            if(sprint_arr[i]["sprint"] > maxsprint) {
                                                maxsprint = sprint_arr[i]["sprint"];
                                                maxstart_date = sprint_arr[i]["start_date"];
                                                maxend_date = sprint_arr[i]["end_date"];
                                            }
                                        }
                                    }
                                    if(maxsprint > 0) {
                                        var now = new Date();
                                        var sprintstartdate = new Date(maxstart_date.substring(0,10));
                                        var sprintenddate = new Date(maxend_date.substring(0,10));

                                        if(now >= sprintstartdate && now <= sprintenddate) {
                                            //current sprint 
                                            $("#current_sprint").val(maxsprint);
                                        }
                                    }
                                });
                            });
                        }

                        permitted = true;

                    }else{
                        /*
                        $('#circularG').css('display','none');
                        $('.remove_access').css('display','block');
                        $('.remove_access').css('transform', 'translateY(165px)');
                        permitted = false;
                        */
                    }
            } else {
                $('#circularG').css('display','none');
                $('.remove_access').css('display','block');
                $('.remove_access').css('transform', 'translateY(165px)');
                //$('.remove_access').css('display','block');
            }
            
        });
        
    }



    function callDropDown() {
        
        $( document ).ready(function() {




           /*$('#stories_table thead:nth-child(2) th').each( function (i) {
                var title = $('#stories_table thead th').eq( $(this).index() ).text();
                $(this).html( '<input type="text"'+title+'" data-index="'+i+'" />' );
            } );

            $( table.table().container() ).on( 'keyup', 'thead input', function () {
                table
                    .column( $(this).data('index') )
                    .search( this.value )
                    .draw();
            } );*/
            
            //$('<span> Selected Backlog:<select id=\"select_backlog\" ><option value=\"\">all</option></select></span>').insertAfter('#stories_table_filter');
            showbacklogs();

            show_active_stories = function(tablerefreshonly = false) {
                //if(!tablerefreshonly){
                 //   location.reload();
                //}
                var results = [];

                var active = [];

                var btntext = $('a.active_stories span').text();
                if(btntext == "Active Stories" || tablerefreshonly) {
                    $('a.active_stories span').text("Deleted Stories");
                    var ref = database.ref($('#selected_backlog').val() + '/user_stories/');
                    ref.once('value').then(function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var key = childSnapshot.key;
                            var child_data = childSnapshot.val();
                            if(child_data.status != "trashed") {
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
                                    child_data.edit_del + "<input type='checkbox' class='checkBoxDrag' onclick='clickCheckbox(this.checked, this)'> ");
                                active.push(tmp_user_story);
                            }
                             /*if(child_data.status == "done"){       
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
                                story_done.push(tmp_user_story);        
                            }*/
                        });
                        
                        loadDataTable(active);
                        //$("#loading-container").css("display", "none");
                        callDropDown();
                    },
                    function(error) {
                        console.log("Error: " + error.code);
                    });
                } else {
                    $('a.active_stories span').text("Active Stories");
                }
                
            }
            

        });
    }
    
    function removelastspace (str){
        endstring = str.substr( str.length - 1, str.length) ;
        if (endstring == " "){
            str = str.substr( 0, str.length - 1) ;
            removelastspace(str);
        }
        
        return str 
        
    }

    function loadDataTable(active) {
        if(table !== undefined) {
            //japs change
            //table.clear();
            $('#stories_table').DataTable().destroy();
            $('#stories_table tbody').html('');
            $('#stories_table').find("*").off();
            $('#stories_table').off();

            //end japs

        }

        var counter = 0;
        $.fn.dataTable.render.ellipsis = function () {
            return function ( data, type, row ) {
                /*
                return type === 'display' && data.length > 80 ?
                    data.toString().substr( 0, 80 ) +'…' 
                    :
                    data;*/
                    if(type === 'display' && data.length > 70){
                        var str = data.toString().substr( 0, 70 ) ;
                        str = removelastspace(str);
                        return str = str + '…';
                         
                    }
                    else{
                        return data;
                    }
            }
        };

        table = $('#stories_table').DataTable(
            {   
                //scrollX: true,
                destroy: true,
                responsive: true,
                rowReorder: false,
                sortable: true,
                bAutoWidth: false,
                order: [
                    [0, 'asc']
                ],
                paging: false,
                dom: 'Bfrtip',
                select: true,
                buttons: [
                {
                    extend: 'create',
                    text: 'Create New User Story',
                    key: {
                        ctrlKey: true,
                        key: 'c'
                    },
                    action: function(e, dt, node, config)
                    {
                        e.preventDefault();
                        var test1 = node[0].text;
                        
                        editor.edit($(this).closest('tr'),
                        {
                            title: 'Create New User Story',
                            buttons: 'Create'
                        });
                        editor.create();
                        editor.field('as_a').enable();
                        editor.field('as_a').val("");
                        editor.field('i_want').enable();
                        editor.field('i_want').val("");
                        editor.field('i_want').label("I want...:");
                        $("#DTE_Field_i_want").attr("placeholder", "");
                        editor.field('so_that').show();
                        editor.field('acceptance_test').show();
                        editor.field('as_a').focus();
                        $(".DTE_Field_Name_status").css("display", "none");
                        $(".DTE_Field_Name_walkthrough").css("display", "none");
                    },
                },
                { 
                    extend: 'create',
                    text: 'Create New Bug',

                    action: function(e, dt, node, config)
                    {
                        e.preventDefault();
                        var test1 = node[0].text;
                        
                        editor.edit($(this).closest('tr'),
                        {
                            title: 'Create New Bug',
                            buttons: 'Create'
                        });
                        editor.create();
                        editor.field('as_a').disable();
                        editor.field('as_a').val("BUG");
                        editor.field('i_want').label("Please fill in a description of the bug:");
                        $("#DTE_Field_i_want").attr("placeholder", "Please provide repro steps for the bug");
                        editor.field('so_that').hide();
                        editor.field('so_that').val(" ");
                        editor.field('acceptance_test').hide();
                        editor.field('acceptance_test').val(" ");
                        editor.field('i_want').focus();
                        $(".DTE_Field_Name_status").css("display", "none");
                        $(".DTE_Field_Name_walkthrough").css("display", "none");
                    },
                },
                {
                    extend: 'print',
                    text: 'Print User Stories',
                    title: backlog_title,
                    exportOptions:
                    {
                        columns: [2,3,4,5,6,7,8,9],
                        format: {
                             header: function ( data, columnIdx ) {
                                return (columnIdx==3) ? "Sprint #" : data;
                            }
                        }
                    },
                    customize: function(tbl){
                        $(tbl.document.body).find('table td')
                        .addClass('breakword')
                        .css('word-break','break-all');

                        $(tbl.document.body).find('table th')
                        .addClass('leftalign')
                        .css('text-align','left');
                    }
                },

                /*{  text: 'Sprint Planning',
                 action: function(e, dt, node, config)
                    {
                        display_definitionofdone();
                        
                        issprintplanning = true;
                    }
                },*/

             
                {
                    text: 'Hide Done',
                    className: 'hide_unhide',
                    action: function()
                    {
                        hide_unhide('');
                    }
                },
                {
                    text: 'Sprint Backlog Export',
                    className: 'view_walkthrough',
                    action: function()
                    {
                        view_walkthrough('');
                    }
                },
                /*{
                    text: 'Wall Monitor',
                    className: 'wall_monitor',
                    action: function()
                    {
                        //window.location.href = ("/rocketscrum/scrumnow_wallmonitor.php?key="+ $("#user_key").val());
                        window.open("/rocketscrum/scrumnow_wallmonitor.php?key="+ $("#user_key").val(), '_blank');
                        
                    }
                },*/
                {
                    text: 'Backlog Summary',
                    className: 'backlog_summary',
                    action: function() {
                        show_backlog_summary();
                    }
                },
                {
                    text: 'Product Backlog Administration',
                    className: 'product_backlog',
                    action: function()
                    {
                        var backlog_admin_key = $("#select_backlog").val();
                        var backlog_admin_key = $("#select_backlog").val();
                        var user_teams = $("#user_teams").val();
                        $("#team_access").html("");
                        //$(".backlogs-modal").css("visibility","visible");
                        load_single_backlog_data(backlog_admin_key, $("#user_key").val());
                        $('#backlogs-close').click(close_backlog_modal);
                        $('.danger-delete-backlog').click(function(){
                            close_backlog_modal();
                            var deletebutton = $('#delete-backlogs');
                            deletebutton.attr("onclick","delete_backlogs(\""+ backlog_admin_key +"\");");
                            var modal = $('.delete-backlogs-modal');
                            modal.attr("style","visibility: visible;");
                        });
                                                        
                        $('#save-backlogs').click(function(){
                            var title = $("#backlogs-title").val();
                            var descriptions = $("#backlogs-description").val();
                            var in_active = $("#in_active").prop("checked");
                            var prod_owner_sel = $("#product-owner-select").val();
                            update_backlogs1(title ,descriptions,backlog_admin_key, in_active, prod_owner_sel);
                            location.reload();
                        });
                    }
                },

                //03312017 Trashed Stories
                {
                    text: 'Deleted Stories',
                    className: 'deleted_stories',
                    action: function() {
                        show_deleted_stories();
                    }
                },

                ], 
                               
                                                
                rowReorder:
                {
                    dataSrc: 'order',
                    //Melvin and Mariel, lock rows that are already committed Sprint 7 03/23/2017 - added reorderable class
                    selector: 'tr.reorderable td:not(:last-child)'
                },
                columnDefs: [
                    {   targets: 1,
                        width: '5px'
                    },
                    {   targets: 2,
                        width: '5px'
                    },
                    {   targets: 3,
                        width: '5px'
                    },
                    {   targets: 4,
                        width: '5px'
                    },
                    {   targets: 5,
                        width: '5px',
                        render: $.fn.dataTable.render.ellipsis(),
                        createdCell:  function (td, cellData, rowData, row, col) {
                            if(cellData == " "){
                                console.log("none");
                            }else{
                           $(td).attr('title', rowData.i_want); 
                           }
                        }
                    },
                    {   targets: 6,
                        width: '5px',
                        render: $.fn.dataTable.render.ellipsis(),
                        createdCell:  function (td, cellData, rowData, row, col) {
                            if(cellData == " " && cellData.length <70){
                                console.log("none");
                            }else{
                          
                            $(td).attr('title', rowData.so_that); 
                            }
                        }
                    },
                    {   targets: 7,
                        width: '5px',
                        render: $.fn.dataTable.render.ellipsis(),
                        createdCell:  function (td, cellData, rowData, row, col) {
                            if(cellData == " "){
                                console.log("none");
                            }else{
                            $(td).attr('title', rowData.acceptance_test); 
                            }
                        }
                    },
                    {   targets: 8,
                        width: '5px'
                    },
                    {   targets: 9,
                        width: '5px',
                        render: $.fn.dataTable.render.ellipsis(),
                        createdCell:  function (td, cellData, rowData, row, col) {
                             if(cellData == " "){
                                console.log("none");
                            }else{
                            $(td).attr('title', rowData.comments); 
                            }
                        }
                    },
                    {   targets: 10,
                        width: '5px'
                    },
                    

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
                        targets: [10],
                        visible: false
                    },
                    {
                        targets: [11],
                        createdCell: function (td, cellData, rowData, row, col) {
                            if(rowData.status == "done") {
                                $( td ).html("");
                            } else if (rowData.status == "in progress") {
                                $( td ).html("<a class='edit_link' href='#'>Edit</a>");

                            } else if (rowData.status == "to do" || rowData.status == "") {

                            }
                            
                        }
                    },
                    {
                        searchable: false, targets: [11]
                    }
                   
                ],
                
                
                //Adjusted to 100% from 130% -> Johann/Japs 3/23/17
                scrollY:function(){
                    var browserht = $(window).height();
                    tableht = browserht - 300;
                    return tableht;
                },

                data: active,
                bAutoWidth: false,
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
                        className: 'dt-head-left dt-storyid',
                        width: 5,
                    },
                    {
                        data: "sprint_number",
                        className: 'dt-head-left dt-sprint-number',
                        width: 5,
                    },
                    {
                        data: "as_a",
                        className: 'dt-head-left dt-as-a',
                        width: 5,
                    },
                    {
                        data: "i_want",
                        className: 'dt-head-left dt-i-want',
                        width: 5,
                    },
                    {
                        data: "so_that",
                        className: 'dt-head-left dt-so-that',
                        width: 5,
                    },
                    {
                        data: "acceptance_test",
                        className: 'dt-head-left dt-acceptance-test',
                        width: 5,
                    },
                    {
                        data: "story_points",
                        className: 'dt-head-left dt-story-points',
                        width: 5,
                    },
                    {
                        data: "comments",
                        className: 'dt-head-left dt-comments',
                        width: 5,
                    },
                    {
                        data: "status",
                        className: 'dt-head-left dt-status'
                    },
                    {
                        data: "edit_del",
                        className: 'dt-head-left dt-edit-del',
                        width: 5,
                    }
                    
                ],

                rowCallback: function ( row, data ) {
                    // Set the checked state of the checkbox in the table
                    $('input.editor-active', row).prop( 'checked', data.active == 1 );
                },

                createdRow: function( row, data, dataIndex ) {
                    


                    $( row ).addClass("reorderable");
                    $(row).attr('data-order', data.order);
                    $(row).attr('data-status', data.status);
                    $(row).attr('key', data.key);
                    $(row).attr('storyid', data.order);

                    
                    if ( data.status == "done" ) {
                        $( row ).css( "background-color", "#00ff00" );
                        $( row ).removeClass("reorderable");
                        data.edit_del = "";
                        
                    } else if ( data.status == "in progress" ) {
                        $( row ).css( "background-color", "#ffff00" );
                        $( row ).removeClass("reorderable");
                        data.edit_del = "";
                    } else {
                        
                        $( row ).attr('tabindex', counter);
                        counter++;
                    }

                },

                //Added Melvin/Mariel, filter rows by Sprint Number 04/01/2017
                initComplete: function () {
                    var api = this.api();
                    api.columns([3]).indexes().flatten().each(function (i) {
                        var column = api.column(i);
                        var select = $('#selectinput')
                            .appendTo($('#selectinput'))
                            .on('change', function () {

                            /*var elem = $(this)
                                table.columns(3)
                                .search("^\\s*"+elem.val()+"\\s*$", true)
                                .draw()*/
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );
 
                                 column
                                .search( val ? '^'+val+'$' : '', true, false )
                                .draw();
                            });
                        
                        var numarr = column.data();
                        numarr.sort(function(a,b) {
                            if (isNaN(a) || isNaN(b)) {
                                return a > b ? 1 : -1;
                            }
                            return a - b;
                        });                       


                        numarr.unique().each(function (d, j) {
                       
                            if(d!=""){
                                if(Object.prototype.toString.call(d) != "[object String]")
                                    select.append('<option value="' + d + '">' + d + '</option>');
                            }
                            else{
                                select.append('<option value="">all</option>');

                            }


                        });
                        
                    });
                },
                //End added

                //End Fucntion for Melvin and Mariel changing colors based on status Sprint 4 03/04/2017
            }).draw();
            table.buttons().containers().appendTo( '#rs-top-menu > li' ); //button reposition

            // This tells the DataTable what to do when a row is
            //reordered (dragged and dropped by user).
            // This was actually very tricky to figure out because a row
            // that is dragged and dropped up many rows in the table
            // actually shifts all the orders of all the rows in between.
            // solution was to iterate through all of the rows that were
            // changed using for loop and edit all of the orders using
            // the key of the row at that place in the table shift.


            //startsecondscount
            
            //endofsecondscount

            $(document).ready(function() {
                /*var height_limit = 600;     
                var story_limit = 15;       
                $('div.dataTables_scrollBody').on('scroll', function(el) {      
                    if(height_limit <= $('div.dataTables_scrollBody').scrollTop()){     
                        height_limit += 200;        
                        if(story_limit < results.length){       
                            story_limit = scroll_div(story_limit);      
                        }       
                    }       
                });*/
            if(missingpoints==true){
                $('#refine_stories').css('display','block');
                $('#start_sprint_planning').css('display','none');
            }
             else{
                $('#refine_stories').css('display','none');
                $('#start_sprint_planning').css('display','block');
            }
           
           // preventdrag = true;
            setTimeout(function() {
                $('#stories_table tbody tr:first-child').click();
            }, 1000);


                $("#stories_table ").dataTable().find("tbody").on('click', 'tr', function () {
                    removemulti();
                    allselected = 0;
                    allselected = table.rows(".selected").data().length;
                    console.log("number of selected: "+allselected);
                    if(allselected>1){
                        //console.log("multi drag activated");
                        multidragging();
                    }
                    
                });
                    
           
            });


            $( document ).tooltip({
                position: {
                    my: "center top-10",
                    at: "center bottom",
                    collision: "flip",
                    using: function( position, feedback ) {
                        $( this ).addClass( feedback.vertical )
                            .css( position );
                    }
                }
            });


            function removemulti(){
                console.log("remove multi");
                /*$("#stories_table tbody tr").draggable({
                    helper: function(){
                    var selected = $('tbody tr.selected');
                    if (selected.length === 0) {
                      selected = $(this).addClass('selected');
                    }
                    //$('img#thumb').removeAttr('id');
                    
                    var container = $('<div/>').removeAttr('id', 'draggingContainer');
                    container.append(selected.clone().removeClass("selected"));
                    allselected = 0;
                    
                    $('#stories_table tbody tr').removeClass('selected');
                    var container = $('<div/>').removeAttr('id', 'draggingContainer');
                               
                    return container;


                    }                 
                });*/

            }

            function multidragging(){
                console.log("multi dragging");
                /*$("#stories_table tbody tr").draggable({
                    helper: function(){
                    var selected = $('tbody tr.selected');
                    if (selected.length === 0) {
                      selected = $(this).addClass('selected');
                    }
                    
                    var container = $('<div/>').attr('id', 'draggingContainer');
                    container.append(selected.clone().removeClass("selected"));
                    allselected = 0;
                    
                    $('#stories_table tbody tr').removeClass('selected');

                    
                    return container;


                    }                 
                });*/
                //removemulti()     
            }
                          
                  
                //test added

            $("#stories_table .tbody tr").droppable({
                drop: function (event, ui) {

                    
                $(this).append(ui.helper.children());
                $('.selected').remove();
                }
            });
                //end test added

            /*$("#stories_table tbody tr").droppable({
                drop: function (details, event, ui) {            

                    
                    $(".selected", this).each(function(){
                    
                    var index = $("#stories_table tr").index(this) - 1;
                    $('#stories_table tbody tr:eq('+index+')').toggleClass('row_selected');
                    $('#stories_table tbody tr:eq('+index+')').toggleClass('selected');
                    });
                    /* var maxref = database.ref($('#selected_backlog').val()+ '/max');
                   
                    var allselected = table.rows(".selected").data().length;
                  

                    for(var i=0; i<allselected; i++){

                        database.ref( backlog_key + '/user_stories/' + row_key).update(
                        {
                            order: maxx
                        });                

                    }*/

                //$(this).append(ui.helper.children());
                //$('.selected').remove();
               // }
            //});

            /*function getTimeStamp() {
                // later record end time
                var endTime = new Date();

                // time difference in ms
                var timeDiff = endTime - startTime;

                // strip the miliseconds
                timeDiff /= 1000;

                // get seconds
                var seconds = Math.round(timeDiff % 60);

                // remove seconds from the date
                //timeDiff = Math.floor(timeDiff / 60);

                // get minutes
                //var minutes = Math.round(timeDiff % 60);

                // remove minutes from the date
                //timeDiff = Math.floor(timeDiff / 60);

                // get hours
                //var hours = Math.round(timeDiff % 24);

                // remove hours from the date
                //timeDiff = Math.floor(timeDiff / 24);

                // the rest of timeDiff is number of days
                var days = timeDiff;


                //$(".time").text(days + " days, " + hours + ":" + minutes + ":" + seconds);
                setTimeout(display, 1000);
            }*/
            var position;
            table.on('row-reorder', function(e, details, edit)
            {

                removemulti();
                if(details.length != 0){

                    var last = details.length;
                    var i;
                    dragging = true;
                  
                    //var seconds = Math.round(timeDiff % 60);
                    //var n = event.timeStamp;

                    if(details.length != 0){
                        position = details[0].newData;
                    }
                    
                    var flag = 0;
                    var jsonstring = "{"; //json for bulk update in firebase 
                    for (i = 0; i < last; i++)
                    {
                        preventdrag = true;

                        var current_status = table.row(details[i].node).data().status;
                        var current_status = table.row(details[i].node).data().status;
                    
                        var story_id = table.row(details[i].node).data().storyid;
                        var old_order = table.row(details[i].node).data().order;
                        var new_order = details[i].newData;

                        var nexti = i+1;
                        if(nexti >= last){
                            var next_status = table.row(details[0].node).data().status;
                        } else {
                            var next_status = table.row(details[nexti].node).data().status;
                        }
                        
                        var temp = details[i].oldData;
                        var postemp = details[i].oldPosition;
                        var a_tmp_key2 = table.row(details[i].node).data().key;
                        if(next_status == "in progress" || next_status == "done"){
                            flag = 1;
                            preventdrag = true;
                            //setTimeout(show_active_stories(true),500);
            
                        }
                        
                        if (flag == 1){
                            details[i].oldData = details[i].newData;
                            details[i].oldPosition = details[i].newPosition;
                            details[i].newData = temp;
                            details[i].newPosition = postemp;
                        }
                        
                        if(i!= 0){
                            position++;
                        }
                        if(jsonstring != "{"){
                            jsonstring += ",";
                        }
                        if(flag != 1){
                            details[i].newData = position
                            var path = a_tmp_key2 + "/order";
                            jsonstring += "\"" + path + "\" :\"" + position + "\" ";
                           /* database.ref(backlog_key + '/user_stories/' + a_tmp_key2).update({
                            order: position
                            });*/
                            
                        }
                        
                       
                        if(drag == true){

                        }

                    }// Give it time to load in the DOM
                    if(jsonstring != "{"){
                        jsonstring += "}";
                        var parsedjason = $.parseJSON(jsonstring);
                        database.ref(backlog_key + '/user_stories/').update(parsedjason);
                    }
                    

                    var member = "";
                    var remarks = "";
                    var changed_arr = [];

                    /*if($("#user_role").val().indexOf("Product Owner") < 0) {
                        if($("#user_role").val() == "") {
                            member = "Team Member";
                        } else {
                            member = $("#user_role").val();
                        }
                        remarks = "Member with Scrum Role " + member + " reordered the row. ";
                    }*/
                    var createdSh="Member with Scrum Role Stakeholder reordered the row.";
                    createdSh=($("#user_role").val()=="Stakeholder") ? createdSh : "";
                    save_scrum_violation(createdSh, old_order, new_order, story_id, 'Order');
                }
                dragging = false;
               // preventdrag = false;
            });

            // Edit record
            table.on('click', 'a.edit_link', function(e)
            {
                e.preventDefault();

                editor.edit($(this).closest('tr'),
                {
                    title: 'Edit User Story',
                    buttons: 'Update'
                    
                });
               
               
                
                var editor_status = $('#DTE_Field_status').val();
                var bug_status = $('#DTE_Field_as_a').val();
                if(bug_status == "BUG"){

                        editor.field('as_a').disable();
                        editor.field('as_a').val("BUG");
                        editor.field('so_that').hide();
                        editor.field('acceptance_test').hide();
                }
                else{
                editor.field('as_a').enable();
                editor.field('so_that').show();
                editor.field('acceptance_test').show();
                if(editor_status == "to do"){
                    $(backlog_dropdown).insertAfter('.DTE_Field_Name_sprint_number');
                    get_currentuser_backlogs($("#user_key").val(),"#edit_select_backlog");

                    $(copy_backlog).insertAfter('.DTE_Field_move_backlog');
                    get_currentuser_backlogs($("#user_key").val(),"#makeCopy");

                    isinprogress = false;
                }
                else{
                    isinprogress = true;
                }
                
                }

                var sprintsnum = "sprint" + $(this).closest('tr').find('td').eq(2).text();

                database.ref(backlog_key + '/sprints/').once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var child_data = childSnapshot.val();
                        if(childSnapshot.key == sprintsnum) {
                            
                            if(child_data.walkthrough != "" && child_data.walkthrough != undefined) {
                                $("#DTE_Field_walkthrough").val(child_data.walkthrough);
                                $('#DTE_Field_status').val(editor_status);
                                $("#DTE_Field_walkthrough").prop('disabled', false);
                                $("#DTE_Field_walkthrough").css('background', "transparent");
                            }
                        }
                    });
                });

                if(!(editor_status == "done" || editor_status == "in progress")) {
                    $("#DTE_Field_walkthrough").prop('disabled', true);
                    $("#DTE_Field_walkthrough").css('background', "lightgray");
                } else {
                    $(".DTE_Field_Name_walkthrough").css("display", "block");
                    $("#DTE_Field_walkthrough").prop('disabled', false);
                    $("#DTE_Field_walkthrough").css('background', "transparent");
                }
                $('#DTE_Field_status').on('change', function() {
                    if(!(this.value == "done" || this.value == "in progress")) {
                        $("#DTE_Field_walkthrough").val("");
                        $("#DTE_Field_walkthrough").prop('disabled', true);
                        $("#DTE_Field_walkthrough").css('background', "lightgray");
                    } else {
                        $(".DTE_Field_Name_walkthrough").css("display", "block");
                        $("#DTE_Field_walkthrough").prop('disabled', false);
                        $("#DTE_Field_walkthrough").css('background', "transparent");
                    }
                });
            }).on('mouseup',function(){
                setTimeout(function() {
                if($('#DTE_Field_status').val() == 'to do'){
                $(".DTE_Field_Name_status").css("display", "none");
                }
                else{
                    $(".DTE_Field_Name_status").css("display", "block");
                }
                setdisplayaction();
                makeCopydisplayaction();
               
               },100);
            });

            // Remove record
            table.on('click', 'a.remove_link',function(e)
            {

                e.preventDefault();

                editor.title('Delete')
                    .message('Are you sure you want to delete this story?')
                    .buttons({
                        label:'Delete',
                        fn: function(){this.submit();}
                    })
                    .remove($(this).closest('tr'));
               
            })
            //end Remove record added
            
            //keydown for multiselect
            /*$("tr").keydown(function(e) {
                if (e.keyCode == 40 || e.shiftkey){ //arrow down
                    if(!$(this).next().hasClass("selected")){
                        $(this).next().addClass("selected");
                        var rowindex = $(this).parents('tr').index() + 1
                        $(this).parents('table').find('tr:eq('+rowindex+')').focus()
                        
                    } else {
                        $(this).next().removeClass("selected");
                    }
                }
                if (e.keyCode == 38){ //arrow up
                    $(this).closest('tr').prev().addClass("selected");
                    var rowindex = $(this).parents('tr').index() - 1
                    $(this).parents('table').find('tr:eq('+rowindex+')').focus()
                  
                }
            });*/
           
            var focusedRow = null;
            var selectedCount = 0;
            
            $('#stories_table').on('keydown', function(ev){
               //consol e.log(focusedRow);
                if(focusedRow == null) {
                    focusedRow = $('tr.selected:first', '#stories_table');
                } else if(ev.keyCode === 38) { //up
                    if(focusedRow.prev('tr').hasClass('selected')){
                        focusedRow.removeClass('selected');
                    } else {
                        focusedRow.addClass('selected');
                    }
                    if(focusedRow.prev('tr').hasClass('reorderable')){
                        focusedRow = focusedRow.prev('tr');
                    }
                    focusedRow.addClass('selected');
                } else if(ev.keyCode === 40) { //down
                    if(focusedRow.next('tr').hasClass('selected')){
                        focusedRow.removeClass('selected');
                    } else {
                        focusedRow.addClass('selected');
                    } 
                    if(focusedRow.next('tr').hasClass('reorderable')){
                        focusedRow = focusedRow.next('tr');
                    }  
                    focusedRow.addClass('selected'); 
                }
            });
            //end add          


            function hotkey(){
                
            }

            var show_backlog_summary = function() {
                var key = $("#selected_backlog").val();
                //window.location = "backlog_summary.php";
                window.location = "backlog_status.php?key="+key;
            }


            //03312017 - show deleted stories
            var show_deleted_stories = function() {

                if(resultstrashed.length > 0) {
                    resultstrashed = [];
                }

                var trash = [];

                var btntext = $('a.deleted_stories span').text();
                if(btntext == "Deleted Stories") {
                    $('a.deleted_stories span').text("Active Stories");  
                    var ref = database.ref($('#selected_backlog').val() + '/user_stories/'); 
                    ref.once('value').then(function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var key = childSnapshot.key;
                            var child_data = childSnapshot.val();
                            if(child_data.status == "trashed") {
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
                                trash.push(tmp_user_story);
                               
                            }
                        });

                        loadDeletedDataTable(trash);
                        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');

                        //$("#loading-container").css("display", "none");
                        callDropDown();
                    },
                    function(error) {
                        console.log("Error: " + error.code);
                    });
                } else {
                    $('a.deleted_stories span').text("Deleted Stories");
                }
            }
            if(donehide){
                hide_unhide('load');
            }
            $('.dataTables_scrollBody').scrollTop(scrollposition) ;

            

    }

    //03312017 - load deleted stories
    function loadDeletedDataTable(trash) {
        if(table !== undefined) {
            table.clear();
        }


        $.fn.dataTable.render.ellipsis = function () {
            return function ( data, type, row ) {
                /*
                return type === 'display' && data.length > 80 ?
                    data.toString().substr( 0, 80 ) +'…' 
                    :
                    data;*/
                    if(type === 'display' && data.length > 70){
                        var str = data.toString().substr( 0, 70 ) ;
                        str = removelastspace(str);
                        return str = str + '…';
                         
                    }
                    else{
                        return data;
                    }
            }
        };


        table = $('#stories_table').DataTable(
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
                buttons: [
                {
                    text: 'Active Stories',
                    className: 'active_stories',
                    action: function() {

                        location.reload();

                    }
                }
                ],
                columnDefs: [
                  
                    {
                        targets: [0],
                        visible: false
                    },
                    
                    {   targets: 5,
                        width: '5px',
                        render: $.fn.dataTable.render.ellipsis(),
                        createdCell:  function (td, cellData, rowData, row, col) {
                           $(td).attr('title', rowData.i_want); 
                        }
                    },
                    {   targets: 6,
                        width: '5px',
                        render: $.fn.dataTable.render.ellipsis(),
                        createdCell:  function (td, cellData, rowData, row, col) {
                           $(td).attr('title', rowData.so_that); 
                        }
                    },
                    {   targets: 7,
                        width:'5px',
                        render: $.fn.dataTable.render.ellipsis(),
                        createdCell:  function (td, cellData, rowData, row, col) {
                           $(td).attr('title', rowData.acceptance_test); 
                        }
                    },
                    {   targets: 8,
                        width: '5px'
                        
                    },
                    {   targets: 9,
                        width: '5px',
                        render: $.fn.dataTable.render.ellipsis(),
                        createdCell:  function (td, cellData, rowData, row, col) {
                           $(td).attr('title', rowData.comments); 
                        }
                    },
                    {   targets: 10,
                        width: '5px'
                    },
                    {
                        targets: '_all',
                        orderable: false
                    },

                    {
                        searchable: false, targets: [10]
                    }
                   
                ],
                scrollY:function(){
                    var browserht = $(window).height();
                    tableht = browserht - 335;
                    return tableht;
                },
                //Adjusted to 100% from 130% -> Johann/Japs 3/23/17
                data: trash,
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
                        className: 'dt-head-left dt-storyid'
                    },
                    {
                        data: "sprint_number",
                        className: 'dt-head-left dt-sprint-number'
                    },
                    {
                        data: "as_a",
                        className: 'dt-head-left dt-as-a'
                    },
                    {
                        data: "i_want",
                        className: 'dt-head-left dt-i-want'
                    },
                    {
                        data: "so_that",
                        className: 'dt-head-left dt-so-that'
                    },
                    {
                        data: "acceptance_test",
                        className: 'dt-head-left dt-acceptance-test'
                    },
                    {
                        data: "story_points",
                        className: 'dt-head-left dt-story-points'
                    },
                    {
                        data: "comments",
                        className: 'dt-head-left dt-comments'
                    },
                    {
                        data: "status",
                        className: 'dt-head-left dt-status'
                    },
                    {
                        data: "edit_del",
                        className: 'dt-head-left dt-edit-del'
                    }
                    
                ]
            });
            table.buttons().containers().appendTo( '#rs-top-menu > li' ); //button reposition

            // Restore record
            table.on('click', 'a.restore_link',function(e)
            {

                e.preventDefault();

                editor.title('Restore')
                    .message('Are you sure you want to restore this story?')
                    .buttons({
                        label:'Restore',
                        fn: function(){this.submit();
                            location.reload();
                        }
                    })
                    .remove($(this).closest('tr'));
               
            });


             // $('#stories_table').trigger(jquery.event('keydown', {keycode:38, shiftkey:true}));
            
            //03312017 - show active stories
             

    }

    // We have to set a time delay for now because the reference takes
    // a little bit of time depending on network connection. In future,
    // this should be changed to use a JavaScript Promise as outlined
    // in firebase.google.com documentation.
    setTimeout(function()
    {
        //DataTable functions removed            
    }, 3000);

   /* $('#stories_table tbody').on('click', 'tr', function()
    {
        if ($(this).hasClass('selected'))
        {
            $(this).removeClass('selected');
        }
        else
        {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });*/
    
    $(window).resize(function() {
        $('#stories_table').removeClass('dtr-inline collapsed');
    });

   
    //disable other checkboxes if PO
    var subinputs = $("input[class='sm'],input[class='tm']");
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
        /*else if(this.value != "Product Owner" && this.checked) {
            $("input[class='po']").prop("disabled",true);
            $("input[class='po']").prop("checked", false);
        } else if(this.value == "Scrum Master" && this.checked && $("input[class='tm']").checked == false) {
            $("input[class='po']").prop("disabled",false);
        } else if(this.value == "Scrum Master" && !this.checked && $("input[class='tm']").checked == false) {
            $("input[class='po']").prop("disabled",false);
        } 
        else if(this.value == "Team Member" && $("input[class='sm']").checked == false){
            $("input[class='po']").prop("disabled",false);
        }*/

    });
    //end function disable other checkboxes

    function load_data(){
    var temp_min = 0;
    var ref = database.ref($('#selected_backlog').val() + '/user_stories/');
    ref.orderByChild("order").once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
            if(child_data.status != "trashed") {
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
                    child_data.edit_del + "<input type='checkbox' class='checkBoxDrag' onclick='clickCheckbox(this.checked, this)'> ");
                results.push(tmp_user_story);
                var min = $('#min_order');
                if(child_data.status != "done" && child_data.status != "in progress"){
                    if(child_data.order < min.val() || min.val() == ''){
                            min.val(parseInt(child_data.order) - 1);
                    }
                    
                }
                //needed when there is no stories with "todo" status
                else{
                    if(temp_min < parseInt(child_data.order)){
                        temp_min = parseInt(child_data.order);
                    }
                }
                                   
                if(child_data.story_points == "" ){
                    missingpoints=true;

               }
            }
           /* if(child_data.status == "done"){        
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
                story_done.push(tmp_user_story);        
            }*/
        });
        if($('#min_order').val() == ''){
            $('#min_order').val(temp_min);
        }

        /*var result_limit = [];      
        var limitx = 15;        
        if(results.length < 15){        
            limitx = results.length;        
        }       
        for (var limit=0; limit<limitx; limit++){       
            result_limit.push(results[limit]);      
        }    */   
        loadDataTable(results);

        callDropDown();

        setTimeout(function() {
                $('.home').append('<style>th { word-wrap:break-word !important; }</style>')
                $('#main-loading-container').css('display', 'none');
                $('#main_screen').css('display', 'block');

        }, 1000);
    },
    function(error) {
        console.log("Error: " + error.code);
    });


    set_sprintplanning_botton();
    showbacklogs_edit();
    copylogs();
    //if(preventdrag != true){
    updatedatatable();
    //}
    //setTimeout(function(){get_sprint_date();}, 3000);
    missingpoints=false;
    preventdrag = false;
}
});
$(function () {
    $('#sprint_start_date').datepicker().on('change', function() {
    
    $( '#sprint_end_date' ).datepicker( "destroy" );
    $('#sprint_end_date' ).removeClass("hasDatepicker");
    $( '#sprint_end_date' ).val("");
    $('#sprint_end_date').datepicker({minDate: new Date(this.value)});
    });
    
});
function removeSelected(){
    var tbl=$("#stories_table").DataTable();
    var tbldata = tbl.rows('.reorderable').data();
    var tbldataNew = $("#stories_table tbody tr.reorderable");
    for(var y=0; y<tbldata.length; y++){
        var data = tbldata[y];
        var dataNew = $(tbldataNew[y]);
        var dataOrder = Object.values(data)[0];
        var dataOrderNew = $(dataNew).attr("data-order");
        var dataKey = $(dataNew).attr("key");
        //$(data).attr("data-order", dataOrderNew);
        //$(dataNew).attr("data-order", dataOrder);
        //console.log(dataOrder + " to " +dataOrderNew);
        firebase.database().ref($('#selected_backlog').val() + "/user_stories/" + dataKey).update({
            order: parseInt(dataOrder)
        });
    }
    var selected = $('tr.selected1');
    var selected_checkbox = $('tr.selected1 td input[type=checkbox]');
    selected_checkbox.prop("checked", false);
    selected.removeClass('dt-rowReorder-moving');
    selected.removeClass('ui-draggable');
    selected.removeClass('selected1');
    this.removeEventListener('mouseup',removeSelected);
}
function clickCheckbox(checked, ito){
    if(checked){
        $(ito.closest("tr")).css("background","gray");
        $(ito.closest("tr")).addClass("selected1");
        var selectedContainer = "";
        var tblTop = $("#stories_table").offset().top;
        var tblBottom = $("#stories_table tbody").offset().top + $("#stories_table tbody").height();
        var tblLeft = $("#stories_table tbody").offset().left - $(ito.closest("tr")).width()/2;
        var tblRight = $("#stories_table tbody").offset().left + $(ito.closest("tr")).width()/2;
        $(ito.closest("tr")).draggable({
            containment: [tblLeft, tblTop, tblRight, tblBottom],
            helper: function(){
                var selected = $('#stories_table tbody tr.selected1');
                selectedContainer = selected;
                for(var x=0; x<selected.length; x++){
                    $(selected[x]).css("background","none");
                    var selectedCheckbox = $(selected[x]).find('td input:checkbox');
                    $(selectedCheckbox).prop("checked", false);
                }
                var container = $('<table/>').attr('id', 'draggingContainers1');
                container.addClass("dataTable no-footer dt-rowReorder-float");
                container.append(selected.clone().removeClass('selected1'));
                return container;
            }
        });
        $('#stories_table tbody tr.reorderable').droppable({
            over: function(event, ui) {
                var selected = $('#stories_table tbody tr.selected1');
                var trlength = ($('#stories_table tbody tr').length - selected.length);
               // console.log($("#stories_table tbody tr").index(selected[selected.length - 1]));
               // console.log($(this).offset());
                if($("#stories_table tbody tr").index(this) == trlength - 1){
                    selectedContainer.addClass('dt-rowReorder-moving');
                    $(selectedContainer).insertAfter(this);
                }
                else{
                    
                    selectedContainer.addClass('dt-rowReorder-moving');
                    $(selectedContainer).insertBefore(this);
                    /*
                    var container = $("#draggingContainers1 tr");
                    for(var x=0; x<selected.length; x++){
                        var selectedData = $(selected[x]).find('td');
                        var selectedFirstData = $(selected[0]).find('td');
                        var containerTD = $(container[x]).find('td');
                        containerTD[0].innerHTML = parseInt(selectedFirstData[0].innerHTML) + x;
                    }*/
                    //$('body').addClass("dt-rowReorder-noOverflow");
                    document.documentElement.addEventListener('mouseup', removeSelected); 
                }
            }
        });

    }
    else{
        $(ito.closest("tr")).removeClass("selected1");
        $(ito.closest("tr")).css("background","none");
    }
}
function get_sprint_date(){
    var last_sprint_date;
   var database = firebase.database();
   var sprints = database.ref($('#selected_backlog').val() + '/sprints/');
   var currentDate = new Date();
   var day = ("0" + (currentDate.getDate() - 1)).slice(-2);
   var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
   var year = currentDate.getFullYear();
   //var today = month+"/"+day+"/"+year;
   var today = year+"-"+month+"-"+day;
   sprints.once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
         var sprintnumstr = childSnapshot.key.split("sprint");
         var child_data = childSnapshot.val();
            sprintnumarr.push({
               sprint_num: parseInt(sprintnumstr[1]),
               sprint_start_date: child_data.sprint_start_date,
               sprint_end_date: child_data.sprint_end_date
            });
         });
         sprintnumarr.sort(function(a, b){return a.sprint_num-b.sprint_num});
         //last_sprint_date = sprintnumarr[sprintnumarr.length - 1].sprint_end_date;
         if(sprintnumarr.length != 0){
             $('#sprint_date').val(sprintnumarr[sprintnumarr.length - 1].sprint_end_date);
         }else{
             $('#sprint_date').val(today);
         }
         //console.log(last_sprint_date);
      });
   //setTimeout(function(){$('#sprint_date').val(last_sprint_date);}, 2000);
}

function view_walkthrough(){
    
    window.location.href = "walkthrough.php"

}

//Melvin Added functions for providing estimates
function show_provide_estimates(){

    i=0;
    var database = firebase.database();
    var ref = database.ref($('#selected_backlog').val() + '/user_stories/');
    ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var child_data = childSnapshot.val();
        if(child_data.status != "trashed") {
                                   
        if(child_data.story_points == ""){
                    missingpoints=true;
                    $("#stories_list").append('<tr id="myrows" value="'+key+'" class="estimate_table"><td id="noestimatesas_a">' + child_data.as_a + '</td><td id="noestimatesi_want">' + child_data.i_want + '</td><td id="noestimatesso_that">' + child_data.so_that + '</td><td id="noestimatesacceptance_test">' + child_data.acceptance_test + '</td><td><select id="points_estimates" style="font-size: 1em;" data-key="'+key+'"><option value="" disabled="true" selected="">Select Estimate Points</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="5">5</option><option value="8">8</option><option value="13">13</option><option value="21">21</option><option value="34">34</option><option value="55">55</option><option value="89">89</option><option value="144">144</option></select></td></tr>');
                    storedkey[i]=key;
                    console.log(storedkey[i])
                    i+=1;
                    console.log("array count: "+i);
                }
            }
        });


      //  missingpoints = false;

    });

    $('#provide_estimates').css('display','block');
    $("#definition_done").css('display','none');
}


function close_provide_estimates_modal(){

    $('.estimate_table').each(function(){
        this.remove();
    });

    $('#provide_estimates').css('display','none');
}

function show_error_estimates() {
    $("#definition_done").css('display','none');
    $('#provide_estimates').css('padding-left','100%');
    $('#error_estimates').css('display','block');
}


function show_success_estimates() {
    $("#definition_done").css('display','none');
    $('#success_estimates').css('display','block');
}

function success_planning_estimates_modal(){
    start_sprint_planning();
    $('#success_estimates').css('display','none');

}

function close_success_estimates_modal(){   
    $('#success_estimates').css('display','none');
    $('#provide_estimates').css('padding-left','0%');
    $('#provide_estimates').css('display','none');
}

function close_error_provide_estimates_modal(){
    $('#provide_estimates').css('padding-left','0%');
    $('#error_estimates').css('display','none');
    //$('#provide_estimates').css('display','block');
    //location.reload();
}

function proceed_planning() {
    var notaccepted = false;
    //var chosenpoints = [];

    var x=0;
    $('select#points_estimates option:selected').each(function(){
        var story_provided_points = 0;
        if($(this).val()!=""){
            //chosenpoints[x] = $(this).val();
            story_provided_points = $(this).val();
            //console.log(story_provided_points);      
        }else{
            notaccepted=true;
        }
        key = $(this).parent().attr('data-key');
        //var key = storedkey[x];
        //console.log(key);

        if(notaccepted!=true){
            var database = firebase.database();

            database.ref(backlog_key + '/user_stories/' + key).update(
            {
                story_points: story_provided_points

            });
            x+=1;
            $('#provide_estimates').css('display','none');
            close_provide_estimates_modal();
            //if(stopload != true){
            //location.reload();
            //}\
            show_active_stories(true);
            show_success_estimates();
            missingpoints=false;

        }else{
             console.log("there's still missing points");
            $('#success_estimates').css('display','none');
            show_error_estimates();
            missingpoints=true;
            //stopload = true;
        }

    });
    notaccepted = false;
    stopload = false;
}
//End Added


//hide done stories by default - Melvin and Mariel Sprint 8
function hide_unhide(hidemode) {
    //Column 10 = Status
    var btntext = $('a.hide_unhide span').text();
    var table = $('#stories_table').DataTable();

    if(hidemode == 'load') {
        btntext = "Hide Done";        
    }
    var userkey = $("#user_key").val();

    if(btntext == "Hide Done") {
        $('a.hide_unhide span').text("Show Done");
        table
        .columns(10)
        .search('^(?:(?!done).)*$\r?\n?', true, false)
        .draw();
        if(userkey != '' && userkey !== undefined) {
            database.ref('/user/' + userkey).update(
            {
                hide_done: 1
            });
        }
    } else {
        $('a.hide_unhide span').text("Hide Done");
        /*if(table.data().count() < story_done.length + results.length)       
            table.rows.add(story_done);*/
        table
        .columns()
        .search('')
        .draw();
        if(userkey != '' && userkey !== undefined) {
            database.ref('/user/' + userkey).update(
            {
                hide_done: 0
            });
        }
    }
}

function showbacklogs(){
    console.log("Test show backlogs");
    

    var dropdown = '<span> Selected Backlog:<select id=\"select_backlog\" >';
                            dropdown    += '</select></span>';
                            $(dropdown).insertAfter('#stories_table_filter');
                            //get_currentuser_backlogs("-KiID-ei3bI87qSNHV_R","#select_backlog");
                            get_currentuser_backlogs($("#user_key").val(),"#select_backlog");
                            


        seteventlistener();
}



function getmax(){


    var maxref = database.ref($('#selected_backlog').val()+ '/max');
                      
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
}

function display_definitionofdone(){
    //load_data();

    var done_modal = $("#definition_done");
    done_modal.css("display","block");
    missingpoints = false;
}

function set_sprintplanning_botton(){
    $("#start_sprint_planning").click(function(){
        var done_modal = $("#definition_done");
        done_modal.css("display","none");
        start_sprint_planning();
        
    });

}

function close_sprint_planning(){

    location.reload();
    
}

function close_done_modal(){

var done_modal = $("#definition_done");
        done_modal.css("display","none");
        issprintplanning = false;
}

function showbacklogs_edit(){
    var dropdown = '<div class="DTE_Field DTE_Field_Type_Text DTE_Field_move_backlog"><label data-dte-e="label" class="DTE_Label">Move to another backlog?</label><span> <br><input type="checkbox" id="chkbox_changebacklog" value="True"><select style="visibility:hidden;" id="edit_select_backlog" >';
        dropdown    += '</select></span><div>';
        backlog_dropdown = dropdown;
}



function copylogs(){
    var dropdown = '<div class="DTE_Field DTE_Field_Type_Text DTE_Field_Copy"><label data-dte-e="label" class="DTE_Label">Copy to another backlog?</label><span> <br><input type="checkbox" id="chkbox_copyBox" value="True"><select style="visibility:hidden;" id="makeCopy" >';
        dropdown    += '</select></span><div>';
        copy_backlog = dropdown;
}


function getmax_backlog(backlog_key){


    var maxref = database.ref(backlog_key+ '/max');
                      
    maxref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var child_data = childSnapshot.val();
                storyid = parseInt(child_data); 
                return storyid;
            });
        },
        function(error) {
            console.log("Error: " + error.code);
        });
}


function setdisplayaction(){

    $('#chkbox_changebacklog').change(function(){
        if( $('#chkbox_changebacklog').prop('checked')){
            $('#edit_select_backlog').css('visibility','visible');
            $('#chkbox_copyBox').prop('checked', false);
            $('#makeCopy').css('visibility','hidden');
        }
        else{
            //$('#chkbox_copyBox').show();
            $('#edit_select_backlog').css('visibility','hidden');
        }
    });

}

function makeCopydisplayaction(){

    $('#chkbox_copyBox').change(function(){
        if( $('#chkbox_copyBox').prop('checked')){
            $('#makeCopy').css('visibility','visible');
            $('#chkbox_changebacklog').prop('checked', false);
            $('#edit_select_backlog').css('visibility','hidden');
        }
        else{
            $('#makeCopy').css('visibility','hidden');
        }
    });
}
var lastreload = 0;
function updatedatatable(){


    /*database.ref($('#selected_backlog').val() + '/user_stories/').on('child_changed', function(childSnapshot, prevChildKey) {
        
            childSnapshot.val();
        if(typeof show_active_stories == 'function' && !issprintplanning &&  !dragging && (lastreload + 3000) < $.now()){
            lastreload = $.now();
           
            setTimeout(show_active_stories(true),2000);
            scrollposition = $('.dataTables_scrollBody').scrollTop();
            //location.reload(true);
        }

        
        
    });*/
    database.ref($('#selected_backlog').val() + '/user_stories/').on('child_added', function(childSnapshot, prevChildKey) {
        
        childSnapshot.val();
        if(typeof show_active_stories == 'function' && !issprintplanning && !dragging && (lastreload + 3000) < $.now()){
            lastreload = $.now();
            setTimeout(show_active_stories(true),2000);
            
            scrollposition = $('.dataTables_scrollBody').scrollTop();
        }
    });
    database.ref($('#selected_backlog').val() + '/user_stories/').on('child_removed', function(childSnapshot, prevChildKey) {
       
        childSnapshot.val();
        if(typeof show_active_stories == 'function' && !issprintplanning  && !dragging && (lastreload + 3000) < $.now()){
            lastreload = $.now();
            setTimeout(show_active_stories(true),2000);
            
            scrollposition = $('.dataTables_scrollBody').scrollTop();
        }
    });


}
//end hide done

function checkpoints(table){
    var data  = table.rows().data();
    missingpoints = false;
    $('#refine_stories').css('display','none');
    $('#start_sprint_planning').css('display','block');

    for(count = 0;count < data.length; count++){
        if(data[count].story_points == ""){
            $('#refine_stories').css('display','block');
             $('#start_sprint_planning').css('display','none');
             missingpoints = true;
            return;
        }
    }
   
    //$('#refine_stories').css('display','none');
}
function scroll_div(story_limit){       
    var table = $('#stories_table').DataTable();        
    var result_limit = [];      
    var limit = story_limit + 1;        
    story_limit += 15;      
    if(story_limit >= results.length){      
        story_limit = results.length-1;     
    }       
    if(table.data().count() < story_limit - 1 && table.data().count() < results.length){        
        for (var limit1=limit; limit1<=story_limit; limit1++){      
            result_limit.push(results[limit1]);     
        }       
        table.rows.add(result_limit).draw("full-hold");     
        return story_limit;     
    }       
    return story_limit;     
}
