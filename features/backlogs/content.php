<?php

	$output = "";
	$output = "<div>";
	$output .= "<input id='create-backlogs-button' type='button' value='Create backlog'>";
	$output .= "<input id='deleted-backlogs-button' type='button' value='Deleted backlog'>";
	$output .= "</div>";
	$output .="<table id='backlogs_table' class='display table responsive dataTable no-footer dtr-inline' cellspacing='0'>";
    $output .="<thead>";
    $output .="<tr>";
    $output .="    <th >Backlogs</th>";
    $output .="    <th class='dt-head-left' >Description</th>";
    $output .="    <th class='dt-head-left' >Action</th>";
    $output .="    <th class='dt-head-left' >Status Link</th>";
    $output .="</tr>";
	$output .="</thead>";
	$output .="</table>";
	$output .="<div id='modal-body' >";
	$output .="   <div class='modal-content backlogs-modal'>";
	$output .="       <div class='modal-header'>";
	$output .="           <span id='backlogs-close' class='close'>×</span>";
	$output .="           <h2 id='backlogs-caption'>Create New Backlog</h2>";
	$output .="       </div>";
	$output .="       <div class='backlogs-col'>";
	$output .="			<div class='backlogs-row backlogs-text'>";
	$output .="          	<div class='backlogs-label '>Name: </div>";
	$output .="		 	</div>";
	$output .="			<div class='backlogs-row'>";
	$output .="          	<input id='backlogs-title' type='text' class='backlogs-field'>";
	$output .="<div class='Backlog_DTE_Field_Error error-backlogs-title' style='display: none;'>\"Name\" field is required</div>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='backlogs-col'>";
	$output .="			<div class='backlogs-row backlogs-text'>";
	$output .="          	<div class='backlogs-label'>Description: </div>";
	$output .="		 	</div>";
	$output .="			<div class='backlogs-row'>";
	$output .="          	<Textarea id='backlogs-description' type='text' class='backlogs-field'></Textarea>";
	$output .="<div class='Backlog_DTE_Field_Error error-backlogs-description' style='display: none;'>\"Description\" field is required</div>";
	$output .="		 	</div>";
	$output .="       </div>";

	$output .="       <div class='backlogs-col'>";
	$output .="			<div class='backlogs-row backlogs-text'>";
	$output .="          	<div class='backlogs-label '>Summary Link: </div>";
	$output .="		 	</div>";
	$output .="			<div class='backlogs-row summary_link'>";
	//$output .="          	<a href='#'>Show Summary</a>";
	$output .="		 	</div>";
	$output .="       </div>";
	
	$output .="       <div class='backlogs-col'>";
	$output .="			<div class='backlogs-row backlogs-text'>";
	$output .="          	<div class='backlogs-label '>Active/Inactive: </div>";
	$output .="		 	</div>";

	$output .="			<div class='backlogs-row'>";
	$output .= "			<label class='switch-backlog'>";
	$output .= "			<input type='checkbox' id='in_active'>";
	$output .="				<div class='slider-backlog'></div>";	
	$output .="		 	</div>";
	$output .="       </div>";


	$output .="       <div class='modal-footer backlogs-footer'>";
	$output .="           <div class=''>";
	$output .="               <button id='save-backlogs' class='backlogs-save'>Save</button>";
	$output .="           </div>";
	$output .="       </div>";
	$output .="   </div>";
	$output .="</div>";
	$output .="   </div>";
	$output .="<div id='backlogs-modal-body' >";
	$output .="   <div class='modal-content delete-backlogs-modal'>";
	$output .="       <div class='modal-header'>";
	$output .="           <h2 >Confirm Delete</h2>";
	$output .="       </div>";
	$output .="		  <div class='backlogs-content'>";
	$output .="		  <h4>Are you sure you want to delete this backlogs?</h4>";
	$output .="		  </div>";
	$output .="<div class='modal-footer backlogs-footer'>";
	$output .="    <div class='confirm-delete-backlogs'>";
	$output .="    	  <button id='delete-backlogs' class='backlogs-delete'>Yes</button>";
	$output .="    	  <button id='cancel-delete-backlogs' onclick='close_delete_modal()' class='backlogs-cancel'>Cancel</button>";				  
	$output .="    </div>";
	$output .="</div>";
	$output .="<input type='hidden' id='backlogs_is_edit' value=''>";
	$output .="<input type='hidden' id='backlogs_edit_key' value=''>";
	$output .=" </div>";
	
	


	echo $output;
?>
