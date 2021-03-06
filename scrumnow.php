<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ScrumNow</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <script id="scrum_now" src="src/scrum_now.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>
    <script src="src/backlog_admin.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>

</head>

<body class='home'>    
<style>
    @media print {
        @page {
            size:landscape;
        }
    }
</style>
<div id="main-loading-container">
            <div id="loading-container" style="z-index: 111111 !important">
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
    <div id="main_screen" class="main_screen" style="display:none">
        <?php
            include('templates/header.php');
        ?>

        <style>body { overflow: hidden; }</style> <!--Benjoe needed to remove duplicate scrollbar-->
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
        <input type="hidden" id="sprint_date" value="">

        <input type="hidden" id="permitted_backlog" value="">
        <!-- end added -->
        <div>
        <select id="" ></select>

        </div>
        <table id="stories_table" class="display table responsive dataTable no-footer dtr-inline" cellspacing="0">
            <thead>
                <tr>
                    <th >Order</th>
                    <th >Key</th>
                    <th>Story ID</th>
                    <th style="width: 3% !important;">Sprint #<select id="selectinput" style="border:none;"></select></th>
                    <th style="width: 5% !important;">As a...</th>                  
                    <th style="width: 10% !important;">I want...</th>
                    <th style="width: 10% !important;">So that...</th>
                    <th style="width: 10% !important;">Acceptance Test</th>
                    <th style="width: 5% !important;">Story Points</th>
                    <th style="width: 10% !important;">Comments</th>
                    <th style="width: 50% !important;">Status</th>
                    <th style="width: 10% !important;">Action</th>
                </tr>
            </thead>
        </table>

        <br />

        

    </div>  

    <center><img src="images/rocket_scrumlogo.png" style="display:none; height: 400px;" ></center>
    <div class="remove_access" style="display: none;">

        <center><h2 id="no_backlog">You have no permission to access this backlog<br>
        contact the Administrator to have permission.</h2></center>

    </div>


    <!-- The Modal -->
    <div id="myModal" class="modal">

        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="close">×</span>
                <h2>Sprint Planning</h2>
            </div>
            <div class="modal-body sprintplanning">
                <div>
                    <div class="height_of_div_sp">
                        <div class="sprint-start-date-label">Sprint #:</div>
                        <div ><input type="text" id="sprint_number_input" readonly></input></div> <br>
                    </div>
                    <div class="height_of_div_sp">
                        <div class="sprint-start-date-label">Sprint Start Date:</div>
                        <div><input type="text" id="sprint_start_date" required></input></div><br>
                    </div>
                    <div class="height_of_div_sp">
                        <div class="sprint-end-date-label">Sprint End Date:</div>
                        <div><input type="text" id="sprint_end_date" required></input></div>
                    </div>
                         <h5>Note: Please select Start Date and End Date to proceed Sprint Planning</h5>
                </div><br />

                <input type="hidden" id="current_row_index" value="0" />
                <span id="span_is_recurring"> </span><br />
                <span id="as_a">As a - </span><br />
                <span id="i_want">I want - </span><br />
                <span id="so_that">So that - </span><br />
                <span id="acceptance_test">Acceptance Test - </span><br />
                <span id="comments">Comments - </span><br />
                <p><b>Estimate for this story:</b>
                    <select id="estimated_points" required>
                        <option disabled selected value> -- estimated points -- </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="8">8</option>
                        <option value="13">13</option>
                        <option value="21">21</option>
                        <option value="34">34</option>
                        <option value="55">55</option>
                        <option value="89">89</option>
                        <option value="144">144</option>
                    </select>

                
                    [running total: <span id="running_total"></span>]<br>
                    Points Definition: <span id="points_definition"></span></p>

                <!-- added for validation -->
                <span id="error_message" style="color:red;"></span>
                <button id='prev_button' onclick="sprint_planning_previous()">Previous</button>
                <button id='next_button'>Next</button>
                <button id='skip_button'>Skip</button>
                <button id='end_sprint_planning_button' onclick="end_sprint_planning()">End Sprint Planning</button>
            </div>
            <div class="modal-footer">
                <h4>Sprint Planning is a critical component of Scrum. To learn more about Sprint Planning, see <a id="scrum-guide" href='https://www.scrumalliance.org/why-scrum/scrum-guide'>Scrum Guide</a></h4>
            </div>
        </div>
    </div>

    <!--<div id="userSettings" class="modalsettings">
        <div class="modal-content">
            <div class="modal-header">
                <span class="close">×</span>
                <h2>User Settings</h2>
            </div>
            <div class="modalsettings-body">
                <div class="settings_label">User role: </div>
                <div class="settings_options">
                    <input type="checkbox" name="user_role" value="Product Owner" class="po" id="checkboxId"> Product Owner<br>
                    <input type="checkbox" name="user_role" value="Scrum Master" class="sm" id="checkboxId"> Scrum Master<br>
                    <input type="checkbox" name="user_role" value="Team Member" class="tm" id="checkboxId"> Team Member<br>
                </div>
            </div>
            <div class="modal-footer">
                <div class="settings_button">
                    <button id="save_settings" class="buttonsave" onclick="save_user_settings()">Save</button>
                </div>
            </div>
        </div>
    </div>-->

    
    <div id="definition_done" class="modal_done modal">
        <div class="modal-header">
            <span class="close" onclick="close_done_modal()">×</span>
            <h2>Definition of Done</h2>
        </div>
        <div class="modal-body done-body">
            <p align="justify">&nbsp; &nbsp; &nbsp; &nbsp; Development Teams deliver an Increment of product functionality every Sprint. All Increment should be useable, so a Product Owner may choose to immediately release it. If the definition of "done" for an increment is part of the conventions, standards or guidelines of the development organization, all Scrum Teams must follow it as a minimum. If "done" for an increment is not a convention of the development organization, the Development Team of the Scrum Team must define a definition of “done” appropriate for the product.
        </p></div>
        
        <div class="modal-footer done-footer">
            <div class="done_button">
                <button id="start_sprint_planning" class="buttonsave" >Start Sprint Planning</button>
                <button id="refine_stories" class="buttonsave" onclick="show_provide_estimates()">Provide estimate points on other stories</button>
            </div>
        </div>
    </div>

    <!--Added melvin !-->
    <div id="provide_estimates" class="provide_estimate_points modal">
        <div class="modal-header">
            <span class="close" onclick="close_provide_estimates_modal()">×</span>
            <h2>Provide Estimate Points</h2>
        </div>
        <div class="modal-body done-body">
        <h2>Please fill up the Story Points to continue to Sprint Planning</h2>
        
        <table id='stories_list' >
        <tr>
        <td id="header"><h4>As a</td>
        <td id="header"><h4>I want</td>
        <td id="header"><h4>So that</td>
        <td id="header"><h4>Acceptance Test</td>
        <td id="header"><h4>Story Points</h2></td>
        </tr>
        </table>
        
        </div>
        
        <div class="modal-footer done-footer">
            <div class="done_button">
                <button id="start_sprint_planning" class="buttonsave" onclick="proceed_planning()">Save Estimates</button>
            </div>
        </div>
    </div>

    <div id="error_estimates" class="error_estimates_modal modal">
        <div class="modal-header">
            <span class="close" onclick="close_error_provide_estimates_modal()">×</span>
            <h2>Oops!</h2>
        </div>
        <div class="modal-body error-estimate-body">
        There's still missing points <br>
        Please fill up the Story Points to continue to Sprint Planning
        
        </div>
        
        <div class="modal-footer done-footer">
            <div class="done_button">
                <button id="start_sprint_planning" class="buttonsave" onclick="close_error_provide_estimates_modal()">Continue to Estimate Points</button>
                </div>
            </div>
        </div>

        <div id="success_estimates" class="success_estimates_modal modal">
            <div class="modal-header">
                <span class="close" onclick="close_success_estimates_modal()">×</span>
                <h2>Success!</h2>
            </div>
            <div class="modal-body success-estimate-body">
            Points saved successfully!
            
            </div>
            
            <div class="modal-footer done-footer">
                <div class="done_button">
                    <button id="start_sprint_planning" class="buttonsave" onclick="success_planning_estimates_modal()">Proceed to Sprint Planning</button>
                    <button id="close_start_sprint_planning" class="buttonsave" onclick="close_success_estimates_modal()">Return to backlogs</button>


                </div>
            </div>
        </div>


    <!--End Added Melvin !-->
    <?php include('backlog_admin.php'); ?>

</body>

</html>
