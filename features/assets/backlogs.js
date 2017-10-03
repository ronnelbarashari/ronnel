
var in_active = false;
$( function() {

    
    //display Content of the body
    $.ajax({
        type: "POST",
        url: "features/backlogs/content.php",
        data: {search: 'all'},
        success: function(result){
            $("#tabs-backlogs > h2").text("Manage backlogs");
            $("#backlogs-body").html(result);
            $('#create-backlogs-button').click(display_backlogs_modal);
            $('#deleted-backlogs-button').click(display_backlogs);
            $('#save-backlogs').click(save_backlogs);
            $('#backlogs-close').click(close_backlog_modal);
            $('#in_active').click(status_backlog);

            load_backlog_data();
        }
    });
    
});

function status_backlog(){
    if(this.checked==true){
        in_active = true;   
    }else{
        in_active = false;
    }
}

function display_backlogs(){
    var $el = $(this);
    $el.val($el.val() == "Active Backlog" ? "Deleted Backlog": "Active Backlog");
    
    if($('#deleted-backlogs-button').val()=="Active Backlog"){  
        load_deleted_backlog();
    }else{
        load_backlog_data();
        
    }
}

function save_backlogs() {
            
    var title, descriptions;
    var database = firebase.database();
    var backlogsref = database.ref('backlogs_stories/');

    title = $('#backlogs-title');
    descriptions = $('#backlogs-description');
    var hasblank = false;
    if(title.val() == ""){
        $('.Backlog_DTE_Field_Error.error-backlogs-title').css("display","block");
        hasblank = true;
    }else{
        $('.Backlog_DTE_Field_Error.error-backlogs-title').css("display","none");
    }

    if(descriptions.val() == ""){
        $('.Backlog_DTE_Field_Error.error-backlogs-description').css("display","block");
        hasblank = true;
    }else{
        $('.Backlog_DTE_Field_Error.error-backlogs-description').css("display","none");
    }

    if(!hasblank){
        is_edit = $('#backlogs_is_edit');
        edit_key = $('#backlogs_edit_key');
        if(is_edit.val() == ''){
            save_backlog_to_firebase(title.val(),descriptions.val());
        }
        else{
            update_backlogs(title.val(),descriptions.val(),edit_key.val());
        }

        close_backlog_modal();
        load_backlog_data();
    }
    
//load_backlog_data();
}

function display_backlogs_modal(){
    hide_error();
    var modal = $('.backlogs-modal');
    modal.attr("style","visibility: visible;");
}

function edit_backlogs(key){
    isedit = $('#backlogs_is_edit');
    isedit.val("True");
    editkey = $('#backlogs_edit_key');
    editkey.val(key);
    
    load_single_backlog_data(key);
    
}

function close_backlog_modal(){
    hide_error();
    var modal = $('.backlogs-modal');
    modal.attr("style","visibility: hidden;");
    $('.status_link').empty();
    title = $('#backlogs-title');
    title.val('');
    descriptions = $('#backlogs-description');
    caption = $('#backlogs-caption');
    caption.html("Create New Backlog");
    
    descriptions.val('');

}

function close_delete_modal(){
    var modal = $('.delete-backlogs-modal');
    modal.attr("style","visibility: hidden;");
    
}


function display_delete_backlog_modal(key){
    var deletebutton = $('#delete-backlogs');
    deletebutton.attr("onclick","delete_backlogs(\""+ key +"\");");

    var modal = $('.delete-backlogs-modal');
    modal.attr("style","visibility: visible;");
    
    
}



function loadbacklogDataTable(backlogs) {
        if(table !== undefined) {
            table.clear();
        }

        table = $('#backlogs_table').DataTable(
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
                select: false,
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
                        visible: true
                    },
                    {
                        targets: [1],
                        visible: true
                    },
                    {
                        targets: [3],
                        visible: false
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
                    },
                    {
                        data: "edit_link",
                        className: 'dt-head-left backlogs-edit-link'
                    }
                    ,
                    {
                        data: "status_link",
                        className: 'dt-head-left backlogs-status-link'
                    }
                   
                    
                ]
            });
           // table.buttons().containers().appendTo( '.rs-navigation' ); //button reposition

            // Restore record
          /*  table.on('click', 'a.restore_link',function(e)
            {

                e.preventDefault();

                editor.title('Restore')
                    .message('Are you sure you want to restore this story?')
                    .buttons({
                        label:'Restore',
                        fn: function(){this.submit();}
                    })
                    .remove($(this).closest('tr'));
               
            });*/

            //03312017 - show active stories
           

}

