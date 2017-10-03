<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ScrumNow</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    
</head>

<body style="overflow: hidden;">      
    <div id="main_screen" class="main_screen">
        <?php
            include('templates/header.php');
        ?>

        <!--<div id='rs-top-header' style='height: 15px;'>

        </div>
        <div id='rs-main-header'>
            <div class='rs-logo' style='float: left; width: 25%;'>
                <img src="images/portal_logo.png" style='width: 80%;'>
            </div>
            <div class='rs-navigation'>

            </div>
        </div>-->

        <!-- added Melvin and Mariel for filtering done -->
        <input type="hidden" id="max_story_id" value="0">
        <input type="hidden" id="current_version" value="0">
        <input type="hidden" id="user_key" value="">
        <input type="hidden" id="user_role" value="">
        <input type="hidden" id="current_sprint" value="">
        <input type="hidden" id="min_order" value="">
        <!-- end added -->
        <table id="stories_table" class="display table responsive dataTable no-footer dtr-inline" cellspacing="0">
            <thead>
                <tr>
                    <th >Order</th>
                    <th >Key</th>
                    <th style="width: 6%;">Story ID</th>
                    <th style="width: 6%;">Sprint #<select id="selectinput" style="border:none;"></select></th>
                    <th style="width: 6%;">As a...</th>                  
                    <th style="width: 14%;">I want...</th>
                    <th style="width: 18%;">So that...</th>
                    <th style="width: 18%;">Acceptance Test</th>
                    <th style="width: 8%;">Story Points</th>
                    <th style="width: 15%;">Comments</th>
                    <th class="dt-head-left" >Status</th>
                    <th class="dt-head-left" style="width: 20%;">Action</th>
                </tr>
            </thead>
        </table>

        <br />
        <div id="loading-container">
            <div id="circularG">
                <div id="circularG_1" class="circularG"></div>
                <div id="circularG_2" class="circularG"></div>
                <div id="circularG_3" class="circularG"></div>
                <div id="circularG_4" class="circularG"></div>
                <div id="circularG_5" class="circularG"></div>
                <div id="circularG_6" class="circularG"></div>
                <div id="circularG_7" class="circularG"></div>
                <div id="circularG_8" class="circularG"></div>
            </div>
        </div>

    </div>  

   
   
</body>

</html>
