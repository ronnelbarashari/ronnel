$(document).ready(function(){
	
$('#user_key').change( function() {  
			if($('#user_key').val() != ""){
				load_scripts();
			}
	});
});





function load_scripts(){
	var database = firebase.database();
	
	var sprintnumarr = [];
	var sprintnumprogarr = [];
	var maxsprintnum = 0;
	var storiesarr = [];
	var storiesinprogressarr = [];
	var countdone =0;
	var countdone1 =0;
	var walkthroughlink = [];
	var walkthroughlinkprogress = [];
	var countlink = 0;
	var sprintnumcheck = [];
	var sprintnumcheckprogress = [];asdqwd
	
   
        var backlogref = database.ref('user/' + $('#user_key').val() +'/selected_backlogs');
          backlogref.once('value').then(function(snapshot) {
               
                   //var key = childSnapshot.key;
                   var child_data = snapshot.val();
                       //0331207 - get only active stories

                        
                      backlog_title = child_data.title;
                      backlog_key =  child_data.key;
                      $('#selected_backlog').val(child_data.key);
                      load_data();
            var ref = database.ref( $('#selected_backlog').val() + '/user_stories/');
            ref.once('value').then(function(snapshot) {
		        snapshot.forEach(function(childSnapshot) {
		            var child_data = childSnapshot.val();
		            //console.log(child_data.storyid);
		            if(child_data.status == "done" && child_data.sprint_number != ""){
		            	storiesarr.push({
		            		sprint_num: child_data.sprint_number,
		            		storyid: child_data.storyid,
		            		as_a: child_data.as_a,
		            		i_want: child_data.i_want,
		            		so_that: child_data.so_that,
		            		acceptance_test: child_data.acceptance_test,
		            		points: child_data.story_points,
		            		order: child_data.order,
		            		status: child_data.status,
		            		key: child_data.key
		            	});
		            	if(countdone == 0 || parseInt(child_data.sprint_number) > countdone ) {
		            		countdone = parseInt(child_data.sprint_number);
		            	}
		            }else if(child_data.status == "in progress" && child_data.sprint_number != ""){
		            	storiesinprogressarr.push({
		            		sprint_num: child_data.sprint_number,
		            		storyid: child_data.storyid,
		            		as_a: child_data.as_a,
		            		i_want: child_data.i_want,
		            		so_that: child_data.so_that,
		            		acceptance_test: child_data.acceptance_test,
		            		points: child_data.story_points,
		            		order: child_data.order,
		            		status: child_data.status,
		            		key: child_data.key
		            	});
		            	if(countdone1 == 0 || parseInt(child_data.sprint_number) > countdone1 ) {
		            		countdone1 = parseInt(child_data.sprint_number);
		            	}
		            }
		        });
				//console.log(storiesinprogressarr);
				var sprints = database.ref($('#selected_backlog').val() + '/sprints/');
		        sprints.once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						//console.log(childSnapshot.key);
						var sprintnumstr = childSnapshot.key.split("sprint");
						var sprintnumstr1 = childSnapshot.key.split("sprint");
						var sprintnuminprogress = childSnapshot.key.split("sprint");
						var child_data = childSnapshot.val();

			            //console.log(child_data);
			            walkthroughlink[countlink]=child_data.walkthrough;
						//console.log	(sprintnumstr);
						//console.log("walkthrough: "+walkthroughlink[countlink]);
						//var sprintwalkthrough = childSnapshot.key.split("walkthrough");
						
						if(parseInt(sprintnumstr[1]) <= countdone) {
							sprintnumarr.push({
								sprint_num: parseInt(sprintnumstr[1]),
								walkthrough_link: child_data.walkthrough
							});
						}

						if(parseInt(sprintnumstr1[1]) <= countdone1) {
							sprintnumprogarr.push({
								sprint_num: parseInt(sprintnumstr[1]),
								walkthrough_link: child_data.walkthrough
							});
						}
						


						
						countlink++;
						//console.log(countlink);
					});

					sprintnumarr.sort(function(a, b){return a.sprint_num-b.sprint_num});
					sprintnumprogarr.sort(function(a, b){return a.sprint_num-b.sprint_num});
					//console.log(sprintnumprogarr);
					maxsprintnum = Math.max.apply(Math, sprintnumarr);
					//console.log("max sprint: " + maxsprintnum);

					var min = $('#min_order');
					min.val(parseInt(min.val()));

			        storiesarr.sort(function(a, b){return a.order-b.order});
			        storiesinprogressarr.sort(function(a, b){return a.order-b.order});
			        //console.log(sprintnumarr);

			        for(i=0; i < sprintnumarr.length; i++){
			        	for(j=0; j<storiesarr.length; j++ ){
			        		if(storiesarr[j].sprint_num == sprintnumarr[i].sprint_num){
			        			sprintnumcheck.push({
			        				sprint_num: sprintnumarr[i].sprint_num,
			        				walkthrough_link: sprintnumarr[i].walkthrough_link,
			        				sprint_check: "true"
			        			});
			        			break;
			        		}
			        	}
			        }

			        for(i=0; i < sprintnumprogarr.length; i++){
			        	for(j=0; j<storiesinprogressarr.length; j++ ){
			        		if(storiesinprogressarr[j].sprint_num == sprintnumprogarr[i].sprint_num){
			        			sprintnumcheckprogress.push({
			        				sprint_num: sprintnumprogarr[i].sprint_num,
			        				walkthrough_link: sprintnumprogarr[i].walkthrough_link,
			        				sprint_check: "true"
			        			});
			        			break;
			        		}
			        	}
			        }



			        //for( i=0; i < sprintnumarr.length; i++ ){
		        	for(i=0; i < sprintnumcheck.length; i++){
				        	if(sprintnumcheck[i].sprint_check == "true"){
				        		var string;
				        		var totalpts = 0;
					 			string = "<h3>Sprint " + sprintnumcheck[i].sprint_num + "</h3>";
					 			
					 			string += "<div class='summary_stories'>";
					 			string += "<table class='table_summary'>";
					 			string += "<tr>";
					 			string += "<th>Story ID</th>";
					 			string += "<th>As a</th>";
					 			string += "<th>I want</th>";
					 			string += "<th>So that</th>";
					 			string += "<th>Acceptance Test</th>";
					 			string += "<th>Points</th>";
								for( j=0; j<storiesarr.length; j++ ){
									//console.log(storiesarr[j].sprint_num);
									if(storiesarr[j].sprint_num == sprintnumcheck[i].sprint_num){
										string += "<tr><td>" + storiesarr[j].storyid + "</td>";
										string += "<td>" + storiesarr[j].as_a + "</td>";
										string += "<td>" +storiesarr[j].i_want + "</td>";
										string += "<td>" +storiesarr[j].so_that + "</td>";
										string += "<td>" +storiesarr[j].acceptance_test + "</td>";
										string += "<td>" + storiesarr[j].points + "</td></tr>";
										totalpts += parseInt(storiesarr[j].points);
									} else {
										continue;
									}
								}
								string += "</table>";
								string += "<p>Total Points: " + totalpts + " "+"</p>";
								if(sprintnumcheck[i].walkthrough_link != undefined){
									string += "<p><a href="+sprintnumcheck[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
								} else {
									string += "<p>No walkthrough link for this sprint.</p>";
								}
								string += "</div>";
								$("#summary_stories").append(string);
							}
						}

						for(i=0; i < sprintnumcheckprogress.length; i++){
							var string1 = "<h3>Sprint " + sprintnumcheckprogress[i].sprint_num + "</h3>";
				 			var totalpts1 = 0;
				 			string1 += "<div class='summary_stories_in_progress'>";
				 			string1 += "<table class='table_summary'>";
				 			string1 += "<tr>";
				 			string1 += "<th>Story ID</th>";
				 			string1 += "<th>As a</th>";
				 			string1 += "<th>I want</th>";
				 			string1 += "<th>So that</th>";
				 			string1 += "<th>Acceptance Test</th>";
				 			string1 += "<th>Points</th>";
							for( j=0; j<storiesinprogressarr.length; j++ ){
								//console.log(storiesarr[j].sprint_num);
								if(storiesinprogressarr[j].sprint_num == sprintnumcheckprogress[i].sprint_num){
									string1 += "<tr><td>" + storiesinprogressarr[j].storyid + "</td>";
									string1 += "<td>" + storiesinprogressarr[j].as_a + "</td>";
									string1 += "<td>" +storiesinprogressarr[j].i_want + "</td>";
									string1 += "<td>" +storiesinprogressarr[j].so_that + "</td>";
									string1 += "<td>" +storiesinprogressarr[j].acceptance_test + "</td>";
									string1 += "<td>" + storiesinprogressarr[j].points + "</td></tr>";
									totalpts1 += parseInt(storiesinprogressarr[j].points);
								} else {
									continue;
								}
							}
							string1 += "</table>";
					
							string1 += "<p>Total Points: " + totalpts1 + " "+"</p>";
							//console.log(sprintnumcheckprogress[i].walkthrough_link);
							if(sprintnumcheckprogress[i].walkthrough_link != undefined){
								//string += "<p><a href="+sprintnumarr[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
								if((sprintnumcheckprogress[i].walkthrough_link.indexOf("http") !== -1 || sprintnumcheckprogress[i].walkthrough_link.indexOf("http://") !== -1)){
									string1 += "<p><a href="+sprintnumcheckprogress[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
								}else{
									string1 += "<p><a href=http://"+sprintnumcheckprogress[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
								}
							} else {
								//string += "<p>No walkthrough link for this sprint.</p>";
								string1 += "<p>No walkthrough link for this sprint.</p>";
							}
							
							string1 += "</div>";
							
							$("#summary_stories_in_progress").append(string1);
						}
					
						
				    $( "#summary_stories" ).accordion({ collapsible: true, heightStyle: "content" });
				    $( "#summary_stories_in_progress" ).accordion({ collapsible: true, heightStyle: "content" });
				});
		    });
          });
    
    var dropdown = '<span>Selected Backlog: <select id=\"select_backlog\" >';
    var dropdown1 = '<span>Selected Backlog: <select id=\"select_backlog\" >';
    
    dropdown += '</select></span>';
    dropdown1 += '</select></span>';
    $(dropdown).insertAfter('#summary_title');
    $(dropdown1).insertAfter('#summary_title_in_progress');

    
    get_currentuser_backlogs($("#user_key").val(),"#select_backlog");
    $(document).on('change', '#select_backlog',function () {
   // $('#select_backlog').on('change', function () {
    var database = firebase.database();
    database.ref('user/' + $('#user_key').val() +'/selected_backlogs').set(
    {
      title: this.options[this.selectedIndex].text,
      key: this.options[this.selectedIndex].value
      });           


    window.location.href = "/backlog_summary.php"
					
      });
    
}