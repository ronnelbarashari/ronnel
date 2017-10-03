<?php

//echo $_POST['data'];

$output = "";
if(isset($_POST['data'])) {
	foreach ($_POST['data'] as $i => $item) {
		if($_POST['data'][$i]["changed_column"] == "Story ID" && $_POST['data'][$i]["old_value"] == 0) {
			$output .= date('mdYHis') . "\t" . $_POST['data'][$i]["modified_by"];
		} 
		else if($_POST['data'][$i]["changed_column"] == "Backlog"){		
			$output .= date('mdYHis') . "\t" . $_POST['data'][$i]["modified_by"]; 		
		}
		else {
			$output .= date('mdYHis') . "\t" . $_POST['data'][$i]["modified_by"] . " changed story with id " . $_POST['data'][$i]["story"] . "'s " . $_POST['data'][$i]["changed_column"] . " from '" . $_POST['data'][$i]["old_value"] . "' to '" . $_POST['data'][$i]["new_value"] . "' ";
		}
		
		if($_POST['data'][$i]["remarks"] != "") {
			$output .= " : " . str_replace(";", " ", $_POST['data'][$i]["remarks"]);
		}
		$output .= " \n";
	}
}

if($output != "") {
	$filename = 'log_'.date('mdY') . '.txt';

	if (!is_dir('logs/' . $_POST['backlog_path'])) {		
  		// dir doesn't exist, make it		
	  	mkdir('logs/' . $_POST['backlog_path']);		
	}

	if(!isset($_POST['backlog_path'])) {
		$myfile = file_put_contents('logs/' . $filename, $output , FILE_APPEND | LOCK_EX);
	} else {
		$myfile = file_put_contents('logs/' . $_POST['backlog_path'] . '/' . $filename, $output , FILE_APPEND | LOCK_EX);
	}
}

echo $output;

?>