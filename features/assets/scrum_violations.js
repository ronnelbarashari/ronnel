$( function() {

    console.log("Scrum Violations js loaded.");
    
    $.ajax({
        type: "POST",
        url: "features/scrum_violations/log_files.php",
        data: {search: 'all'},
        success: function(result){
            //console.log("Result: " + result);
            $("#tabs-violations > h2").text("Scrum Violations");
            $("#violations-body").html(result);

            getSelectedBacklog();
        }
    });

    $(document).on('change', '#sv_select_backlog',function () {
        $("#violations-text").html("");
        getBacklogFiles($("#sv_select_backlog").val());
    });
});



function getSelectedBacklog(){
    var database = firebase.database();
    var ref = database.ref('user/' + $('#user_key').val() +'/selected_backlogs');
    ref.once('value').then(function(snapshot) {
        var child_data = snapshot.val();
        
        //0331207 - get only active stories
        ref = database.ref(child_data.key + '/user_stories/');
        backlog_title = child_data.title;
        backlog_key =  child_data.key;

        $('#selected_backlog').val(child_data.key);
        showBacklogs();
    });
}

function showBacklogs(){
            get_currentuser_backlogs($("#user_key").val(),"#sv_select_backlog");        
            getBacklogFiles($('#selected_backlog').val());                                     
}

function getBacklogFiles(key) {
    $.ajax({
        type: "POST",
        url: "features/scrum_violations/backlog_logfiles.php",
        data: {backlog_path: key},
        success: function(result){
            $("#log_files_container").html(result);
        }
    });
}

function showLogFile() {
    var log_file = $("#sv_log_files").val();

    if(log_file !== undefined && log_file != "") {
        $.ajax({
            type: "POST",
            url: "features/scrum_violations/log_file.php",
            data: {file_path: log_file},
            success: function(result){
                console.log("Result: " + result);
                $("#violations-text").empty();
                $("#violations-text").html(result);
            }
        });
    } else {
        $("#violations-text").empty();
        $("#violations-text").html("<div style='margin-top:20px;'><b>Please select the log file from the list.</b></div>");
    }
}