function load_deleted_backlog(){
    var backlogs = [];
    var database = firebase.database();
    var ref = database.ref('backlogs/');
    ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var child_data = childSnapshot.val();
            if(child_data.status == "archive") {
           
                //0331207 - get only active stories
                var tmp_user_backlogs = new user_backlogs(
                    child_data.title,
                    child_data.descriptions, 
                    child_data.key,
                    child_data.edit_link, "<a class='status_link' href='" + encodeURI(window.location.origin + "/backlog_status.php?key=" + child_data.key) + "'>Show Status</a>"
                    );
                    
                backlogs.push(tmp_user_backlogs);

                
            }
        });
        
        loadbacklogDataTable(backlogs);
       
    });

}

function load_backlog_data(){
var database = firebase.database();
var teamref = database.ref('teams/');
var backlog_ref = database.ref('backlogs/');
var is_member = false;
var dropdown="";

var currentuser_backlogs = []; 
    teamref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var child_data = childSnapshot.val(); 
            is_member = false;
            switch($('#user_key').val()){
                case child_data.members.product_owner:
                    is_member = true;
                    break;
                case child_data.members.scrum_master:
                    is_member = true;
                    break;
                case child_data.members.team_member1:
                    is_member = true;
                    break;
                case child_data.members.team_member2:
                    is_member = true;
                    break;
                case child_data.members.team_member3:
                    is_member = true;
                    break;
                case child_data.members.team_member4:
                    is_member = true;
                    break;
                case child_data.members.team_member5:
                    is_member = true;
                    break;
                case child_data.members.team_member6:
                    is_member = true;
                    break;
                case child_data.members.team_member7:
                    is_member = true;
                    break;
                case child_data.members.team_member8:
                    is_member = true;
                    break;
                case child_data.members.team_member9:
                    is_member = true;
                    break;
            }
            if(is_member){
                var backlogs = child_data.backlogs.split(",");
                backlogs.forEach(function (backlog){
                    var is_included = false;
                    currentuser_backlogs.forEach(function (current_backlog){
                        if(current_backlog == backlog)
                        {
                            is_included = true;
                        }
                    });
                    if(!is_included){
                        currentuser_backlogs.push(backlog);
                    }
                });
                /*
                 database.ref('/teams/' + child_data.key).on('child_changed', function(childSnapshot, prevChildKey) {
                        load_backlog_data();
                });
                */

            }
        });

        var backlogs_info = [];
        //console.log("Current user backlogs:" + currentuser_backlogs);
        backlog_ref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                currentuser_backlogs.forEach(function(currentuser_backlog){
                    if(currentuser_backlog == childSnapshot.val().key){
                        backlogs_info.push({key: currentuser_backlog, title: childSnapshot.val().title});
                    }
                    
                });

            });
            
            

            var backlogs = [];
            var database = firebase.database();
                var ref = database.ref('backlogs/');
            ref.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var child_data = childSnapshot.val();
                    if(child_data.status != "archive") {
                        //0331207 - get only active stories
                        var tmp_user_backlogs = new user_backlogs(
                            child_data.title,
                            child_data.descriptions, 
                            child_data.key,
                            child_data.edit_link, "<a class='status_link' href='" + encodeURI(window.location.origin + "/backlog_status.php?key=" + child_data.key) + "'>Show Status</a>"
                            );
                        backlogs_info.forEach(function(user_backlog){
                            if(user_backlog.key == child_data.key){
                                backlogs.push(tmp_user_backlogs);
                            }
                            
                        });

                        }
                    
                });
                
                loadbacklogDataTable(backlogs);
               
            });

        });

    });






    
}

