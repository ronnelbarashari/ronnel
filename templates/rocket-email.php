<?php

$to = "ronnel.barashari@portalintegrators.com";
$subject = $_POST['subject'];
$message = $_POST['message'];
$from_name = $_POST['frname'];
$from_email = $_POST['fremail'];
$headers = "From: ".$from_name." <".$from_email.">\r\n";
$headers .= "CC:barasharironnel@yahoo.com";

$success = mail($to, $subject, $message, $headers);
if (!$success) {
    $errorMessage = error_get_last()['message'];
}
else{
	$errorMessage = "gg na sir";
}
?>