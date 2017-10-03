<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ScrumNow</title>
    <?php
        include('templates/requiredscripts2.php');
    ?>
    <script id="misc" src=""></script>
    <script id="global_vars" src=""></script>
    <script id="sprint_plannings" src=""></script>
    <script id="sprint_info" src=""></script>
    <link id="mystyle" rel="stylesheet" type="text/css" href="" />
    <link id="recurringstyle" rel="stylesheet" type="text/css" href="" />
    <link id="scenariostyle" rel="stylesheet" type="text/css" href="" />
    <link id="editor" rel="stylesheet" type="text/css" href="" />
    <script id="scrum_now" src=""></script>
        
    <script type="text/javascript">
    $(document).ready(function() {
        var database = firebase.database();
        var v_controller = database.ref('controller');
        v_controller.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var child_data = childSnapshot.val();
                    version = parseInt(child_data); 
                    var restyled = "css/my_styles.css?v="+version;
                    var recurringcss = "css/recurring_stories.css?v="+version;
                    var scenarioscss = "css/scenarios.css?v="+version;
                    var backlogcss = "css/backlog_status.css?v="+version;
                    var editor = "css/editor.dataTables.css?v="+version;


                    var misc = "src/misc.js?v="+version;
                    var header = "src/header_scripts.js?v="+version;
                    var global_vars = "src/global_vars.js?v="+version;
                    var sprint_plannings = "src/sprint_planning.js?v="+version;
                    var sprint_info = "src/sprint_info.js?v="+version;
                    var datatables = "js/dataTables.editor.js?v="+version;
                    var scrum_now = "src/scrum_now.js?v="+version;

                    $('#mystyle').attr('href',restyled);
                    $('#recurringstyle').attr('href',recurringcss);
                    $('#scenariostyle').attr('href',scenarioscss);
                    $('#backlogstatusstyle').attr('href',backlogcss);
                    $('#editor').attr('href',editor);

                    

                   
                    $.ajax({url: "body.php",async: false , success: function(result){
                       console.log("success");
                        

                                 $.ajax({url: "templates/header1.php", async: false , success: function(result1){
                                 console.log("Result1" + result1);
                                 $("#contentbody").html("<div id='main_screen' class='main_screen'>" + result1 + result );
                                 //$("#scrum_now").attr("src","src/scrum_now.js");


                                 
                                 var header_js = document.createElement("script");
                                 // set the type attribute
                                 header_js.type = "application/javascript";
                                 // make the script element load file
                                 header_js.src = header;
                                 // finally insert the element to the body element in order to load the script
                                 document.body.appendChild(header_js);


                                 //$('#misc').attr('src',misc);
                                 var misc_js = document.createElement("script");
                                 // set the type attribute
                                 misc_js.type = "application/javascript";
                                 // make the script element load file
                                 misc_js.src = misc;
                                 // finally insert the element to the body element in order to load the script
                                 document.body.appendChild(misc_js);

                                 //$('#global_vars').attr('src',global_vars);
                                 var global_vars_js = document.createElement("script");
                                 // set the type attribute
                                 global_vars_js.type = "application/javascript";
                                 // make the script element load file
                                 global_vars_js.src = global_vars;
                                 // finally insert the element to the body element in order to load the script
                                 document.body.appendChild(global_vars_js);

                                 var datatables_js = document.createElement("script");
                                  // set the type attribute
                                  datatables_js.type = "application/javascript";
                                  // make the script element load file
                                  datatables_js.src = datatables;
                                  // finally insert the element to the body element in order to load the script
                                  document.body.appendChild(datatables_js);


                                 
                                 
                                 //$('#sprint_plannings').attr('src',sprint_plannings);
                                 var sprint_plannings_js = document.createElement("script");
                                 // set the type attribute
                                 sprint_plannings_js.type = "application/javascript";
                                 // make the script element load file
                                 sprint_plannings_js.src = sprint_plannings;
                                 // finally insert the element to the body element in order to load the script
                                 document.body.appendChild(sprint_plannings_js);


                                 //$('#sprint_info').attr('src',sprint_info);
                                 //var sprint_info_js = document.createElement("script");
                                 // set the type attribute
                                 //sprint_info_js.type = "application/javascript";
                                 // make the script element load file
                                 //sprint_info_js.src = sprint_info;
                                 // finally insert the element to the body element in order to load the script
                                 //document.body.appendChild(sprint_info_js);

                                 //$('#datatables').attr('src',datatables);
                                 
                                 //$('#scrum_now').attr('src',scrum_now);
                                 var scrumnow_js = document.createElement("script");
                                  // set the type attribute
                                  scrumnow_js.type = "application/javascript";
                                  // make the script element load file
                                  scrumnow_js.src = scrum_now;
                                  // finally insert the element to the body element in order to load the script
                                  setTimeout(function(){document.body.appendChild(scrumnow_js);}, 3000);

                                  $("#current_version").val(version);


                                  




                                 }});

                                  


                    }});
                   

                    
                   
                });
            },
            function(error) {
                console.log("Error: " + error.code);
            });


        });
    
    </script>
</head>
<body id="contentbody">

        
</body>

</html>
