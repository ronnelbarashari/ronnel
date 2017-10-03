<?php

	$file_path = filter_var($_POST['file_path'], FILTER_SANITIZE_STRING);

	if(isset($file_path)) {
		$contents = file_get_contents($file_path);
	}

	echo '<textarea style="width:100%;height:250px;margin-top:20px;font-size:15px;white-space:pre;overflow-wrap:normal;overflow-x:scroll;" readonly>' . $contents . '</textarea>';

?>