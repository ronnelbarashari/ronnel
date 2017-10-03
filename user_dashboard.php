<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>User Dashboard</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <link id="" rel="stylesheet" type="text/css" href="css/user_dashboard.css?v=<?php echo $GLOBALS['rsn_version'] ?>">
    <!--<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection">-->
    <script id="scrum_now" src="src/user_dashboard.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script id="best_practices" src="src/team_best_practices.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>
    <!--<script type="text/javascript" src="js/materialize.min.js"></script>-->
    <link rel='stylesheet' type='text/css' href='css/timepicki.css'/>
    <script type='text/javascript' src='js/jquery.min.js'></script>
    <script type='text/javascript' src='js/timepicki.js'></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body class='home'>  
<div class="modal-content backlogs-modal" style="visibility:hidden;">       
    <div class="modal-header">                      
        <h2 id="backlogs-caption">Create New Product Backlog</h2>       
    </div>       
    <div class="backlogs-col">          
        <div class="backlogs-row backlogs-text">            
            <div class="backlogs-label ">Name: </div>           
        </div>          
        <div class="backlogs-row">              
            <input id="backlogs-title" type="text" class="backlogs-field">
            <div class="Backlog_DTE_Field_Error error-backlogs-title" style="display: none;">"Name" field is required</div>         
        </div>       
    </div>       
    <div class="backlogs-col">          
        <div class="backlogs-row backlogs-text">            
            <div class="backlogs-label">Description: </div>         
        </div>          
    <div class="backlogs-row">              
        <textarea id="backlogs-description" type="text" class="backlogs-field"></textarea>
        <div class="Backlog_DTE_Field_Error error-backlogs-description" style="display: none;">"Description" field is required</div>            
    </div>
    <div class="backlogs-col">          
        <div class="backlogs-row backlogs-teams">            
            <div class="backlogs-label ">Add Scrum Teams: </div>           
        </div>          
        <div class='teams-row dev-team-row'>
            <p><div class='multiselect product_backlogs'><ul id='teams-select'></ul></div></p>
        </div>
    </div>       
    </div>       
    <div class="modal-footer backlogs-footer"> 
        <div class="dashboard-team-footer">               
            <a href="#" class="dashboard-team-footer-btn" onclick="save_backlog()">Save</a>
            <a onclick="closeModal()" class="dashboard-team-footer-btn" href="#">Cancel</a>
        </div>
    </div>   
</div>
<div class="modal-content scrum-events-modal" style="visibility:hidden;">       
    <div class="modal-header">                   
        <h2 id="teams-caption1">Select Team and Backlog</h2>       
    </div>       
    <div class="teams-col">            
        <div class="teams-row teams-text">              
            <div class="teams-label ">Team: </div>          
        </div>          
        <div class="teams-row">             
            <select id="scrum-team"><option>Choose Team</option></select>           
        </div>       
    </div>       
    <div class="teams-col">            
        <div class="teams-row teams-text">              
            <div class="teams-label ">Product Backlog: </div>           
        </div>          
        <div class="teams-row">             
            <select id="scrum-backlog"><option>Choose Backlog</option></select>         
        </div>       
    </div> 
    <div class="modal-footer teams-footer">           
        <div class="dashboard-team-footer">               
            <a href="#" id="start-sprint-planning" class="dashboard-team-footer-btn" onclick="proceedToSprintPlanning()">Proceed</a>
            <a onclick="closeModal()" class="dashboard-team-footer-btn" href="#">Cancel</a>
        </div>      
    </div>
