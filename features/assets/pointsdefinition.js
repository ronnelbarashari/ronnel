$( function() {

    
    //display Content of the body
    $.ajax({
        type: "POST",
        url: "features/pointsdefinition/content.php",
        data: {search: 'all'},
        success: function(result){
            $("#tabs-pointsdefinition > h2").text("Points Description");
            $("#pointsdefinition-body").html(result);
            $('#update').click(update_desc);
            $('#create-points').click(display_modal_points);
            $('#save-points').click(perform_save);
            $('#points-close').click(close_points_modal);
            
            load_pointsdesc_data();
        }
    });
   

    
});


    function display_modal_points(){

       var modal = $('.pointsdesc-modal');
    modal.attr("style","visibility: visible;");

    }

    function update_desc(){
        
        var key = $('#user-select').val();

        $('.backlogs_checkbox:checked').each(function(){
             
            
            selectedbacklog+=$(this).val()+";";
        });


        var database = firebase.database();
        var users = database.ref('points_description');

        database.ref('points_description/'+ key).update(
        {
            description: selectedbacklog,
            
        });  
       $("#success").css('visibility', 'visible');
    }


    function loadpointsdescdatatable(points_desc) {
        if(table !== undefined) {
            table.clear();
        }

        table = $('#points_def').DataTable(
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
                    }                    
                ],
                scrollX:true,
                //Adjusted to 100% from 130% -> Johann/Japs 3/23/17
                scrollXInner:"100%",
                scrollCollapse:true,
                data: points_desc,
                columns: [
                    
                    {
                        data: "points",
                        className: 'dt-points dt-definition'
                          
                    },
                    {
                        data: "description",
                        className: 'dt-description  dt-definition'
                       
                    },
                    {
                        data: "action",
                        className: 'dt-action dt-definition update_center'
                       
                    }
                                      
                ]
            });

    }



    function reset_text(){

        $('#description').val("");

    }

    function close_points_modal(){
        var modal = $('.pointsdesc-modal');
        modal.attr("style","visibility: hidden;");

        reset_text();

    }


    function edit_description(key){

            isedit = $('#scenarios_is_edit');
            isedit.val("True");
            editkey = $('#scenarios_edit_key');
            editkey.val(key);
            
            load_single_description_data(key);
            
    }

    function load_single_description_data(key){
        var points_definition = [];
        var database = firebase.database();
        var ref = database.ref('points_desc/' + key);
        ref.once('value').then(function(snapshot) {
                        var data = snapshot.val();
                        data.points,
                        data.description,
                        data.action;

                description = $('#description');

                description.val(data.description);


                $('.pointsdesc-modal').css("transform","translateY(-499px)");
                var modal = $('.pointsdesc-modal');
                modal.attr("style","transform: translateY(-500px)");
                modal.attr("style","visibility: visible;");

        });

    }



    function load_pointsdesc_data(){
        
        var points_definition = [];
        var database = firebase.database();
        //var table = $('#scenarios_stories_table').DataTable(); 
        var ref = database.ref('points_desc/');
        ref.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                    
                var child_data = childSnapshot.val();

                
                    //0331207 - get only active stories
                    var tmp_points_def = new points_def(
                        child_data.points,
                        child_data.description,
                        child_data.action);
                    points_definition.push(tmp_points_def);
                    

                        
            });
            
            loadpointsdescdatatable(points_definition);
        });

    }


    function perform_save() {
          

    var group, as_a, i_want, so_that, acceptance_test, story_points, comments;
    var database = firebase.database();
    //var scenariosref = database.ref('points_desc/');

    points = $('#points');
    description = $('#description');

    isedit = $('#scenarios_is_edit');
    editkey = $('#scenarios_edit_key');

        if(isedit.val() == ""){
            save_to_pointsdesc_firebase(points.val(), description.val());
        }else{
            save_to_editeddesc_firebase(editkey.val(), description.val());

        }

        reset_text();
        close_points_modal();
        load_pointsdesc_data();   
            
    }


    function save_to_editeddesc_firebase(key, description_var)
    {
        
        var database = firebase.database();
        //var pointdesc_tmp_key = database.ref('points_desc/').push().key;
        database.ref('/points_desc/' + key).update(
        {
            description: description_var,
            action: "<a class='edit_link'  onclick='edit_description(\""+ key +"\");' href='#'>Update</a>"
        });

        return key;
    }
   
    function save_to_pointsdesc_firebase(points_var,description_var)
    {
      
      var database = firebase.database();
      var pointdesc_tmp_key = database.ref('points_desc/').push().key;

       database.ref('/points_desc/' + pointdesc_tmp_key).set(
       {
          points: points_var,
          description: description_var,
          action: "<a class='edit_link'  onclick='edit_description(\""+ pointdesc_tmp_key +"\");' href='#'>Update</a>"
       });

       return pointdesc_tmp_key;

    }

