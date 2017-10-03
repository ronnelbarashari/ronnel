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
		        var bestpractice = "features/assets/best_practice_user_stories.js?v="+version;
		        freshStyle(bestpractice);
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
	                        if(child_data.bestpractice == 1) {
	                        	cnt += 1;
	                        	$("ul#feature-list").append('<li id="tab-bestpractice"><a href="#tabs-bestpractice">Best Practices User Stories</a></li>');
					            $("div.features-tab").last().after('<div id="tabs-bestpractice" class="features-tab"><h2></h2><div id="bestpractice-body"></div><div id="bestpractice-text"></div></div>');
					            $("div#script-container").append('<script id="features_teams" src="features/assets/best_practice_user_stories.js"></script>');
					            getLatestAssets();
					            $( "#tabs" ).tabs('refresh');
					            $("label#lbl-bestpractice").addClass('ui-checkboxradio-checked');
					            $("label#lbl-bestpractice").addClass('ui-state-active');
					            $('#chk-bestpractice').prop('checked', true);
	                        }
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
		if(type == "best_practice_user_stories") {
			database.ref('/user/' + key).update(
			{
			   	bestpractice: val
			});
		}
	}
	
	function freshStyle(bestpractice){
		$('#features_bestpractice').attr('src',bestpractice);
	}

	//Tabs
    $( "#tabs" ).tabs();
    $( 'input[type="checkbox"]').checkboxradio({
        icon: false
    });

    $('#chk-bestpractice').bind('change', function(){
        if($(this).is(':checked')){
        	if($("a[href='#tabs-bestpractice']").is(":visible")) {
        	} else {
	            console.log("Best Practice is checked");
	            $("ul#feature-list").append('<li id="tab-bestpractice"><a href="#tabs-bestpractice">Best Practices User Stories</a></li>');
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
    });




});