</div>
<div class="modal-content best-practices-modal" style="visibility:hidden;"> 
    <input type="hidden" id="best-practices-team" value="" />      
    <div class="modal-header">                   
        <h2 id="teams-caption1">Add Best Practices Stories</h2>       
    </div>       
    <div class="teams-col">            
        <div class="teams-row teams-text">              
            <div class="teams-label ">Product Backlog: </div>           
        </div>          
        <div class="teams-row">             
            <select id="scrum-backlog1"><option>Choose Backlog</option></select>         
        </div>       
    </div> 
    <div class="teams-col">            
        <div class="teams-row teams-text">              
            <div class="teams-label ">Group: </div>          
        </div>          
        <div class="teams-row">             
            <select id="scrum-group">
                <option>Select Group</option>
                <option value="Go Live With WordPress">Go Live With WordPress</option>
                <option value="Onboard New Client">Onboard New Client</option>
            </select>           
        </div>  
        <div style="font-style:italic;">
            <p><label id="error-message"></label></p>
        </div>
        <div class="dashboard-loading-animation-best-practices" style="display:none;">
            <div id="loader">
                <div id="loader_1" class="loader"></div>
                <div id="loader_2" class="loader"></div>
                <div id="loader_3" class="loader"></div>
                <div id="loader_4" class="loader"></div>
                <div id="loader_5" class="loader"></div>
            </div>
        </div>
    </div>
    <div class="modal-footer teams-footer">           
        <div class="dashboard-team-footer">               
            <a href="#" id="add-best-practices-stories" class="dashboard-team-footer-btn" onclick="addStories()">Add Stories</a>
            <a onclick="closeModal()" class="dashboard-team-footer-btn" href="#">Cancel</a>
        </div>      
    </div>
</div>
<!-- <div class='modal-content add-users-teams-modal' style="visibility:hidden;">
    <div class='modal-header'>
        <h2 >Manage Team</h2>
    </div>
    <div class='modal-footer teams-footer'>
        <div class='confirm-add-user-teams'>
            <button id='save-add-members' onclick='update_members()' class='add-members-Save'>Save</button> 
            <button id='cancel-add-members' class='add-members-cancel' onclick='closeModal()'>Cancel</button>             
        </div>
    </div>