function load_single_backlog_data(key){
    var backlogs = [];
    var database = firebase.database();
    var ref = database.ref('backlogs/' + key);
    ref.once('value').then(function(snapshot) {
                    var data = snapshot.val();
                    data.title,
                    data.descriptions,
                    data.key,
                    data.edit_link
                    data.status
            
            if(data.status != null && data.status != "inactive"){
                $('#in_active').prop("checked",true);
            }else{
                $('#in_active').prop("checked",false);
            }
            $('.status_link').empty();
           title = $('#backlogs-title');
           descriptions = $('#backlogs-description');
            title.val(data.title);
            descriptions.val(data.descriptions);
            $(".summary_link").append("<a class='status_link' href='" + encodeURI(window.location.origin + "/backlog_status.php?key=" + data.key) + "'>Show Status</a>")
            title = $('#backlogs-caption');
            title.html("Product Backlog Administration");
            var modal = $('.backlogs-modal');
            modal.attr("style","visibility: visible;");


    });

}


function save_backlog_to_firebase(title ,descriptions)
{
  var database = firebase.database();
  var tmp_key = database.ref('backlogs/').push().key;
  if(in_active == true){
       database.ref('/backlogs/' + tmp_key).set(
       {
          title: title,
          descriptions: descriptions,
          key:tmp_key,
          status: "active",
          edit_link: "<a class='edit_link'  onclick='edit_backlogs(\""+ tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_backlog_modal(\""+ tmp_key +"\");' href='#'>Delete</a>"
        });
       $('#backlog-select').append( '<input type="checkbox" class="backlogs_checkbox" name="backlogs_checkbox" value="'+ title+'">'+title );
       return tmp_key;
    }else{
        database.ref('/backlogs/' + tmp_key).set(
        {
        title: title,
          descriptions: descriptions,
          key:tmp_key,
          status: "inactive",
          edit_link: "<a class='edit_link'  onclick='edit_backlogs(\""+ tmp_key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_backlog_modal(\""+ tmp_key +"\");' href='#'>Delete</a>"
        });
       $('#backlog-select').append( '<input type="checkbox" class="backlogs_checkbox" name="backlogs_checkbox" value="'+ title+'">'+title );
       return tmp_key;
    }
}

function update_backlogs(title ,descriptions,key)
{
  var database = firebase.database();
  
    if(in_active == true){
       database.ref('/backlogs/' + key).update(
       {
          title: title,
          descriptions: descriptions,
          status: "active"
       });
       return key;
    }else{
        database.ref('/backlogs/' + key).update(
       {
          title: title,
          descriptions: descriptions,
          status: "inactive"
       });
       return key;
    }
}


function restore_backlogs(key)
{

  
  var database = firebase.database();
  var tmp_key = database.ref('backlogs/').push().key;

   database.ref('/backlogs/' + key).update(
   {
      status: "active",
      edit_link: "<a class='edit_link'  onclick='edit_backlogs(\""+ key +"\");' href='#'>Edit</a>/<a class='remove_link' onclick='display_delete_backlog_modal(\""+ key +"\");' href='#'>Delete</a>"
      
   });

    load_backlog_data();
   return key;

}



function delete_backlogs(key)
{
  var database = firebase.database();
  var tmp_key = database.ref('backlogs/').push().key;

   database.ref('/backlogs/' + key).update(
   {
      status: "archive",
      edit_link: "<a class='restore_link'  onclick='restore_backlogs(\""+ key +"\");' href='#'>Restore</a>"
      
   });

   close_delete_modal();
    load_backlog_data();
   return key;


}


function inactive_backlogs(key)
{
  var database = firebase.database();
  var tmp_key = database.ref('backlogs/').push().key;

   database.ref('/backlogs/' + key).update(
   {
      status: "inactive",
      edit_link: "<a class='restore_link'  onclick='restore_backlogs(\""+ key +"\");' href='#'>Restore</a>"
   });

    close_delete_modal();
    load_backlog_data();
    return key;
}

function hide_error(){
    $('.Backlog_DTE_Field_Error.error-backlogs-title').css("display","none");
    $('.Backlog_DTE_Field_Error.error-backlogs-description').css("display","none");

}

function tablerefresh(){

   
}



