<?php
   include_once('Mailer.php'); 
   $mailer=new Mailer(); 
   $mailer->send_email('barasharironnel@yahoo.com','First email','Hello world!'); 
   echo "Mail sent";
 ?> 