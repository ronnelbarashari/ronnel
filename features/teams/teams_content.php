<?php

	$output = "";
	$output = "<div>";
	$output .= "<input id='create-teams-button' type='button' value='Create Team'>";
	$output .= "</div>";
	$output .="<table id='teams_table' class='display table responsive dataTable no-footer dtr-inline' cellspacing='0'>";
    $output .="<thead>";
    $output .="<tr>";
    $output .="    <th class='dt-head-left' >Teams</th>";
    $output .="    <th class='dt-head-left' >Description</th>";
    $output .="    <th class='dt-head-left' >Action</th>";
    $output .="</tr>";
	$output .="</thead>";
	$output .="</table>";
	$output .="<div id='modal-body' >";
	$output .="   <div class='modal-content teams-modal'>";
	$output .="       <div class='modal-header'>";
	$output .="           <span id='teams-close' class='close'>×</span>";
	$output .="           <h2 id='teams-caption'>Create New Team</h2>";
	$output .="       </div>";
	$output .="       <div class='teams-col'>";
	$output .="			<div class='teams-row teams-text'>";
	$output .="          	<div class='teams-label '>Name of Team: </div>";
	$output .="		 	</div>";
	$output .="			<div class='teams-row'>";
	$output .="          	<input id='teams-title' type='text' class='teams-field'>";
	$output .="<div class='Teams_DTE_Field_Error error-teams-title' style='display: none;'>\"Name of Team\" field is required</div>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='teams-col'>";
	$output .="			<div class='teams-row teams-text'>";
	$output .="          	<div class='teams-label'>Description: </div>";
	$output .="		 	</div>";
	$output .="			<div class='teams-row'>";
	$output .="          	<Textarea id='teams-description' type='text' class='teams-field'></Textarea>";
	$output .="<div class='Teams_DTE_Field_Error error-teams-description' style='display: none;'>\"Description\" field is required</div>";
	$output .="		 	</div>";

	$output .="			<div class='teams-row'>";
	//$output .="          	<input id='manage-teams-button' onclick='show_members_modal()' type='button' value='Manage'>";
	$output .="		 	</div>";


	$output .="			<div class='teams-row manage-set'>";
	$output .="          	<input id='manage-teams-button' onclick='show_members_modal()' class='managebuttons' type='button' value='Manage' style='display:inline-block'>";
	$output .="          	<input id='manage-teams-button' onclick='show_all_members()' class='viewbuttons' type='button' value='View'>";
	$output .="		 	</div>";

	$output .="       </div>";
	$output .="       <div class='modal-footer teams-footer'>";
	$output .="           <div class=''>";
	$output .="               <button id='save-teams' class='teams-save'>Save</button>";
	$output .="           </div>";
	$output .="       </div>";
	$output .="   </div>";
	$output .="</div>";
	$output .="   </div>";
	$output .="<div id='teams-modal-body' >";
	$output .="   <div class='modal-content delete-teams-modal'>";
	$output .="       <div class='modal-header'>";
	$output .="           <h2 >Confirm Delete</h2>";
	$output .="       </div>";
	$output .="		  <div class='teams-delete-content'>";
	$output .="		  <h4>Are you sure you want to delete this team?</h4>";
	$output .="		  </div>";
	$output .="<div class='modal-footer teams-footer'>";
	$output .="    <div class='confirm-delete-teams'>";
	$output .="    	  <button id='delete-teams' class='teams-delete'>Yes</button>";
	$output .="    	  <button id='cancel-delete-teams' onclick='close_delete_teams_modal()' class='teams-cancel'>Cancel</button>";				  
	$output .="    </div>";
	$output .="</div>";
	$output .="<input type='hidden' id='teams_is_edit' value=''>";
	$output .="<input type='hidden' id='teams_edit_key' value=''>";
	$output .=" </div>";
	
	$output .="<div id='teams-modal-body'>";
	$output .="   <div class='modal-content add-users-teams-modal'>";
	$output .="       <div class='modal-header'>";
	$output .="           <h2 >Manage Team</h2>";
	$output .="       </div>";
	$output .="		  <div class='teams-content'>";	


	$output .="       <h4>Note: Only one Product Owner and Scrum Master can be chosen by each group.</h4>";

	$output .="       <div class='teams-col'>";
	$output .="			<div class='teams-row'>";
	$output .="          	<div class='teams-label '>Product Owner: </div>";
	$output .="		 	</div>";
	$output .="			<div class='teams-row'>";
	$output .= "<p><select id='PO-select'><option disabled='true' selected='' value=''>Choose Product Owner</option></select></p>";	
	$output .="		 	</div>";
	$output .="       </div>";


	$output .="       <div class='teams-col sm-col'>";
	$output .="			<div class='teams-row'>";
	$output .="          	<div class='teams-label '>Scrum Master: </div>";
	$output .="		 	</div>";
	$output .="			<div class='teams-row'>";
	$output .= "<p><select id='SM-select'><option disabled='true' selected='' value=''>Choose Scrum Master</option></select></p>";	
	$output .="		 	</div>";
	$output .="       </div>";


	$output .="       <div class='teams-col'>";
	$output .="			<div class='teams-row'>";
	$output .="          	<div class='teams-label '>Development Team </div>";
	$output .="		 	</div>";

	$output .="			<div class='teams-row dev-team-row'>";
	$output .= "	  <p><div class='multiselect development_team'><ul id='members-select'></ul></div></p>";	
	$output .="		 	</div>";
	$output .="       </div>";

	$output .="       <div class='teams-col'>";
	$output .="			<div class='teams-row'>";
	$output .="          	<div class='teams-label '>Product Backlogs:</div>";
	$output .="		 	</div>";

	$output .="			<div class='teams-row dev-team-row'>";
	$output .= "	  <p><div class='multiselect product_backlogs'><ul id='backlogs-select'></ul></div></p>";	
	$output .="		 	</div>";
	$output .="       </div>";


	$output .="		  </div>";
	$output .="<div class='modal-footer teams-footer'>";
	$output .="    <div class='confirm-add-user-teams'>";
	$output .="    	  <button id='save-add-members' onclick='update_members()' class='add-members-Save'>Save</button>";		
	$output .="    	  <button id='cancel-add-members' class='add-members-cancel' onclick='close_manage_members()'>Cancel</button>";				  
	$output .="    </div>";
	$output .="</div>";
		$output .="</div>";

	//last

	$output .="<div id='modal-body' >";
	$output .="   <div class='modal-content teams-list'>";
	$output .="       <div class='modal-header'>";
	$output .="           <span id='teams-close' class='close' onclick='close_team_list()'>×</span>";
	$output .="           <h2 id='teams-caption'>Team Members</h2>";
	$output .="       </div>";
	$output .="       <div class='teams-col'>";
	$output .="		  <p>Team members</p>";
	$output .= "<table id='team_list' ><tr><h3><center><td id='heads'>Members</td><td id='heads'>Role</td></h3></center></tr>";
	$output .= "</table>";
	$output .="       </div>";
	$output .="	  </div>";
	$output .="</div>";
	
	echo $output;

?>
