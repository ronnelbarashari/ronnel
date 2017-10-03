var sprintnumarr = [];
var maxsprintnum = 0;
var storiesarr = [];
var countdone =0;
var walkthroughlink = [];
var countlink = 0;
var sprintwalkthroughnumber = 0;
var sprint_end_date="";
var sprint_start_date="";
var backlog_title_data, sprint_start_date_data, sprint_end_date_data,sprint_num_walkthrough_data;
var storiesarr_object = [];
var storiesarr_data = [];

$(document).ready(function(){
	$('#user_key').change( function() {  
			if($('#user_key').val() != ""){
				load_scripts();
			}
	});

    	
 });

function load_scripts(){
	var database = firebase.database();
	var backlog_title=$("#select_backlog option:selected").text();
	var sprint_num_walkthrough=0;
	

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
		            if(child_data.status == "in progress" && child_data.sprint_number != ""){
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
		            }
		        });
				
				var sprints = database.ref($('#selected_backlog').val() + '/sprints/');
		        sprints.once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						//console.log(childSnapshot.key);
						var sprintnumstr = childSnapshot.key.split("sprint");
						var child_data = childSnapshot.val();

			            walkthroughlink[countlink]=child_data.walkthrough;
						
						var sprintwalkthrough = childSnapshot.key.split("walkthrough");
						
						if(parseInt(sprintnumstr[1]) == countdone) {
							sprintnumarr.push({
								sprint_num: parseInt(sprintnumstr[1]),
								walkthrough_link: child_data.walkthrough
							});
				            sprint_end_date=child_data.sprint_end_date;
				            sprint_start_date=child_data.sprint_start_date;
						}
						//countlink++;
						//console.log(countlink);
					});
					sprintnumarr.sort(function(a, b){return a.sprint_num-b.sprint_num});
					//console.log(sprintnumarr);
					maxsprintnum = Math.max.apply(Math, sprintnumarr);
					//console.log("max sprint: " + maxsprintnum);

					var min = $('#min_order');
					min.val(parseInt(min.val()));

			        storiesarr.sort(function(a, b){return a.order-b.order});
			        var sprintstartdate=new Date(sprint_start_date);
			        var sprintenddate=new Date(sprint_end_date);

			        for( i=0; i < sprintnumarr.length; i++ ){
			        	//console.log(sprintnumarr[i].key);
			        	//console.log(sprintnumarr[i].sprint_num);
			        	//console.log("Sprint Summary");
						backlog_title_data = backlog_title;
			        	sprint_start_date_data = sprintstartdate.toDateString();
			        	sprint_end_date_data = sprintenddate.toDateString();
			        	sprint_num_walkthrough_data = sprintnumarr[i].sprint_num;

			        	sprint_num_walkthrough=sprintnumarr[i].sprint_num;
			 			var string = "<h3>Sprint " + sprintnumarr[i].sprint_num + "</h3>";
			 			var totalpts = 0;
			 			string += "<div class='summary_stories-"+i+"'>";
			 			string += "<div class='sprint_stories-"+i+"'> <font face='calibri'>";
			 			string += "<h1>" + backlog_title + "</h1>";
			 			string += "<table style='margin-bottom: -3%;margin-top: -3%; margin-left: -1.2%;'> <tr> <td style='border:0px; font-family:calibri;'> <h4> Start Date: " + sprintstartdate.toDateString() + "</h4> </td>";
			 			string += "<td style='border:0px;font-family:calibri;text-align:right;'> <h4> End Date: " + sprintenddate.toDateString() + "</h4> </td> </tr> </table>";
			 			string += "<h3>Sprint " + sprint_num_walkthrough + " Walkthrough</h3> </font>";
			 			string += "<table class='table_summary'>";
			 			string += "<tr>";
			 			string += "<th id='walkthroughtitle' class='storyth'>Story ID</th>";
			 			string += "<th id='walkthroughtitle'>As a</th>";
			 			string += "<th id='walkthroughtitle'>I want</th>";
			 			string += "<th id='walkthroughtitle'>So that</th>";
			 			string += "<th id='walkthroughtitle'>Acceptance Test</th>";
			 			string += "<th id='walkthroughtitle'>Points</th>";
						for( j=0; j<storiesarr.length; j++ ){
							//console.log(storiesarr[j].sprint_num);
							if(storiesarr[j].sprint_num == sprintnumarr[i].sprint_num){
								storiesarr_object = {"ID" : storiesarr[j].storyid, "As_a" : storiesarr[j].as_a, "I_want" : storiesarr[j].i_want, "So_that" : storiesarr[j].so_that, "Acc_test" : storiesarr[j].acceptance_test, "Points" : storiesarr[j].points, "screenshot" : "Screenshot", "details" : "Details", "a" : ""};
								storiesarr_data.push(storiesarr_object);
								string += "<tr><td id='walkthroughbacklog'>" + storiesarr[j].storyid + "</td>";
								string += "<td id='walkthroughbacklog'>" + storiesarr[j].as_a + "</td>";
								string += "<td id='walkthroughbacklog'>" +storiesarr[j].i_want + "</td>";
								string += "<td id='walkthroughbacklog'>" +storiesarr[j].so_that + "</td>";
								string += "<td id='walkthroughbacklog'>" +storiesarr[j].acceptance_test + "</td>";
								string += "<td id='walkthroughbacklog'>" + storiesarr[j].points + "</td></tr>";
								string += "<tr><td colspan='3' id='walkthroughtitle'><center>Screen Shots</center></td>";
								string += "<td colspan='3' id='walkthroughtitle'><center>Details</center></td></tr>";
								string += "<tr><td colspan='3'>&nbsp</td>";
								string += "<td colspan='3'>&nbsp</td></tr>";
								totalpts += parseInt(storiesarr[j].points);
							} else {
								continue;
							}
						}

						sprints.once('value').then(function(snapshot) {
			                    snapshot.forEach(function(childSnapshot) {
			                    var child_data = childSnapshot.val();					
			                });	
			            });

						string += "</table>";
						string += "</div>";
						string += "<p>Total Points: " + totalpts + " "+"</p>";
						/*if(sprintnumarr[i].walkthrough_link != undefined){
							string += "<p><a href="+sprintnumarr[i].walkthrough_link+">Click this link to view the Walkthrough</a></p>";
						} else {
							string += "<p>No walkthrough link for this sprint.</p>";
						}*/
						string += "<p><a href='#/' id='export-"+i+"'>Export Walkthrough</a></p>";
						//string += "<p><button id='export-"+i+"'>Export Walkthrough</button></p>";
						string += "</div>";
						$("#summary_stories").append(string);
					}
				    $( "#summary_stories" ).accordion({ collapsible: true, heightStyle: "content" });
				});
		    });
          });
	$(document).on('click', 'a',function(){
		//$(".table_summary").wordExport();
		var thisID = parseInt($(this).attr('id').replace(/[^\d]/g, ''), 10);
		function loadFile(url,callback){
		        JSZipUtils.getBinaryContent(url,callback);
	    }
		loadFile("ForTemplates/walkthrough-template.docx",function(error,content){
        if (error) { throw error };
        var zip = new JSZip(content);
        var doc=new Docxtemplater().loadZip(zip);

		var html = $('.sprint_stories-'+thisID).html();
		var designcontent= '<style>' +
	     '@page sprint_stories{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
	     'div.sprint_stories-'+ thisID +'{page: sprint_stories;}' +
	     'table.table_summary{border: 1px solid;text-align: center;}'+
	     '.table_summary th, td {border: 1px solid;padding: 1%;width: 10%;}'+
	     '.storyth{width:3%;}'+
	     '#walkthroughbacklog {background-color: yellow;}'+
	     '#walkthroughtitle {background-color: #D3D3D3;}'+
	     '</style>';
      var exportx = htmlDocx.asBlob("<!DOCTYPE...> <html>"+designcontent+html+"</html>", {type:""});
        doc.setData({
        	"backlog" : backlog_title_data,
        	"startdate" : sprint_start_date_data,
        	"enddate" : sprint_end_date_data,
        	"sprintnumber" : sprint_num_walkthrough_data,
             "stories": storiesarr_data
        });

        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
        }
        catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({error: e}));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw error;
        }

        var out=doc.getZip().generate({
            type:"blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }) 
        saveAs(out, backlog_title +' Sprint '+sprint_num_walkthrough+'.docx');
    })
	});

	function export2Word(id) {
	   var html, link, blob, url, css;

	   /*css = (
	     '<style>' +
	     '@page sprint_stories{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
	     'div.sprint_stories-'+ id +'{page: sprint_stories;}' +
	     'table.table_summary{border: 1px solid;text-align: center;}'+
	     '.table_summary th, td {border: 1px solid;padding: 1%;width: 10%;}'+
	     '.storyth{width:3%;}'+
	     '#walkthroughbacklog {background-color: yellow;}'+
	     '#walkthroughtitle {background-color: #D3D3D3;}'+
	     '</style>'
	   );*/

	   html = $('.sprint_stories-'+id).html();
	   blob = new Blob([html], {
	     type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	   });
	   var newid = id + 1;
	   var title = 'Sprint Walkthrough';
	   //var title = 'Sprint Walkthrough'+ newid;
	   //console.log("neww id: "+newid);
	   url = URL.createObjectURL(blob);
	   link = document.createElement('A');
	   link.href = url;
	   link.download = title;  // default name without extension 
	   document.body.appendChild(link);
	   if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, title+'.docx'); // IE10-11
	       else link.click();  // other browsers
	   document.body.removeChild(link);
	 };

    var dropdown = '<span> Selected Backlog:<select id=\"select_backlog\" >';
   
        dropdown    += '</select></span>';
        $(dropdown).insertAfter('#summary_title');
        get_currentuser_backlogs($("#user_key").val(),"#select_backlog");
        
        $(document).on('change', '#select_backlog',function () {
       // $('#select_backlog').on('change', function () {
        var database = firebase.database();
        database.ref('user/' + $('#user_key').val() +'/selected_backlogs').set(
        {
          title: this.options[this.selectedIndex].text,
          key: this.options[this.selectedIndex].value
          });           
        window.location.href = "/walkthrough.php"
		});
                        
}