</div> -->
<div class="modal-content teams-modal" style="visibility:hidden;">       
    <div class="modal-header">                   
        <h2 id="teams-caption">My Scrum Team</h2>       
    </div>       
    <div class="teams-col">            
        <br>
        <div class="teams-row teams-text">              
            <div class="teams-label ">Name of Team: </div>          
        </div>          
        <div class="teams-row">             
            <input id="teams-title" type="text" class="teams-field">
            <div class="Teams_DTE_Field_Error error-teams-title" style="display: none;">"Name of Team" field is required</div>          
        </div>       
    </div>       
    <div class="teams-col">         
        <div class="teams-row teams-text">              
            <div class="teams-label">Description: </div>            
        </div>          
        <div class="teams-row">             
            <textarea id="teams-description" type="text" class="teams-field"></textarea>
            <div class="Teams_DTE_Field_Error error-teams-description" style="display: none;">"Description" field is required</div>         
        </div>        
    <!--     <div class="teams-row manage-set" style="visibility:hidden;">              
            <input id="manage-teams-button" onclick="show_members_modal()" class="managebuttons" type="button" value="Manage" style="display:inline-block">             
            </div> -->
    </div>
    <div class="teams-col"> 
        <div class='teams-content'>
            <div class='teams-col'>
                <div class='teams-row'>
                    <div class='teams-label'>Sprint Length: </div>
                </div>
                <div class='teams-row'>
                    <select id='SprintLength'><option value='1 Week'>1 Week</option><option value='2 Weeks'>2 Weeks</option><option value='3 Weeks'>3 Weeks</option><option value='4 Weeks'>4 Weeks</option></select>
                </div>
            </div>
            <div>
                <div class="teams-col">            
                <div class="teams-row teams-text">              
                 <div class="teams-label ">Sprint Planning:</div>          
            </div>          
            <div class="teams-row">
                <select id='planning_day'><option value='Monday'>Monday</option><option value='Tuesday'>Tuesday</option><option value='Wednesday'>Wednesday</option><option value='Thursday'>Thursday</option><option value='Friday'>Friday</option><option value='Saturday'>Saturday</option><option value='Sunday'>Sunday</option></select>           
                <input id="planning_timepicker" type="text" class="border-added"></div>       
            </div>
            <div class="teams-col">            
                <div class="teams-row teams-text">              
                 <div class=" ">Daily Scrum:</div>          
            </div>          
            <div class="teams-row">
                <!-- <select id='daily_scrum_day'><option value='1'>Daily</option></select>   -->           
                <input id="daily_scrum_timepicker" type="text" class="border-added"></div>       
            </div>
            <div class="teams-col">            
                <div class="teams-row teams-text">              
                 <div class="teams-label ">Sprint Review:</div>          
            </div>          
            <div class="teams-row">
                <select id='sprint_review_day'><option value='Monday'>Monday</option><option value='Tuesday'>Tuesday</option><option value='Wednesday'>Wednesday</option><option value='Thursday'>Thursday</option><option value='Friday'>Friday</option><option value='Saturday'>Saturday</option><option value='Sunday'>Sunday</option></select>
                <input id="review_timepicker" type="text" class="border-added"></div>       
            </div>
            <div class="teams-col">            
                <div class="teams-row teams-text">              
                 <div class=" ">Sprint Retrospective:</div>          
            </div>          
            <div class="teams-row">
                <select id='retrospective_day'><option value='Monday'>Monday</option><option value='Tuesday'>Tuesday</option><option value='Wednesday'>Wednesday</option><option value='Thursday'>Thursday</option><option value='Friday'>Friday</option><option value='Saturday'>Saturday</option><option value='Sunday'>Sunday</option></select>   
                <input id="retrospective_timepicker" type="text" class="border-added"></div>       
            </div>
            </div>
            <!-- <h4 style="margin:0;">Note: Only one Product Owner and Scrum Master can be chosen by each group.</h4> -->
            
            <div class='teams-col'>
                <div class='teams-row'>
                    <div class='teams-label'>Product Owner: </div>
                </div>
                <div class='teams-row'>
                    <p><select id='PO-select'><option disabled='true' selected='' value=''>Choose Product Owner</option></select></p>
                    <!-- <p class="dashboard-link" id="PO-name"></p> -->
                </div>
            </div>
            <div class='teams-col sm-col'>
                <div class='teams-row'>
                    <div class='teams-label '>Scrum Master: </div>
                </div>
                <div class='teams-row'>
                    <p><select id='SM-select'><option disabled='true' selected='' value=''>Choose Scrum Master</option></select></p>
                </div>
            </div>

            <div class='teams-col sm-col'>
                <div class='teams-row'>
                    <div class='teams-label '>Development Team: </div>
                </div>
                <div class='teams-row'>
                    <!-- <p><select id='SM-select'><option disabled='true' selected='' value=''>Choose Scrum Master</option></select></p>  -->
                    <span class="dashboard-link">&lt;Add Team Member&gt;</span>   
                </div>
                <div class='teams-row dev-team-row'>

                    <p><div class='multiselect development_team'><ul id='members-select'></ul></div></p>
                </div>
            </div>

            <div class='teams-col sm-col'>
                <div class='teams-row'>
                    <div class='teams-label '>Stakeholder: </div>
                </div>
                <div class='teams-row'>
                    <!-- <p><select id='SM-select'><option disabled='true' selected='' value=''>Choose Scrum Master</option></select></p>  -->
                    <span class="dashboard-link">&lt;Add Stakeholder&gt;</span>   
                </div>
                <div class='teams-row dev-team-row'>

                    <p><div class='multiselect stake_holder'><ul id='stake-select'></ul></div></p>
                </div>
            </div>

            <div class='teams-col sm-col'>
                <div class='teams-row'>
                    <div class='teams-label '>External Team Members: </div>
                </div>
                <div class='teams-row'>
                    <span class="dashboard-link">&lt;Add Team Member&gt;</span>
                </div>
            </div>

            <div class='teams-col sm-col'>
                <div class='teams-row'>
                    <div class='teams-label '>Organization Stakeholder: </div>
                </div>
                <div class='teams-row'>
                    <span class="dashboard-link">&lt;Add Stakeholder&gt;</span>   
                </div>
            </div>

            <div class='teams-col sm-col'>
                <div class='teams-row'>
                    <div class='teams-label '>External Stakeholder: </div>
                </div>
                <div class='teams-row'>
                    <span class="dashboard-link">&lt;Add Stakeholder&gt;</span>  
                </div>
            </div>

            <div class='teams-col'>
                <div class='teams-row'>
                    <div class='teams-label '>Product Backlogs:</div>
                </div>
                <div class='teams-row'>
                    <span class="dashboard-link">&lt;Create New&gt;</span>  
                </div>
                <div class='teams-row dev-team-row'>
                    <p><div class='multiselect product_backlogs'><ul id='backlogs-select'></ul></div></p>
                </div>
            </div>
            
            <div class='teams-col'>
                <div class='teams-row'>
                    <div class='teams-label'>***DANGER ZONE***</div>

                </div>
                <div class='teams-row dev-team-row delete-team-row' id="team-danger">
                    
                </div>
            </div>
        </div>
    </div>

    <div class="modal-footer teams-footer">           
        <div class="dashboard-team-footer">               
            <a href="#" id="create-new-team" class="dashboard-team-footer-btn" onclick="saveTeam()">Save</a>
            <a onclick="closeModal()" class="dashboard-team-footer-btn" href="#">Cancel</a>
        </div>      
    </div>
