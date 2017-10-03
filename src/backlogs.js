

$( function() {

	console.log("backlogs Stories js loaded.");

	//display Content of the body
	$.ajax({
        type: "POST",
        url: "features/backlogs/content.php",
        data: {search: 'all'},
        success: function(result){
            //console.log("Result: " + result);
            $("#backlogs-body").html(result);
            $('#create-backlogs-button').click(display_backlogs_modal);
            $('#save-backlogs').click(save_backlogs);
            $('#backlogs-close').click(close_modal);

            //load_data();
        }
    });
	
});



function save_backlogs() {
	  		
var as_a, i_want, so_that, acceptance_test, story_points, comments;
var database = firebase.database();
var backlogsref = database.ref('backlogs_stories/');

as_a = $('#backlogs-as-a');
i_want = $('#backlogs-i-want-to');


    save_to_firebase(as_a.val(),i_want.val());

close_modal();
//load_data();
}

function display_backlogs_modal(){

	var modal = $('.backlogs-modal');
	modal.attr("style","visibility: visible;");
}

function edit_backlogs(key){
    isedit = $('#backlogs_is_edit');
    isedit.val("True");
    editkey = $('#backlogs_edit_key');
    editkey.val(key);
    console.log("display modal:" + key);
    load_single_data(key);
    
}

function close_modal(){
	var modal = $('.backlogs-modal');
	modal.attr("style","visibility: hidden;");
	console.log("display modal");
}

function close_delete_modal(){
    var modal = $('.delete-backlogs-modal');
    modal.attr("style","visibility: hidden;");
    
}


function display_delete_modal(key){
    var deletebutton = $('#delete-backlogs');
    deletebutton.attr("onclick","delete_backlogs(\""+ key +"\");");

    var modal = $('.delete-backlogs-modal');
    modal.attr("style","visibility: visible;");
    
    
}


function save_to_firebase(title ,descriptions)
{
  var database = firebase.database();
  var tmp_key = database.ref('backlogs/').push().key;

   database.ref('/backlogs/' + tmp_key).set(
   {
      title: title,
      descriptions: descriptions,
      key:tmp_key
      });
   return tmp_key;
}

/*function loadDataTable(backlogs) {
        if(table !== undefined) {
            table.clear();
        }

        table = $('#backlogs_stories_table').DataTable(
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
                //buttons: [
                //{
                //    text: 'Active Stories',
                //    className: 'active_stories',
                //    action: function() {
                       // show_active_stories();
                //]
                columnDefs: [
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
                    }
                   
                ],
                scrollX:true,
                //Adjusted to 100% from 130% -> Johann/Japs 3/23/17
                scrollXInner:"100%",
                scrollCollapse:true,
                data: backlogs,
                columns: [
                    
                    {
                        data: "title",
                        className: 'dt-head-left backlogs-title'
                    },
                    {
                        data: "descriptions",
                        className: 'dt-head-left backlogs-descriptions'
                    }
                    
                ]
            });
            table.buttons().containers().appendTo( '.rs-navigation' ); //button reposition

            // Restore record
            table.on('click', 'a.restore_link',function(e)
            {

                e.preventDefault();

                editor.title('Restore')
                    .message('Are you sure you want to restore this story?')
                    .buttons({
                        label:'Restore',
                        fn: function(){this.submit();}
                    })
                    .remove($(this).closest('tr'));
               
            });

            //03312017 - show active stories
           

    }

    function load_data(){
    	var backlogs = [];
    	var database = firebase.database();
  		var ref = database.ref('backlogs/');
	    ref.once('value').then(function(snapshot) {
	        snapshot.forEach(function(childSnapshot) {
	            var key = childSnapshot.key;
	            var child_data = childSnapshot.val();
	           
	                //0331207 - get only active stories
	                var tmp_user_backlogs = new user_backlogs(
	                    child_data.title,
                        child_data.decriptions
	                    )
	                    
	                backlogs.push(tmp_user_backlogs);
	            
	        });
	        loadDataTable(backlogs);
    	});

    }

    function load_single_data(key){
        var backlogs = [];
        var database = firebase.database();
        var ref = database.ref('backlogs_stories/' + key);
        ref.once('value').then(function(snapshot) {
                        var data = snapshot.val();
                        data.order,
                        key,
                        data.storyid,
                        data.sprint_number,
                        data.as_a,
                        data.i_want,
                        data.so_that,
                        data.acceptance_test,
                        data.story_points,
                        data.comments,
                        data.status,
                        data.edit_del;
                console.log("val:" + data.i_want);

                as_a = $('#backlogs-as-a');
                i_want = $('#backlogs-i-want-to');
                so_that = $('#backlogs-so-that');
                acceptance_test = $('#backlogs-acceptance-test');
                story_points = $('#backlogs-story-points');
                comments = $('#backlogs-comments');

                as_a.val(data.as_a);
                i_want.val(data.i_want);
                so_that.val(data.so_that);
                acceptance_test.val(data.acceptance_test);
                story_points.val(data.story_points);
                comments.val(data.comments);

                title = $('#backlogs-title');
                title.html("Edit backlogs Story");
                var modal = $('.backlogs-modal');
                modal.attr("style","visibility: visible;");


        });

    }

    function delete_backlogs(key){
        console.log("Delete:"+key);
        delete_story(key);
        
        close_delete_modal();
    }


function update_story(key,storyid_var ,sprint_number_var, as_a_var, i_want_var, so_that_var, acceptance_test_var, story_points_var, comments_var, order_var)
{
  var database = firebase.database();
  

   database.ref('/backlogs_stories/' + key).set(
   {
      order: order_var,
      key: key,
      storyid: storyid_var,
      sprint_number: sprint_number_var,
      as_a: as_a_var,
      i_want: i_want_var,
      so_that: so_that_var,
      acceptance_test: acceptance_test_var,
      story_points: story_points_var,
      comments: comments_var,
      status: "",
      edit_del: "<a class='edit_link'  onclick='edit_backlogs(\""+ key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_modal(\""+ key +"\");' href='#'>Delete</a>"
   });
   return key;
}

function delete_story(key)
{
  var database = firebase.database();
  

   database.ref('/backlogs_stories/' + key).remove();
   return key;
}
*/