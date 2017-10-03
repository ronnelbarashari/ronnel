<?php
	
	// $directory = "../../logs/";
	// $files = glob($directory . "*.txt");

	// $options = "";
	// foreach ($files as $file) {
	// 	if($options == "") {
	// 		$options = "<option value=''>Select log file</option>";
	// 	}
	// 	$options .= "<option value='$file'>" . str_replace("$directory", "", $file) . "</option>"; 
	// }

	$logfiles = "<div>";
	$logfiles .= "<span>";
	$logfiles .= "<label>Selected Backlog: </label>";
	$logfiles .= "<select id='sv_select_backlog'></select>";
	$logfiles .= "</span>";
	$logfiles .= "</div>";
	$logfiles .= "<div style='margin-top:10px;'>";
	$logfiles .= "<span id='log_files_container'></span>";
	$logfiles .= "</div>";

	echo $logfiles;

?>