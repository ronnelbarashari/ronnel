$(document).ready(function(){
	var database = firebase.database();
	
	var donearr = [];
	var inprogressarr = [];
	var todoarr = [];
	
    var ref = database.ref( $('#selected_backlog').val() + '/user_stories/');
    ref.once('value').then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var child_data = childSnapshot.val();
		    
		    if(child_data.status == "done"){
		    	donearr.push({
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
		    }

		    if(child_data.status == "in progress"){
		    	inprogressarr.push({
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
		    }

		    if(child_data.status == "to do" || child_data.status == ""){
		    	todoarr.push({
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
		    }
		});

		console.log("In Progress Stories: " + inprogressarr.length);

		if(donearr.length > 0) { fillStories(donearr, "done"); }
		if(inprogressarr.length > 0) { fillStories(inprogressarr, "in progress"); }
		if(todoarr.length > 0) { fillStories(todoarr, "to do"); }

		$( "#accordion" ).accordion({ collapsible: true, heightStyle: "content" });
	});	
});

function fillStories(arr, status) {
	var sectiontitle = "Product Backlog";
	if(status == "in progress") { sectiontitle = "Stories In Progress";  }
	if(status == "done") { sectiontitle = "Completed Stories";  }
	var string = "";

	string += "<div class='summary_stories'>";
	string += "<table class='table_summary'>";
	string += "<tr>";
	string += "<th>Story ID</th>";
	string += "<th>Sprint</th>";
	string += "<th>As a</th>";
	string += "<th>I want</th>";
	string += "<th>So that</th>";
	string += "<th>Acceptance Test</th>";
	string += "<th>Points</th>";
	string += "</tr>";

	var totalpts = 0;
	for( i=0; i < arr.length; i++ ) {
	    //var string = "<h3>" + sectiontitle + "</h3>";		
		string += "<tr><td>" + arr[i].storyid + "</td>";
		string += "<td>" + arr[i].sprint_num + "</td>";
		string += "<td>" + arr[i].as_a + "</td>";
		string += "<td>" +arr[i].i_want + "</td>";
		string += "<td>" +arr[i].so_that + "</td>";
		string += "<td>" +arr[i].acceptance_test + "</td>";

		if(parseInt(arr[i].points)) {
			points = arr[i].points;
		} else {
			points = 0;
		}
		string += "<td>" + points + "</td></tr>";
		totalpts += parseInt(points);
	}
	string += "</table>";
	string += "<p>Total Points: " + totalpts + " "+"</p>";
	string += "</div>";

	if(status == "to do" || status == "") {
		$("#product_backlog").append(string);
	}
	if(status == "in progress") {
		$("#in_progress").append(string);
	}
	if(status == "done") {
		$("#done").append(string);
	}
	//$( "#summary_stories" ).accordion({ collapsible: true, heightStyle: "content" });
	$( "#accordion" ).accordion({ collapsible: true, heightStyle: "content" });
}