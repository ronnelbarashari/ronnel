<?php
	
	$backlog = $_POST['backlog_path'];

	//$directory = "../../logs/";
	$directory = "../../logs/" . $backlog . "/";

	if(!is_dir($directory)) {
		//directory does not exist
		mkdir($directory, 0777, true);
	}

	$files = glob($directory . "*.txt");

	$options = "";
	foreach ($files as $file) {
		if($options == "") {
			$options = "<option value=''>Select log file</option>";
		}
		$options .= "<option value='$file'>" . str_replace("$directory", "", $file) . "</option>"; 
	}

	if($options != "") {
		echo "<label>Log File: </label><select id='sv_log_files' onchange='showLogFile()'>" . $options . "</select>";
	} else {
		echo "No log files generated yet for this backlog.";
	}

	
?>