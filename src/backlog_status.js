

$(document).ready(function(){
	var database = firebase.database();
	
	var donearr = [];
	var inprogressarr = [];
	var todoarr = [];

	var version = 0;

	//added by chela
	var sprintnuminprogarr = [];
	var walkthroughlinkinprogarr = [];
	var sprintnumcheckinprogarr = [];
	var sprintnumcheckdone = [];
	var countlink = 0;
	var countdone = 0;
	var maxsprintnum = 0;

//

	var v_controller = database.ref('controller');
	v_controller.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val();
            version = parseInt(child_data); 
            var backlogstatus_style = "css/backlog_status.css?v="+version;
            var backlog_status = "src/backlog_status.js?v="+version;

            freshStyle(backlogstatus_style, backlog_status);
            $("#current_version").val(version);
        });
    },
    function(error) {
        console.log("Error: " + error.code);
    });
    function freshStyle(backlogstatus_style, backlog_status){
       $('#backlogstatus_style').attr('href',backlogstatus_style);
       $('#backlog_status').attr('src',backlog_status);
    }
	
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
		        if(countdone == 0 || parseInt(child_data.sprint_number) > countdone ) {
		            		countdone = parseInt(child_data.sprint_number);
		            	}
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
		        if(countdone == 0 || parseInt(child_data.sprint_number) > countdone ) {
		            		countdone = parseInt(child_data.sprint_number);
		            	}
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
		if(todoarr.length ==0){
			$("#accordion").css('display', 'none');
			$("#summary_title").html("<h1>Sprint Done</h1><h6>&nbsp &nbsp  No Product backlog</h6>");
		}
		if(donearr.length ==0){
			$(".backlog_completed").html("<h2>Sprint Done</h2><h6>&nbsp &nbsp  No Sprint done</h6>");
		}
		if(inprogressarr.length ==0){
			$(".backlog_in_progress").html("<h2>In Progress</h2><h6>&nbsp &nbsp  No in progress</h6>");
		}

	var sprints = database.ref($('#selected_backlog').val() + '/sprints/');
		        sprints.once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						//console.log(childSnapshot.key);
						var sprintnumstr1 = childSnapshot.key.split("sprint");
						var sprintnuminprogress = childSnapshot.key.split("sprint");
						var child_data = childSnapshot.val();

			            //console.log(child_data);
			            walkthroughlinkinprogarr[countlink]=child_data.walkthrough;
						//console.log	(sprintnumstr);
						//console.log("walkthrough: "+walkthroughlink[countlink]);
						//var sprintwalkthrough = childSnapshot.key.split("walkthrough");
						

						if(parseInt(sprintnumstr1[1]) <= countdone) {
							sprintnuminprogarr.push({
								sprint_num: parseInt(sprintnumstr1[1]),
								walkthrough_link: child_data.walkthrough
							});
						}
						


						
						countlink++;
						//console.log(countlink);
					});
					sprintnumarr.sort(function(a, b){return a.sprint_num-b.sprint_num});
					sprintnuminprogarr.sort(function(a, b){return a.sprint_num-b.sprint_num});
					//console.log(sprintnumprogarr);

					//console.log("max sprint: " + maxsprintnum);

					var min = $('#min_order');
					min.val(parseInt(min.val()));

			        inprogressarr.sort(function(a, b){return a.order-b.order});
			        //console.log(sprintnumarr);
			        for(i=0; i < sprintnuminprogarr.length; i++){
			        	for(j=0; j<donearr.length; j++ ){
			        		if(donearr[j].sprint_num == sprintnuminprogarr[i].sprint_num){
			        			sprintnumcheckdone.push({
			        				sprint_num: sprintnuminprogarr[i].sprint_num,
			        				walkthrough_link: sprintnuminprogarr[i].walkthrough_link,
			        				sprint_check: "true"
			        			});
			        			break;
			        		}
			        	}
			        }

			        for(i=0; i < sprintnuminprogarr.length; i++){
			        	for(j=0; j<inprogressarr.length; j++ ){
			        		if(inprogressarr[j].sprint_num == sprintnuminprogarr[i].sprint_num){
			        			sprintnumcheckinprogarr.push({
			        				sprint_num: sprintnuminprogarr[i].sprint_num,
			        				walkthrough_link: sprintnuminprogarr[i].walkthrough_link,
			        				sprint_check: "true"
			        			});
			        			break;
			        		}
			        	}
			        }


		//console.log("In Progress Stories: " + inprogressarr.length);

		if(donearr.length > 0) { fillDoneStories(donearr,sprintnumcheckdone, "done"); }
		if(todoarr.length > 0) { fillStories(todoarr, "to do"); }
		if(inprogressarr.length > 0) { fillInprogress(inprogressarr, sprintnumcheckinprogarr, "in progress")}

		$( "#accordion" ).accordion({ collapsible: true, active: false, heightStyle: "content" });
		});
	});	
});
function fillDoneStories(donearr,sprintnumcheckdone, status){
	for(i=0; i < sprintnumcheckdone.length; i++){
    	if(sprintnumcheckdone[i].sprint_check == "true"){
    		var string;
    		var totalpts = 0;
 			string = "<h3>Sprint " + sprintnumcheckdone[i].sprint_num + "</h3>";
 			
 			string += "<div class='summary_stories'>";
 			string += "<table class='table_summary'>";
 			string += "<tr>";
 			string += "<th>Story ID</th>";
 			string += "<th>As a</th>";
 			string += "<th>I want</th>";
 			string += "<th>So that</th>";
 			string += "<th>Acceptance Test</th>";
 			string += "<th>Points</th>";
			for( j=0; j<donearr.length; j++ ){
				//console.log(storiesarr[j].sprint_num);
				if(donearr[j].sprint_num == sprintnumcheckdone[i].sprint_num){
					string += "<tr><td>" + donearr[j].storyid + "</td>";
					string += "<td>" + donearr[j].as_a + "</td>";
					string += "<td>" +donearr[j].i_want + "</td>";
					string += "<td>" +donearr[j].so_that + "</td>";
					string += "<td>" +donearr[j].acceptance_test + "</td>";
					string += "<td>" + donearr[j].points + "</td></tr>";
					totalpts += parseInt(donearr[j].points);
				} else {
					continue;
				}
			}
			string += "</table>";
			string += "<p>Total Points: " + totalpts + " "+"</p>";
			if(sprintnumcheckdone[i].walkthrough_link != undefined){
				string += "<p><a href="+sprintnumcheckdone[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
			} else {
				string += "<p>No walkthrough link for this sprint.</p>";
			}
			string += "</div>";
			$("#summary_stories").append(string);
		}
	}
	$( "#summary_stories" ).accordion({ collapsible: true, active: false, heightStyle: "content" });
}
function fillStories(arr, status) {
	var sectiontitle = "Product Backlog";
	if(status == "done") { sectiontitle = "Completed Stories";  }

	var string = "";

	string += "<div class='summary_stories'>";
	string += "<table class='table_summary'>";
	string += "<tr>";
	string += "<th>Story ID</th>";
	//string += "<th>Sprint</th>";
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
		//string += "<td>" + arr[i].sprint_num + "</td>";
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
	if(status == "done") {
		$("#done").append(string);
	}
	//$( "#summary_stories" ).accordion({ collapsible: true, heightStyle: "content" });
	$( "#accordion" ).accordion({ collapsible: true, active: false, heightStyle: "content" });
}

function fillInprogress(inprogressarr, sprintnumcheckinprogarr, status) {
	/*var sectiontitle = "In Progess Stories";
	var checkinprogress = new Array();
	checkinprogress = sprintnumcheckinprogarr;
	for(i=0; i < sprintnumcheckinprogarr.length; i++){
	var string1 = "";

	string1 += "<div class='summary_stories'>";
	string1 += "<table class='table_summary'>";
	string1 += "<tr>";
	string1 += "<th>Story ID</th>";
	string1 += "<th>Sprint</th>";
	string1 += "<th>As a</th>";
	string1 += "<th>I want</th>";
	string1 += "<th>So that</th>";
	string1 += "<th>Acceptance Test</th>";
	string1 += "<th>Points</th>";
	string1 += "</tr>";

	var totalpts = 0;
	for( j=0; j < inprogressarr.length; j++ ) {
	    //var string = "<h3>" + sectiontitle + "</h3>";	
	    if(inprogressarr[j].sprint_num == checkinprogress[i].sprint_num){	
		string1 += "<tr><td>" + inprogressarr[j].storyid + "</td>";
		string1 += "<td>" + inprogressarr[j].sprint_num + "</td>";
		string1 += "<td>" + inprogressarr[j].as_a + "</td>";
		string1 += "<td>" +inprogressarr[j].i_want + "</td>";
		string1 += "<td>" +inprogressarr[j].so_that + "</td>";
		string1 += "<td>" +inprogressarr[j].acceptance_test + "</td>";
		string1 += "<td>"+parseInt(inprogressarr[j].points)+"</td></tr>";

		totalpts += parseInt(inprogressarr[j].points);

	}
	else{
		continue;
	}
	}
	string1 += "</table>";
	string1 += "<p>Total Points: " + totalpts + " "+"</p>";

	//added by chela
	if(checkinprogress[i].walkthrough_link != undefined && checkinprogress[i].walkthrough_link != ""){
		//string += "<p><a href="+sprintnumarr[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
		if((checkinprogress[i].walkthrough_link.indexOf("http") !== -1 || checkinprogress[i].walkthrough_link.indexOf("http://") !== -1)){
			string1 += "<p><a href='"+checkinprogress[i].walkthrough_link+"'>Click this link to view the Walkthrough</a></p>";
		}else{
			string1 += "<p><a href='http://"+checkinprogress[i].walkthrough_link+"'>Click this link to view the Walkthrough</a></p>";
		}
	} else {
		//string += "<p>No walkthrough link for this sprint.</p>";
		string1 += "<p>No walkthrough link for this sprint.</p>";
	}

							//
	string1 += "</div>";

	$("#in_progress").append(string1);
	$( "#accordion" ).accordion({ collapsible: true, heightStyle: "content" })
	}*/
	for(i=0; i < sprintnumcheckinprogarr.length; i++){
	var string1 = "<h3>Sprint " + sprintnumcheckinprogarr[i].sprint_num + "</h3>";
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
	for( j=0; j<inprogressarr.length; j++ ){
		//console.log(storiesarr[j].sprint_num);
		if(inprogressarr[j].sprint_num == sprintnumcheckinprogarr[i].sprint_num){
			string1 += "<tr><td>" + inprogressarr[j].storyid + "</td>";
			string1 += "<td>" + inprogressarr[j].as_a + "</td>";
			string1 += "<td>" +inprogressarr[j].i_want + "</td>";
			string1 += "<td>" +inprogressarr[j].so_that + "</td>";
			string1 += "<td>" +inprogressarr[j].acceptance_test + "</td>";
			string1 += "<td>" + inprogressarr[j].points + "</td></tr>";
			totalpts1 += parseInt(inprogressarr[j].points);
		} else {
			continue;
		}
	}
		string1 += "</table>";

		string1 += "<p>Total Points: " + totalpts1 + " "+"</p>";
		//console.log(sprintnumcheckprogress[i].walkthrough_link);
		if(sprintnumcheckinprogarr[i].walkthrough_link != undefined){
			//string += "<p><a href="+sprintnumarr[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
			if((sprintnumcheckinprogarr[i].walkthrough_link.indexOf("http") !== -1 || sprintnumcheckinprogarr[i].walkthrough_link.indexOf("http://") !== -1)){
				string1 += "<p><a href="+sprintnumcheckinprogarr[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
			}else{
				string1 += "<p><a href=http://"+sprintnumcheckinprogarr[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
			}
		} else {
			//string += "<p>No walkthrough link for this sprint.</p>";
			string1 += "<p>No walkthrough link for this sprint.</p>";
		}
		
		string1 += "</div>";
		
		$("#summary_stories_in_progress").append(string1);
	}
	$( "#summary_stories_in_progress" ).accordion({ collapsible: true, active: false, heightStyle: "content" });

}

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
	  		  	url: "/templates/rocket-email.php",
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


//pop up message for contact the Product Owner;
function deselect(e) {
  $('.pop').slideFadeToggle(function() {
    e.removeClass('selected');
  });    
}

$(function() {
  $('#contact').on('click', function() {
    if($(this).hasClass('selected')) {
      deselect($(this));               
    } else {
      $(this).addClass('selected');
      $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.close-message').on('click', function() {
    deselect($('#contact'));
    $('.notif-submit').css('display', 'none');
    return false;
  });

  $('.messagebtn').on('click', function() {
    $('.notif-submit').css('display', 'none');
  });


});

$.fn.slideFadeToggle = function(easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};
//end pop up message;



//added Melvin for sending message

//end added