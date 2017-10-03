$( function() {

	getLatestAssets();
	function getLatestAssets() {
		//Assets version
		var database = firebase.database();
		var v_controller = database.ref('controller');
		v_controller.once('value').then(function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		        var child_data = childSnapshot.val();
		        version = parseInt(child_data); 
		        var features = "features/assets/features.js?v="+version;
		        var scenarios = "features/assets/scenarios.js?v="+version;
		        var recurring_stories = "features/assets/recurring_stories.js?v="+version;
		        var scrum_violations = "features/assets/scrum_violations.js?v="+version;
		        var permission = "features/assets/permission.js?v="+version;
		        //var backlogs = "features/assets/backlogs.js?v="+version;
		        var pointsdefinition = "features/assets/pointsdefinition.js?v="+version;
		        //var teams = "features/assets/teams.js?v="+version;
		        var bestpractice = "features/assets/best_practice_user_stories.js?v="+version;

		        freshStyle(features, scenarios, recurring_stories, scrum_violations, permission,pointsdefinition);
		        $("#current_version").val(version);
		    });
		},
		function(error) {
		    console.log("Error: " + error.code);
		});
	}

	getEnabledFeatures();




	function getEnabledFeatures() {
		var database = firebase.database();
		var user_features = database.ref('user');
		user_features.once('value').then(function(snapshot) {
                var cnt = 0;
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var child_data = childSnapshot.val();
                    
                    //added check if user is logged in
            		if(firebase.auth().currentUser != null) {
	                    if(child_data.email == firebase.auth().currentUser.email) {
	                    	$("#user_key").val(key);
	                        if(child_data.scenarios == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-scenarios"><a href="#tabs-scenarios">Reusable Epics</a></li>');
	                        	console.log("close other js");
					            $("div.features-tab").last().after('<div id="tabs-scenarios" class="features-tab"><h2 id="scenario-title"></h2><div id="scenarios-body"></div></div>');
					        	$("div#script-container").append('<script id="features_scenarios" src="features/assets/scenarios.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-scenarios").addClass('ui-checkboxradio-checked');
					            $("label#lbl-scenarios").addClass('ui-state-active');
					            $('#chk-scenarios').prop('checked', true);

	                        }
	                        if(child_data.recurring_stories == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-recurring"><a href="#tabs-recurring">Recurring Stories</a></li>');
					            $("div.features-tab").last().after('<div id="tabs-recurring" class="features-tab"><h2></h2><div id="recurring-body"></div></div>');
					            $("div#script-container").append('<script id="features_recurringstories" src="features/assets/recurring_stories.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-recurring").addClass('ui-checkboxradio-checked');
					            $("label#lbl-recurring").addClass('ui-state-active');
					            $('#chk-recurring').prop('checked', true);
	                        }
	                        if(child_data.scrum_violations == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-violations"><a href="#tabs-violations">Scrum Violations</a></li>');
					            $("div.features-tab").last().after('<div id="tabs-violations" class="features-tab"><h2></h2><div id="violations-body"></div><div id="violations-text"></div></div>');
					            $("div#script-container").append('<script id="features_scrumviolations" src="features/assets/scrum_violations.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-violations").addClass('ui-checkboxradio-checked');
					            $("label#lbl-violations").addClass('ui-state-active');
					            $('#chk-violations').prop('checked', true);
	                        }
	                        if(child_data.permission == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-permission"><a href="#tabs-permission">Plugin Permissions</a></li>');
					            $("div.features-tab").last().after('<div id="tabs-permission" class="features-tab"><h2></h2><div id="permission-body"></div><div id="permission-text"></div></div>');
					            $("div#script-container").append('<script id="features_permission" src="features/assets/permission.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-permission").addClass('ui-checkboxradio-checked');
					            $("label#lbl-permission").addClass('ui-state-active');
					            $('#chk-permission').prop('checked', true);
	                        }
	                        /*if(child_data.scrum_backlogs == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-backlogs"><a href="#tabs-backlogs">Backlogs</a></li>');
					            $("div.features-tab").last().after('<div id="tabs-backlogs" class="features-tab"><h2></h2><div id="backlogs-body"></div><div id="backlogs-text"></div></div>');
					            $("div#script-container").append('<script id="features_backlogs" src="features/assets/backlogs.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-backlogs").addClass('ui-checkboxradio-checked');
					            $("label#lbl-backlogs").addClass('ui-state-active');
					            $('#chk-backlogs').prop('checked', true);
	                        }*/
	                        if(child_data.pointsdefinition == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-pointsdefinition"><a href="#tabs-pointsdefinition">Points Description</a></li>');
					            $("div.features-tab").last().after('<div id="tabs-pointsdefinition" class="features-tab"><h2></h2><div id="pointsdefinition-body"></div><div id="pointsdefinition-text"></div></div>');
					            $("div#script-container").append('<script id="features_pointsdefinition" src="features/assets/pointsdefinition.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-pointsdefinition").addClass('ui-checkboxradio-checked');
					            $("label#lbl-pointsdefinition").addClass('ui-state-active');
					            $('#chk-pointsdefinition').prop('checked', true);
	                        }
	                        /*if(child_data.teams == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-teams"><a href="#tabs-teams">Manage Teams / Permissions</a></li>');
					            $("div.features-tab").last().after('<div id="tabs-teams" class="features-tab"><h2></h2><div id="teams-body"></div><div id="teams-text"></div></div>');
					            $("div#script-container").append('<script id="features_teams" src="features/assets/teams.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-teams").addClass('ui-checkboxradio-checked');
					            $("label#lbl-teams").addClass('ui-state-active');
					            $('#chk-teams').prop('checked', true);
	                        } */
	                        /*if(child_data.bestpractice == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-bestpractice"><a href="#tabs-bestpractice">Best Practice User Stories</a></li>');
					            $("div.features-tab").last().after('<div id="tabs-bestpractice" class="features-tab"><h2></h2><div id="bestpractice-body"></div><div id="bestpractice-text"></div></div>');
					            $("div#script-container").append('<script id="features_teams" src="features/assets/best_practice_user_stories.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-bestpractice").addClass('ui-checkboxradio-checked');
					            $("label#lbl-bestpractice").addClass('ui-state-active');
					            $('#chk-bestpractice').prop('checked', true);
	                        }*/
	                    } 
                	}
                });

                if(cnt == 0) {
                    console.log("No user feature is enabled.");
                }

                if($('#tabs-scenarios').css('aria-hidden','false')){
					console.log("close other js");
				}

            });
	}





	function updateFeature(key, type, val) {
		var database = firebase.database();
		if(type == "scenarios") {
			database.ref('/user/' + key).update(
			{
			   	scenarios: val
			});
		}
		if(type == "recurring_stories") {
			database.ref('/user/' + key).update(
			{
			   	recurring_stories: val
			});
		}
		if(type == "scrum_violations") {
			database.ref('/user/' + key).update(
			{
			   	scrum_violations: val
			});
		}
		if(type == "permission") {
			database.ref('/user/' + key).update(
			{
			   	permission: val
			});
		}
		/*if(type == "scrum_backlogs") {
			database.ref('/user/' + key).update(
			{
			   	scrum_backlogs: val
			});
		}*/
		if(type == "pointsdefinition") {
			database.ref('/user/' + key).update(
			{
			   	pointsdefinition: val
			});
		}
		/*if(type == "teams") {
			database.ref('/user/' + key).update(
			{
			   	teams: val
			});
		} */
		/*if(type == "best_practice_user_stories") {
			database.ref('/user/' + key).update(
			{
			   	bestpractice: val
			});
		}*/
	}
	
	function freshStyle(features, scenarios, recurring_stories, scrum_violations, permission,pointsdefinition){
		$('#features').attr('src',features);
		$('#features_scenarios').attr('src',scenarios);
		$('#features_recurringstories').attr('src',recurring_stories);
		$('#features_scrumviolations').attr('src',scrum_violations);
		$('#features_permission').attr('src',permission);
		//$('#features_backlogs').attr('src',backlogs);
		$('#features_pointsdefinition').attr('src',pointsdefinition);
		//$('#features_teams').attr('src',teams);
		/*$('#features_bestpractice').attr('src',bestpractice);*/
	}

	//Tabs
    $( "#tabs" ).tabs();
    $( 'input[type="checkbox"]').checkboxradio({
        icon: false
    });
    $('#chk-recurring').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-recurring']").is(":visible")) {
        	} else {
        		console.log("Recurring is checked");
	            $("ul#feature-list").append('<li id="tab-recurring"><a href="#tabs-recurring">Recurring Stories</a></li>');
	            $("div.features-tab").last().after('<div id="tabs-recurring" class="features-tab"><h2></h2><div id="recurring-body"></div></div>');
	            $("div#script-container").append('<script id="features_recurringstories" src="features/assets/recurring_stories.js"></script>');
	            getLatestAssets();
	            $( "#tabs" ).tabs('refresh');
	            updateFeature($("#user_key").val(), "recurring_stories", 1);
	
        	}
        } else {
            console.log("Recurring is unchecked");
            $("#tabs-recurring").remove();
            $("#tab-recurring").remove();
            $("a[href='#tabs-recurring']").closest("li").remove();
            $( "#tabs" ).tabs('refresh');
            $("#features_recurringstories").remove();
            updateFeature($("#user_key").val(), "recurring_stories", 0);
        }
    });
    $('#chk-scenarios').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-scenarios']").is(":visible")) {
        	} else {
	            console.log("Reusable Epics is checked");
	            $("ul#feature-list").append('<li id="tab-scenarios"><a href="#tabs-scenarios">Reusable Epics</a></li>');
	            $("div.features-tab").last().after('<div id="tabs-scenarios" class="features-tab"><h2 id="scenario-title"></h2><div id="scenarios-body"></div></div>');
	            $("div#script-container").append('<script id="features_scenarios" src="features/assets/scenarios.js"></script>');
	            getLatestAssets();
	            $( "#tabs" ).tabs('refresh');
	            updateFeature($("#user_key").val(), "scenarios", 1);

	   
	        }
        } else {
            console.log("Scenarios is unchecked");
            $("#tabs-scenarios").remove();
            $("#tab-scenarios").remove();
            $("a[href='#tabs-scenarios']").closest("li").remove();
            $( "#tabs" ).tabs('refresh');
            $("#features_scenarios").remove();
            updateFeature($("#user_key").val(), "scenarios", 0);

        }
    });
    $('#chk-violations').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-violations']").is(":visible")) {
        	} else {
	            console.log("Violations is checked");
	            $("ul#feature-list").append('<li id="tab-violations"><a href="#tabs-violations">Scrum Violations</a></li>');
	            $("div.features-tab").last().after('<div id="tabs-violations" class="features-tab"><h2></h2><div id="violations-body"></div><div id="violations-text"></div></div>');
	             $("div#script-container").append('<script id="features_scrumviolations" src="features/assets/scrum_violations.js"></script>');
	            getLatestAssets();
	            $( "#tabs" ).tabs('refresh');
	            updateFeature($("#user_key").val(), "scrum_violations", 1);
	        }
        } else {
            console.log("Violations is unchecked");
            $("#tabs-violations").remove();
            $("#tab-violations").remove();
            $("a[href='#tabs-violations']").closest("li").remove();
            $( "#tabs" ).tabs('refresh');
            $("#features_scrumviolations").remove();
            updateFeature($("#user_key").val(), "scrum_violations", 0);
        }
    });
    $('#chk-permission').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-permission']").is(":visible")) {
        	} else {
	            console.log("Permission is checked");
	            $("ul#feature-list").append('<li id="tab-permission"><a href="#tabs-permission">Plugin Permission</a></li>');
	            $("div.features-tab").last().after('<div id="tabs-permission" class="features-tab"><h2></h2><div id="permission-body"></div><div id="permission-text"></div></div>');
	             $("div#script-container").append('<script id="features_permission" src="features/assets/permission.js"></script>');
	            getLatestAssets();
	            $( "#tabs" ).tabs('refresh');
	            updateFeature($("#user_key").val(), "permission", 1);
	        }
        } else {
            console.log("Permission is unchecked");
            $("#tabs-permission").remove();
            $("#tab-permission").remove();
            $("a[href='#tabs-permission']").closest("li").remove();
            $( "#tabs" ).tabs('refresh');
            $("#features_permission").remove();
            updateFeature($("#user_key").val(), "permission", 0);
        }
    });

	/*$('#chk-backlogs').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-backlogs']").is(":visible")) {
        	} else {
	            console.log("Backlogs is checked");
	            $("ul#feature-list").append('<li id="tab-backlogs"><a href="#tabs-backlogs">Backlogs</a></li>');
	            $("div.features-tab").last().after('<div id="tabs-backlogs" class="features-tab"><h2></h2><div id="backlogs-body"></div><div id="backlogs-text"></div></div>');
	             $("div#script-container").append('<script id="features_backlogs" src="features/assets/backlogs.js"></script>');
	            getLatestAssets();
	            $( "#tabs" ).tabs('refresh');
	            updateFeature($("#user_key").val(), "scrum_backlogs", 1);
	      
	        }
        } else {
            console.log("Backlogs is unchecked");
            $("#tabs-backlogs").remove();
            $("#tab-backlogs").remove();
            $("a[href='#tabs-backlogs']").closest("li").remove();
            $( "#tabs" ).tabs('refresh');
            $("#features_backlogs").remove();
            updateFeature($("#user_key").val(), "scrum_backlogs", 0);



        }
    });*/


	$('#chk-pointsdefinition').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-pointsdefinition']").is(":visible")) {
        	} else {
	            console.log("Points Definition is checked");
	            $("ul#feature-list").append('<li id="tab-pointsdefinition"><a href="#tabs-pointsdefinition">Points Description</a></li>');
	            $("div.features-tab").last().after('<div id="tabs-pointsdefinition" class="features-tab"><h2></h2><div id="pointsdefinition-body"></div><div id="pointsdefinition-text"></div></div>');
	             $("div#script-container").append('<script id="features_pointsdefinition" src="features/assets/pointsdefinition.js"></script>');
	            getLatestAssets();
	            $( "#tabs" ).tabs('refresh');
	            updateFeature($("#user_key").val(), "pointsdefinition", 1);

	        }
        } else {
            console.log("Points Definition is unchecked");
            $("#tabs-pointsdefinition").remove();
            $("#tab-pointsdefinition").remove();
            $("a[href='#tabs-pointsdefinition']").closest("li").remove();
            $( "#tabs" ).tabs('refresh');
            $("#features_pointsdefinition").remove();
            updateFeature($("#user_key").val(), "pointsdefinition", 0);



        }
    });

    /*$('#chk-teams').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-teams']").is(":visible")) {
        	} else {
	            console.log("Teams is checked");
	            $("ul#feature-list").append('<li id="tab-teams"><a href="#tabs-teams">Manage Teams / Permissions</a></li>');
	            $("div.features-tab").last().after('<div id="tabs-teams" class="features-tab"><h2></h2><div id="teams-body"></div><div id="teams-text"></div></div>');
	             $("div#script-container").append('<script id="features_teams" src="features/assets/teams.js"></script>');
	            getLatestAssets();
	            $( "#tabs" ).tabs('refresh');
	            updateFeature($("#user_key").val(), "teams", 1);

	        }
        } else {
            console.log("Teams is unchecked");
            $("#tabs-teams").remove();
            $("#tab-teams").remove();
            $("a[href='#tabs-teams']").closest("li").remove();
            $( "#tabs" ).tabs('refresh');
            $("#features_teams").remove();
            updateFeature($("#user_key").val(), "teams", 0);



        }
    }); */

    /*$('#chk-bestpractice').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-bestpractice']").is(":visible")) {
        	} else {
	            console.log("Best Practice is checked");
	            $("ul#feature-list").append('<li id="tab-bestpractice"><a href="#tabs-bestpractice">Best Practice User Stories</a></li>');
	            $("div.features-tab").last().after('<div id="tabs-bestpractice" class="features-tab"><h2></h2><div id="bestpractice-body"></div><div id="bestpractice-text"></div></div>');
	             $("div#script-container").append('<script id="features_bestpractice" src="features/assets/best_practice_user_stories.js"></script>');
	            getLatestAssets();
	            $( "#tabs" ).tabs('refresh');
	            updateFeature($("#user_key").val(), "best_practice_user_stories", 1);

	        }
        } else {
            console.log("Best Practice is unchecked");
            $("#tabs-bestpractice").remove();
            $("#tab-bestpractice").remove();
            $("a[href='#tabs-bestpractice']").closest("li").remove();
            $( "#tabs" ).tabs('refresh');
            $("#features_teams").remove();
            updateFeature($("#user_key").val(), "best_practice_user_stories", 0);



        }
    });*/




});