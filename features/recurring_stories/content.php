<?php

	$output = "";
	$output .= "<div>";
	$output .="<input id='create-recurring-button' type='button' onclick='display_recurring_modal();' value='Create Recurring Story'>";
	$output .="</div>";
	$output .="<table id='recurring_stories_table' class='display table responsive dataTable no-footer dtr-inline' cellspacing='0'>";
	$output .="<thead>";
	$output .="<tr>";
	$output .="<th >Order</th>";
	$output .="<th >Key</th>";
	$output .="<th style=''>Recurring ID</th>";
	$output .="<th style='width: display: none;' >Sprint #<select id='selectinput' style='border:none;'></select></th>";
	$output .="<th style=''>As a...</th>";
	$output .="<th style=''>I want...</th>";
	$output .="<th style=''>So that...</th>";
	$output .="<th style=''>Acceptance Test</th>";
	$output .="<th style=''>Story Points</th>";
	$output .="<th>Comments</th>";
	$output .="<th class='' >Status</th>";
	$output .="<th class='' style=''>Action</th>";
	$output .="</tr>";
	$output .="</thead>";
	$output .="</table>";



	$output .="<div id='modal-body-sched' >";
	$output .="<div class='modal-content recurring-modal-sched'>";
	$output .="<div class='modal-header'>";
	$output .="<h2 >Recurring Schedule Settings</h2>";
	$output .="</div>";
	$output .="<div class='recurring-content'>";
	$output .="<h3>Select Schedule</h3>";
	$output .="<h5>Note: Please select number of Weeks/Month/Date and Select the start to save your recurring schedule.</h5>";



	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='numberrequired'>Select a number</div>";
	$output .="<div class='recurring-label'><select id='recurring-number' class='recurring-field' style='width: 200px;'>
							<option disabled='true' selected='' value='0'> -- Select a number -- </option>
							<option value='1'>1</option>
							<option value='2'>2</option>
							<option value='3'>3</option>
							<option value='4'>4</option>
							<option value='5'>5</option>
							<option value='6'>6</option>
							<option value='7'>7</option>
							<option value='8'>8</option>
							<option value='9'>9</option>
							</select></div>";
	$output .="</div>";
	$output .="</div>";

	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='dayrequired'>Select Week/Month/Year</div>";
	$output .="<select id='recurring-set' class='recurring-field' style='width: 200px;'>
							<option value='weekly'>Week/s</option>
							<option value='monthly'>Month/s</option>
							<option value='yearly'>Year/s</option>
							</select>";
	$output .="</div>";
	$output .="</div>";

	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='daterequired'>Choose Start Date</div>";
	$output .="<input id='recurring-date' type='text' class='recurring-field' value='Select Date'>";
	$output .="</div>";
	$output .="</div>";



	$output .="</div>";
	$output .="<div class='modal-footer recurring-footer'>";
	$output .="<div class='confirm-sched-recurring'>";
	$output .="<button id='set-schedule-recurring' onclick='save_recurring_sched()'>Set Schedule</button>";
	$output .="<button id='cancel-delete-recurring' onclick='close_sched_recurring_modal()' class='recurring-sched-cancel'>Cancel</button>";				
	$output .="</div>";
	$output .="</div>";


	$output .="<div id='modal-body' >";
	$output .=" <div class='modal-content recurring-modal'>";
	$output .=" <div class='modal-header'>";
	$output .=" <span id='recurring-close' class='close'>×</span>";
	$output .=" <h2 id='Recurring-title'>Create New Recurring Story</h2>";
	$output .=" </div>";
	$output .=" <div class='recurring-field-group'>";
	$output .=" <div class='recurring-col' id='drpCopy'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label'>Copy to another Backlog: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	$output .="<select id='markings' class='recurring field' style='display:none';></select>";
	$output .="</div>";
	$output .="</div>";



	$output .="<div class='recurring-col enable-set'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label '>Enable Schedule: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	$output .= "<label class='switch-recurring'>";
	$output .= "<input type='checkbox' id='onschedule'>";
	$output .= "<div class='slider-recurring'></div>";	
	$output .="<input id='create-recurring-button' type='button' class='manageschedule' onclick='display_recurring_schedule();' style='transform: translateX(70px);' value='Schedule Settings'>";
	$output .= "</label>";
	$output .="</div>";
	$output .="</div>";


	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label'>Recurring ID: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	$output .="<select id='recurring-story-id' class='recurring-field' style='width: 200px;'>
							<option value='Recurring-Story'>Recurring-Story</option>
							<option value='Recurring-Blog Post'>Recurring-Blog Post</option>
							<option value='Recurring-Check List'>Recurring-Check List</option>
							<option value='Recurring-Financial Report'>Recurring-Financial Report</option>
							<option value='Recurring-Site Support'>Recurring-Site Support</option>
							<option value='Recurring-Site Maintenace'>Recurring-Site Maintenace</option>
							</select>";
	$output .="<div class='Recurring_DTE_Field_Error recurring_id'>Recurring ID... field is required</div>";						
	$output .="</div>";
	$output .="</div>";

	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label'>As a...: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	$output .="<input id='recurring-as-a' type='text' class='recurring-field'>";
	$output .="<div class='Recurring_DTE_Field_Error recurring_as_a' >As a... field is required</div>";
	$output .="</div>";
	$output .="</div>";
	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label'>I want...: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	$output .="<input id='recurring-i-want-to' type='text' class='recurring-field'>";
	$output .="<div class='Recurring_DTE_Field_Error recurring_i_want' >I want... field is required</div>";
	$output .="</div>";
	$output .="</div>";
	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label'>So that...: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	$output .="<input id='recurring-so-that' type='text' class='recurring-field'>";
	$output .="<div class='Recurring_DTE_Field_Error recurring_so_that' >So that... field is required</div>";
	$output .="</div>";
	$output .="</div>";
	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label'>Acceptance Test: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	$output .="<Textarea type='text' class='recurring-field' id='recurring-acceptance-test'></Textarea>";
	$output .="<div class='Recurring_DTE_Field_Error recurring_acceptance_test' >Acceptance Test... field is required</div>";
	$output .="</div>";
	$output .="</div>";
	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label'>Story Points: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	//$output .="	<input id='recurring-story-points' type='text' class='recurring-field'>";
	$output .="<select id='recurring-story-points' id='estimated_points' class='recurring-field' required=''>";
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
	$output .="<div class='Recurring_DTE_Field_Error recurring_story_points' >Story Points... field is required</div>";
	$output .="</div>";
	$output .="</div>";
	$output .="<div class='recurring-col'>";
	$output .="<div class='recurring-row'>";
	$output .="<div class='recurring-label'>Comments.: </div>";
	$output .="</div>";
	$output .="<div class='recurring-row'>";
	$output .="<input id='recurring-comments' type='text' class='recurring-field'>";
	$output .="</div>";
	$output .="</div>";
	$output .=" </div>";
	$output .="<div class='modal-footer recurring-footer'>";
	$output .="<div class=''>";
	$output .="<button id='save-recurring' class='recurring-save'>Save</button>";
	$output .="</div>";
	$output .="</div>";
	$output .="</div>";
	$output .="</div>";
	$output .="</div>";
	$output .="<div id='recurring-modal-body' >";
	$output .="<div class='modal-content delete-recurring-modal'>";
	$output .="<div class='modal-header'>";
	$output .="<h2 >Confirm Delete</h2>";
	$output .="</div>";
	$output .="<div class='recurring-content'>";
	$output .="<h4>Are you sure you want to delete this recurring story?</h4>";
	$output .="</div>";
	$output .="<div class='modal-footer recurring-footer'>";
	$output .="<div class='confirm-delete-recurring'>";
	$output .="<button id='delete-recurring' class='recurring-delete'>Yes</button>";
	$output .="<button id='cancel-delete-recurring' onclick='close_delete_recurring_modal()' class='recurring-cancel'>Cancel</button>";				
	$output .="</div>";
	$output .="</div>";
	$output .="<input type='hidden' id='recurring_is_edit' value=''>";
	$output .="<input type='hidden' id='recurring_edit_key' value=''>";
	$output .="</div>";
	
	


	echo $output;
?>
