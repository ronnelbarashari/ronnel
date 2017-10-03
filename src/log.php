<?php

//echo $_POST['data'];

$output = "";
if(isset($_POST['data'])) {
	foreach ($_POST['data'] as $i => $item) {
		$output .= date('mdYHis') . "\t" . $_POST['data'][$i]["added_by"] . " added story with id " . $_POST['data'][$i]["story"];
		if($_POST['data'][$i]["remarks"] != "") {
			$output .= " : " . str_replace(";", " ", $_POST['data'][$i]["remarks"]);
		}
		$output .= " \n";
	}
}

if($output != "") {
	$filename = 'log_'.date('mdY') . '.txt';

	if(!isset($_POST['backlog_path'])) {
		$myfile = file_put_contents('../logs/' . $filename, $output , FILE_APPEND | LOCK_EX);
	} else {
		$myfile = file_put_contents('../logs/' . $_POST['backlog_path'] . '/' . $filename, $output , FILE_APPEND | LOCK_EX);
	}
	
}

echo $output;

?>