</div>
<div class="modal-content dashboard-modal-profile" style="visibility:hidden;">       
    <div class="modal-header">           
        <h2 class="dashboard-modal-title-text"></h2>       
    </div>        
    <div class="dashboard-modal-profile-content">                 
    </div>
    <div class="modal-footer teams-footer">    
        <div class="dashboard-modal">                 
            <button id="close-dashboard-modal" onclick="closeModal()" class="dashboard-close">OK</button>    
        </div>
    </div>
</div>

 <!--  Delete modal  !-->
<div id='teams-modal-body' >
    <div class='modal-content delete-teams-modal'>
        <div class='modal-header'>
            <h2 >Confirm Delete</h2>
        </div>
        <div class='teams-delete-content'>
            <h4>Are you sure you want to delete this team?</h4>
        </div>
        <div class='modal-footer teams-footer'>
            <div class='confirm-delete-teams'>
                <button id='delete-teams' class='teams-delete'>Yes</button>
                <button id='cancel-delete-teams' onclick='close_delete_teams_modal()' class='teams-cancel'>Cancel</button>             
            </div>
        </div>
        <input type='hidden' id='teams_is_edit' value=''>
        <input type='hidden' id='teams_edit_key' value=''>
    </div>
</div>

<div class="dashboard-loading-animation-initial" style="display:block;">
        <div id="loader">
            <div id="loader_1" class="loader"></div>
            <div id="loader_2" class="loader"></div>
            <div id="loader_3" class="loader"></div>
            <div id="loader_4" class="loader"></div>
            <div id="loader_5" class="loader"></div>
        </div>
    </div>
<div>
  <div id="main_screen" class="main_screen">
    <?php include('templates/header.php'); ?>
  </div>
</div>
<div class="container dashboard_no_access" style="display:none;">
        <center><h4 id="no_backlog">Sorry you have no access to this page<br>
        Please sign in or contact the Administrator to have permission.</h4><br>
        <a href="#" onclick="returntologin()" style="color:white"></a><button class="btn waves-effect waves-light" type="submit" name="action" style="background-color: #c86e1c;">
        <a href="#" onclick="returntologin()" style="color:white">Sign in to Rocket Scrum</a>
        </button></center>
    </div>
<div id="dashboard-container" style="display:none;">
    <div class="dashboard-section">
        <div class="dashboard-section-title">
            MY NOTIFICATIONS
        </div>
        <div>
          (coming soon)
        </div>
    </div>
    <div class="dashboard-section">
        <div class="dashboard-section-title">MY INVITES</div>
        <div>
          (coming soon)
        </div>
    </div>
    <div class="dashboard-section">
        <?php include('dashboard/teams.php'); ?>
    </div>
    <div class="dashboard-section">
        <div class="dashboard-section-title">SCRUM EVENTS</div>
        <div><a href="#" onclick="selectTeamBacklog()">Start Sprint Planning</a></div>
        <div><span class="dashboard-link">Start Daily Scrum (coming soon)</span></div>
        <div><span class="dashboard-link">Start Sprint Review (coming soon)</span></div>
        <div><span class="dashboard-link">Start Sprint Retrospective (coming soon)</span></div>
    </div>
    <div class="dashboard-section">
        <div class="dashboard-section-title">SCRUM TOOLS</div>
        <div><span class="dashboard-link">Rocket Scrum Tutorial (coming soon)</span></div>
        <div><a href="https://scrumnow.com/doku-wiki/doku.php">Rocket Scrum Wiki</a></div>
        <div><span class="dashboard-link">Scrum Quizzes (coming soon)</span></div>
        <div><span class="dashboard-link">Scrum Guide (coming soon)</span></div>
    </div>
    <div class="dashboard-section">
        <div class="dashboard-section-title">
            MY ORGANIZATIONS &nbsp;&nbsp;
            <span class="dashboard-new">&lt;Create New&gt; (coming soon)</span>
        </div>
        <div>
          <div><span>Scrum Now</span></div>
          <div><span>Portal Integrators</span></div>
        </div>
    </div>
</div>
<input type="hidden" id="user_key" value="">
</body>
</html>