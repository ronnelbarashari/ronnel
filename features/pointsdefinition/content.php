<?php

	$output = "";

   // $output .= "<input id='create-points' type='button' value='Add Points'>";

	$output .="<table id='points_def' class='display table responsive dataTable no-footer dtr-inline' cellspacing='0'>";
    $output .="<thead>";
    $output .="<tr>";
    $output .="    <th  style=''>Story Points</th>";
    $output .="    <th  style=''>Description</th>";
    $output .="    <th  style=''>Action</th>";                  
    $output .="</tr>";
	$output .="</thead>";
	$output .="</table>";

	$output .= "<div id='modal-body'>";
	$output .="   <div class='modal-content pointsdesc-modal' style='transform: translateY(-499px) !important; visibility: hidden;'>";
	$output .="       <div class='modal-header'>";
	$output .="           <span id='points-close' class='close'>×</span>";
	$output .="           <h2>Points Description</h2>";
	$output .="       </div>";
	$output .="       <div class='pointsdesc-col'>";
	$output .="			<div class='pointsdesc-row'>";
	$output .="          	<div class='pointdesc-label'>Edit Description : </div>";
	$output .="		 	</div>";
	$output .="			<div class='pointsdesc-row'>";
	$output .="				<Textarea type='text' class='pointsdesc-field' id='description'></Textarea>";
	//$output .="          	<input id='description' type='text' class='pointsdesc-field'>";
	$output .="		 	</div>";
	$output .="       </div>";
	$output .="       <div class='modal-footer pointsdesc-footer'>";
	$output .="           <div class=''>";
	$output .="               <button id='save-points' class='pointsdesc-save'>Save</button>";
	$output .="           </div>";
	$output .="       </div>";
	$output .="   </div>";
	//$output .="<input type='hidden' id='pointsdesc_is_edit' value=''>";
	//$output .="<input type='hidden' id='pointsdesc_edit_key' value=''>";


	echo $output;

?>