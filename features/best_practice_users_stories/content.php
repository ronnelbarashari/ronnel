<?php

$permission = $_REQUEST["permission"];

$output = "";
	$output .= "<div><input id='bestpractice_edit' type='hidden' value='' />";
	if($permission == "admin") {
		$output .="<input id='create-user-story-button' type='button' onclick='display_best_practice_modal();' value='Create User Story'>";
		$output .="<input id='add-to-backlog-button' type='button' onclick='display_best_practice_add_backlog()' value='Add to Backlog'><br><br>";
	}

	$output .= "<p>Select Group: <select id='filtergroup'><option></option></select></p>";

	$output .= "<input type='hidden' id='max_story_id' value='0' style='visibility:hidden;'>";
	$output .= "</div>";
	$output .="<table id='bestpractice_stories_table' class='display table responsive dataTable no-footer dtr-inline' cellspacing='0'>";
    $output .="<thead>";
    $output .="<tr>";
    $output .="    <th >Order</th>";
    $output .="    <th >Key</th>";
    $output .="    <th style=''>Story ID</th>";
    $output .="    <th style='width: display: none;' >Sprint #<select id='selectinput' style='border:none;'></select></th>";
    $output .="    <th style=''>As a...</th>";                  
    $output .="    <th style=''>I want...</th>";
    $output .="    <th style=''>So that...</th>";
    $output .="    <th style=''>Acceptance Test</th>";
    $output .="    <th style=''>Story Points</th>";
    $output .="    <th style=''>Comments</th>";
    $output .="    <th style=''>Status</th>";
    $output .="    <th style=''>Group</th>";
    $output .="    <th style=''>Action</th>";
    $output .="</tr>";
	$output .="</thead>";
	$output .="</table>";

	$output .="<div class='best_practice_modal' id='modal-body'>";
	$output .=" <div class='modal-content bestpractice-modal'>";
	$output .=" <div class='modal-header'>";
	$output .=" <span id='bestpractice-close' class='close'>×</span>";
	$output .=" <h2 id='bestpractice-title'>Create New Industry Standard Best Practices</h2>";
	$output .=" </div>";
	
	$output .="       <div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>Group: </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";

	$output .="<input id='bestpractice-group' name='group_bestpractice' type='text' class='bestpractice-field' style='width: 167px;' list='bestpractice-dropdown'>";
	$output .="<datalist id='bestpractice-dropdown'>";
	$output .="</datalist>";
	$output .="<div class='Scenario_DTE_Field_Error scenario_group'>Group... field is required</div>";

	$output .="		 	</div>";
	$output .="       </div>";

	$output .="       <div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>As a...: </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<input id='bestpractice-as-a' type='text' class='bestpractice-field'>";
	$output .="<div class='Scenario_DTE_Field_Error scenario_as_a'>\"As a\" field is required</div>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>I want...: </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<input id='bestpractice-i-want-to' type='text' class='bestpractice-field'>";
	$output .="<div class='Scenario_DTE_Field_Error scenario_i_want'>\"I want\" field is required</div>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>So that...: </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<input id='bestpractice-so-that' type='text' class='bestpractice-field'>";
	$output .="<div class='Scenario_DTE_Field_Error scenario_so_that'>\"So that\" field is required</div>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>Acceptance Test: </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<Textarea type='text' class='bestpractice-field' id='bestpractice-acceptance-test'></Textarea>";
	$output .="<div class='Scenario_DTE_Field_Error scenario_acceptance_test'>\"Acceptance Test\" field is required</div>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>Story Points: </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";
	$output .="<select id='bestpractice-story-points'  class='recurring-field' required=''>";
		$output .="<option disabled='true' selected='' value=''> -- estimated points -- </option>";
		$output .="<option value='1'>1</option>";
		$output .="<option value='2'>2</option>";
		$output .="<option value='3'>3</option>";
		$output .="<option value='5'>5</option>";
		$output .="<option value='8'>8</option>";
		$output .="<option value='13'>13</option>";
		$output .="<option value='21'>21</option>";
		$output .="<option value='34'>34</option>";
		$output .="<option value='55'>55</option>";
		$output .="<option value='89'>89</option>";
		$output .="<option value='144'>144</option>";
	$output .="</select>";
	$output .="<div class='Scenario_DTE_Field_Error scenario_story_points'>\"Story Points\" field is required</div>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>Comments.: </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<input id='bestpractice-comments' type='text' class='bestpractice-field'>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='modal-footer bestpractice-footer'>";
	$output .="           <div class=''>";
	$output .="               <button id='save-bestpractice' class='bestpractice-save'>Save</button>";
	$output .="           </div>";
	$output .="       </div>";
	$output .="   </div>";
	$output .="</div>";

	$output .="<div id='recurring-modal-body' class='delete_this_bestpractice'>";
	$output .="<div class='modal-content delete-bestpractices-modal'>";
	$output .="<div class='modal-header'>";
	$output .="<h2 >Confirm Delete</h2>";
	$output .="</div>";
	$output .="<div class='recurring-content'>";
	$output .="<h4>Are you sure you want to delete this story?</h4>";
	$output .="</div>";
	$output .="<div class='modal-footer recurring-footer'>";
	$output .="<div class='confirm-delete-recurring'>";
	$output .="<button id='cancel-delete-recurring' onclick='close_delete_bestpractices_modal()' class='recurring-cancel'>Cancel</button>";	
	$output .="<button id='delete-recurring' class='recurring-delete'>Yes</button>";
	$output .="</div>";
	$output .="</div>";
	$output .="</div>";
	//add to backlog
	$output .=" <div id='best-practice-add-backlog'>";
	$output .=" <div class='modal-content bestpractice-modal'>";
	$output .=" 	<div class='modal-header'>";
	$output .=" 		<span id='best-practice-add-backlog-close' class='close'>×</span>";
	$output .=" 		<h2 id='bestpractice-title'>Add to Backlog</h2>";
	$output .=" 	</div>";
	
	$output .="     <div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>Select Backlog: </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";
	$output .="		 		<select id='backlog-select'>
							</select>";
	$output .="		 	</div>";
	$output .="    	</div>";

	$output .="    	<div class='bestpractice-col'>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<div class='bestpractice-label'>Add as Recurring? </div>";
	$output .="		 	</div>";
	$output .="			<div class='bestpractice-row'>";
	$output .="          	<label class='switch-bestpractice'><input type='checkbox' id='recurring-bestpractice' checked='true'>
								<div class='slider-bestpractice'> </div></label>";
	$output .="		 	</div>";
	$output .="     </div>";

	$output .="      <div class='modal-footer bestpractice-footer'>";
	$output .="          <div class=''>";
	$output .="              <button id='save-to-backlog' class='bestpractice-save' onclick='bestpractice_save_backlog()'>Save</button>";
	$output .="          </div>";
	$output .="      </div>";
	$output .="</div>";
	$output .="</div>";

echo $output;
?>