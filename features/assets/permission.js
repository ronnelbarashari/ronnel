$( function() {


    //display Content of the body
    $.ajax({
        type: "POST",
        url: "features/permissions/permission-content.php",
        data: {search: 'all'},
        success: function(result){
            $("#tabs-permission > h2").text("Plugin Permissions");
            $("#permission-body").html(result);
            $('#showusers').click(show_users);
            $('#registeruser').click(register_users);
            $('#addpermission').click(settings_permission);
            $('#get_key').click(plugin_secret_key);
            $('.register-permission').click(registerpermission); 
            $('.add-permission').click(setpermission);
            $('.remove-permission').click(removepermission);
            $('#generate-key').click(show_confirm_generate_key);
            $('#secret-key-yes').click(generate_key);
            $('#cancel-secret-key').click(hide_modal);

            get_secret_key();
            var database = firebase.database();
            var users = database.ref('user');

            users.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var child_data = childSnapshot.val();
                    var key = childSnapshot.key;
                    
                    if(child_data.email != undefined && child_data.email != "" ){
                        
                        $("#users_list").append('<li>' + child_data.email + '</li>');
                        $('#user-select').append('<option value="'+ key+'">'+child_data.email+'</option>');
                        $('#admin-select').append('<option value="'+ key+'">'+child_data.email+'</option>');

                    }

                });
            });
                
            var ref = database.ref('backlogs');
            ref.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var child_data = childSnapshot.val();              
                    var tmp_backlogs = new user_backlogs(
                        child_data.title,
                        key,
                        child_data.descriptions
                    );

                    database.ref('user').once('value').then(function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var key = childSnapshot.key;
                            var child_data = childSnapshot.val();
                            var backlogpermission = ""; 
                            

                            if(child_data.email == $("#user-select option:selected").text()) {
                                if(child_data.permittedbacklog != ""){
                                    backlogpermission = child_data.permittedbacklog.split(";");
                                }
                                for(var i=0; i<backlogpermission.length; i++){ 
                                    
                                    $(":checkbox[name='backlogs_checkbox']").each(function(){
                                        
                                        if(backlogpermission[i] == this.value && !this.checked){
                                            this.checked = "checked";
                                        }
                                    });
                                }
                            } 
                        });
                    });

                    
                if(child_data.status != "archive"){
                    $('#backlog-select').append( '<li><input type="checkbox" class="backlogs_checkbox" name="backlogs_checkbox" value="'+ child_data.title+'">'+child_data.title+'</li>' );
                }
                });

            });
        }
    });

   function show_users(){
        $( "#view_user_list" ).toggle( "slow", function() {
            if($('#view_user_list').css('display')=='none'){
                $("#showusers").attr('src',"images/plus_icon.png");
            }else{
                $("#showusers").attr('src',"images/minus_icon.png");
            }
        });
    }   

    function register_users(){
        $( "#register_user" ).toggle( "slow", function() {
            if($('#register_user').css('display')=='none'){
                $("#registeruser").attr('src',"images/plus_icon.png");
            }else{
                $("#registeruser").attr('src',"images/minus_icon.png");
            }
        });
    }

    function settings_permission(){
        $( "#settingspermission" ).toggle( "slow", function() {

            if($('#settingspermission').css('display')=='none'){
                $("#addpermission").attr('src',"images/plus_icon.png");
            }else{
                $("#addpermission").attr('src',"images/minus_icon.png");
            }
        });
    }

    function registerpermission(){
        
        var key = $('#user-select').val();
        var selectedbacklog="";

        $('.backlogs_checkbox:checked').each(function(){
             
            selectedbacklog+=$(this).val()+";";
        });


        var database = firebase.database();
        var users = database.ref('user');

        database.ref('user/'+ key).update(
        {
            permittedbacklog: selectedbacklog,
            
        });  
       $("#success").css('visibility', 'visible');
    }


    function setpermission(){


        var database = firebase.database();
        var users = database.ref('user');
        var key = $('#admin-select').val();
        var user_permission = "admin";

        database.ref('user/'+ key).update(
        {
            userpermission: user_permission,
            
        }); 


        $("#access_granted").css('visibility', 'visible');
        $("#access_remove").css('visibility', 'hidden');

    }


    function removepermission(){

        var database = firebase.database();
        var users = database.ref('user');
        var key = $('#admin-select').val();
        var user_permission = "";

        database.ref('user/'+ key).update(
        {
            userpermission: user_permission,
            
        }); 

        $("#access_granted").css('visibility', 'hidden');
        $("#access_remove").css('visibility', 'visible');
    }


    $(document).on('change', '#user-select',function () {
        $(":checkbox[name='backlogs_checkbox']").each(function(){
            
            if(this.checked){
                $('.backlogs_checkbox').prop('checked', false);
            }
        });
        var database = firebase.database();
        var selectedbacklog = this.options[this.selectedIndex].text;
        
        database.ref('user').once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var child_data = childSnapshot.val();
              var backlogpermission = ""; 
              
              if(child_data.email == selectedbacklog) {
                if(child_data.permittedbacklog != ""){
                  backlogpermission = child_data.permittedbacklog.split(";");
                }
                for(var i=0; i<backlogpermission.length; i++){ 
                  
                  $(":checkbox[name='backlogs_checkbox']").each(function(){
                    
                    if(backlogpermission[i] == this.value && !this.checked){
                      this.checked = "checked";
                   
                        }
                      });
                    }
                  } 
                });
        });
    });
    
    
    function plugin_secret_key(){
        $( "#plugin_secret_key" ).toggle( "slow", function() {

            if($('#plugin_secret_key').css('display')=='none'){
                $("#get_key").attr('src',"images/plus_icon.png");
            }else{
                $("#get_key").attr('src',"images/minus_icon.png");
            }
        });
    }


    function generate_key(){
        console.log("Test");
        var database = firebase.database();
        var current_user_key = $('#user_key').val();
        var secret_key = database.ref('user/'+ current_user_key + "/secret_key").push().key;
        
        database.ref('user/'+ current_user_key + "/secret_key").update(
        {
            key: secret_key,    
        });

        $('#current_key').val(secret_key);
        hide_modal();
    }


    function show_confirm_generate_key(){
        if($('#current_key').val() != ''){
            $('#secret-key-modal').css('visibility','visible');
        }
        else{
           generate_key(); 
        }
        

    }

    function get_secret_key(){
        var current_user_key = $('#user_key').val();
         var ref = database.ref('user/'+ current_user_key);
          ref.once('value').then(function(snapshot) {
               
                   //var key = childSnapshot.key;
                   var child_data = snapshot.val();
                       //0331207 - get only active stories
                       console.log(snapshot.val());
                     $('#current_key').val(child_data.secret_key.key);
          });
    }

    function hide_modal(){
        $('#secret-key-modal').css('visibility','hidden');
    }
});